import Peer, { DataConnection, MediaConnection } from 'peerjs';
import { RemoteMessage, RemoteRole } from '@/types';
import { useRemoteStore } from '@/stores/remoteStore';
import { useSessionStore } from '@/stores/sessionStore';

class RemoteManager {
  private peer: Peer | null = null;
  private dataConnection: DataConnection | null = null;
  private mediaConnection: MediaConnection | null = null;
  private localStream: MediaStream | null = null;
  private countdownCallback: ((duration: number) => void) | null = null;
  private flashCallback: (() => void) | null = null;

  // Generate a friendly, random 6-character room code like "TW8492"
  public generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'TW-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  public setLocalStream(stream: MediaStream | null) {
    this.localStream = stream;
    // If we have an active call without stream or needing replaceTrack:
    if (this.peer && this.mediaConnection && stream) {
      // Stream is available
    }
  }

  public setCountdownCallback(cb: ((duration: number) => void) | null) {
    this.countdownCallback = cb;
  }

  public setFlashCallback(cb: (() => void) | null) {
    this.flashCallback = cb;
  }

  /**
   * Host creates a room
   */
  public async createRoom(preferredCode?: string): Promise<string> {
    this.disconnect();
    const code = preferredCode || this.generateRoomCode();
    const peerId = `twogether-${code.toLowerCase().replace(/[^a-z0-9]/g, '')}-host`;

    useRemoteStore.getState().setRoomCode(code);
    useRemoteStore.getState().setRole('host');
    useRemoteStore.getState().setStatus('creating');
    useRemoteStore.getState().setErrorMessage(null);

    return new Promise((resolve, reject) => {
      try {
        const peer = new Peer(peerId, {
          debug: 1,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' },
            ],
          },
        });

        this.peer = peer;

        peer.on('open', () => {
          useRemoteStore.getState().setStatus('waiting-for-peer');
          resolve(code);
        });

        peer.on('connection', (conn) => {
          // If already connected to someone else, reject
          if (this.dataConnection && this.dataConnection.open) {
            conn.on('open', () => {
              conn.send({ type: 'ROOM_FULL' });
              setTimeout(() => conn.close(), 500);
            });
            return;
          }

          this.setupDataConnection(conn, 'host');
        });

        peer.on('call', (call) => {
          this.mediaConnection = call;
          if (this.localStream) {
            call.answer(this.localStream);
          } else {
            call.answer();
          }

          call.on('stream', (remoteStream) => {
            useRemoteStore.getState().setRemoteStream(remoteStream);
          });

          call.on('close', () => {
            useRemoteStore.getState().setRemoteStream(null);
          });

          call.on('error', (err) => {
            console.error('Media connection error:', err);
          });
        });

        peer.on('error', (err: Error & { type?: string }) => {
          console.error('PeerJS error:', err);
          if (err.type === 'unavailable-id') {
            useRemoteStore.getState().setStatus('error');
            useRemoteStore.getState().setErrorMessage('Room code is currently in use. Please generate a new code.');
          } else {
            useRemoteStore.getState().setStatus('error');
            useRemoteStore.getState().setErrorMessage(err.message || 'Connection error occurred.');
          }
          reject(err);
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        useRemoteStore.getState().setStatus('error');
        useRemoteStore.getState().setErrorMessage(error.message || 'Failed to initialize peer.');
        reject(error);
      }
    });
  }

  /**
   * Guest joins an existing room
   */
  public async joinRoom(code: string, guestName?: string): Promise<void> {
    this.disconnect();
    const cleanCode = code.trim().toUpperCase();
    const normalizedCode = cleanCode.toLowerCase().replace(/[^a-z0-9]/g, '');
    const hostPeerId = `twogether-${normalizedCode}-host`;
    const guestPeerId = `twogether-${normalizedCode}-guest-${Math.random().toString(36).substring(2, 6)}`;

    useRemoteStore.getState().setRoomCode(cleanCode);
    useRemoteStore.getState().setRole('guest');
    useRemoteStore.getState().setStatus('joining');
    useRemoteStore.getState().setErrorMessage(null);

    return new Promise((resolve, reject) => {
      try {
        const peer = new Peer(guestPeerId, {
          debug: 1,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' },
            ],
          },
        });

        this.peer = peer;

        peer.on('open', () => {
          // Connect data channel to host
          const conn = peer.connect(hostPeerId, { reliable: true });
          this.setupDataConnection(conn, 'guest', guestName);

          // Initiate call to host if stream is ready
          if (this.localStream) {
            const call = peer.call(hostPeerId, this.localStream);
            this.setupCall(call);
          }

          resolve();
        });

        peer.on('call', (call) => {
          // In case host calls guest
          this.mediaConnection = call;
          if (this.localStream) {
            call.answer(this.localStream);
          } else {
            call.answer();
          }

          call.on('stream', (remoteStream) => {
            useRemoteStore.getState().setRemoteStream(remoteStream);
          });
        });

        peer.on('error', (err: Error & { type?: string }) => {
          console.error('PeerJS error:', err);
          if (err.type === 'peer-unavailable') {
            useRemoteStore.getState().setStatus('error');
            useRemoteStore.getState().setErrorMessage('Room not found or host has disconnected. Check the code.');
          } else {
            useRemoteStore.getState().setStatus('error');
            useRemoteStore.getState().setErrorMessage(err.message || 'Failed to connect to room.');
          }
          reject(err);
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        useRemoteStore.getState().setStatus('error');
        useRemoteStore.getState().setErrorMessage(error.message || 'Failed to initialize peer.');
        reject(error);
      }
    });
  }

  private setupCall(call: MediaConnection) {
    this.mediaConnection = call;
    call.on('stream', (remoteStream) => {
      useRemoteStore.getState().setRemoteStream(remoteStream);
    });

    call.on('close', () => {
      useRemoteStore.getState().setRemoteStream(null);
    });

    call.on('error', (err) => {
      console.error('Call error:', err);
    });
  }

  private setupDataConnection(conn: DataConnection, role: RemoteRole, customName?: string) {
    this.dataConnection = conn;

    conn.on('open', () => {
      useRemoteStore.getState().setStatus('connected');
      const myName = customName || useRemoteStore.getState().userName;
      this.send({ type: 'PARTNER_JOINED', name: myName });

      // If we are guest and have a local stream, ensure call is established
      if (role === 'guest' && this.peer && this.localStream && !this.mediaConnection) {
        const cleanCode = (useRemoteStore.getState().roomCode || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const hostPeerId = `twogether-${cleanCode}-host`;
        const call = this.peer.call(hostPeerId, this.localStream);
        this.setupCall(call);
      }
    });

    conn.on('data', (data: unknown) => {
      this.handleIncomingMessage(data as RemoteMessage);
    });

    conn.on('close', () => {
      useRemoteStore.getState().setStatus('disconnected');
      useRemoteStore.getState().setRemoteStream(null);
      useRemoteStore.getState().setIsPartnerReady(false);
    });

    conn.on('error', (err) => {
      console.error('Data connection error:', err);
    });
  }

  private handleIncomingMessage(msg: RemoteMessage) {
    switch (msg.type) {
      case 'PARTNER_JOINED':
        useRemoteStore.getState().setPartnerName(msg.name || 'Partner');
        useRemoteStore.getState().setStatus('connected');
        break;

      case 'SYNC_READY':
        useRemoteStore.getState().setIsPartnerReady(msg.isReady);
        break;

      case 'START_COUNTDOWN':
        if (this.countdownCallback) {
          this.countdownCallback(msg.duration);
        }
        break;

      case 'CAPTURE_FRAME':
        useSessionStore.getState().addFrame({
          round: msg.round,
          slot: msg.slot,
          dataUrl: msg.dataUrl,
          timestamp: Date.now(),
        });
        if (this.flashCallback) {
          this.flashCallback();
        }
        break;

      case 'RETAKE_ROUND':
        useSessionStore.getState().setRetakeTargetRound(msg.round);
        useSessionStore.getState().setCurrentRound(msg.round);
        useSessionStore.getState().setStep('capture');
        break;

      case 'PROCEED_STEP':
        useSessionStore.getState().setStep(msg.step);
        break;

      case 'ROOM_FULL':
        useRemoteStore.getState().setStatus('room-full');
        useRemoteStore.getState().setErrorMessage('This photo booth room is full (maximum 2 participants).');
        this.disconnect();
        break;

      case 'PEER_LEFT':
        useRemoteStore.getState().setStatus('disconnected');
        useRemoteStore.getState().setRemoteStream(null);
        break;
    }
  }

  public send(msg: RemoteMessage) {
    if (this.dataConnection && this.dataConnection.open) {
      this.dataConnection.send(msg);
    }
  }

  public disconnect() {
    if (this.dataConnection) {
      try {
        this.dataConnection.send({ type: 'PEER_LEFT' });
        this.dataConnection.close();
      } catch {
        // Ignore
      }
      this.dataConnection = null;
    }

    if (this.mediaConnection) {
      try {
        this.mediaConnection.close();
      } catch {
        // Ignore
      }
      this.mediaConnection = null;
    }

    if (this.peer) {
      try {
        this.peer.destroy();
      } catch {
        // Ignore
      }
      this.peer = null;
    }

    useRemoteStore.getState().resetRemote();
  }
}

export const remoteManager = new RemoteManager();
