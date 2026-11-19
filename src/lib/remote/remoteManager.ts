import Peer, { DataConnection, MediaConnection } from 'peerjs';
import { RemoteMessage, RemoteRole } from '@/types';
import { useRemoteStore } from '@/stores/remoteStore';
import { useSessionStore } from '@/stores/sessionStore';

class RemoteManager {
  private peer: Peer | null = null;
  private dataConnection: DataConnection | null = null;
  private mediaConnection: MediaConnection | null = null;
  private pendingIncomingCall: MediaConnection | null = null;
  private remotePeerId: string | null = null;
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
    if (!stream) return;

    // 1. If we have a pending incoming call waiting for our stream, answer it now!
    if (this.pendingIncomingCall) {
      const call = this.pendingIncomingCall;
      this.pendingIncomingCall = null;
      this.mediaConnection = call;
      call.answer(stream);
      this.setupCall(call);
      return;
    }

    // 2. If we already have an active call, update tracks
    if (this.mediaConnection && this.mediaConnection.peerConnection) {
      const pc = this.mediaConnection.peerConnection;
      const senders = pc.getSenders();
      for (const track of stream.getTracks()) {
        const sender = senders.find((s) => s.track && s.track.kind === track.kind);
        if (sender) {
          sender.replaceTrack(track).catch((err) => console.warn('replaceTrack warning:', err));
        } else {
          try {
            pc.addTrack(track, stream);
          } catch (err) {
            console.warn('addTrack warning:', err);
          }
        }
      }
      return;
    }

    // 3. If connected to peer and stream just became ready, initiate call
    this.initiateMediaCallIfReady();

    // Also notify partner that local stream is ready
    this.send({ type: 'STREAM_READY', peerId: this.peer?.id });
  }

  public setCountdownCallback(cb: ((duration: number) => void) | null) {
    this.countdownCallback = cb;
  }

  public setFlashCallback(cb: (() => void) | null) {
    this.flashCallback = cb;
  }

  private initiateMediaCallIfReady() {
    if (!this.peer || !this.localStream || this.mediaConnection || this.pendingIncomingCall) return;

    const role = useRemoteStore.getState().role;
    const code = useRemoteStore.getState().roomCode;
    if (!code) return;
    const cleanCode = code.toLowerCase().replace(/[^a-z0-9]/g, '');

    let targetPeerId: string | null = null;
    if (role === 'guest') {
      targetPeerId = `twogether-${cleanCode}-host`;
    } else if (role === 'host' && this.remotePeerId) {
      targetPeerId = this.remotePeerId;
    }

    if (targetPeerId) {
      try {
        const call = this.peer.call(targetPeerId, this.localStream);
        if (call) {
          this.setupCall(call);
        }
      } catch (err) {
        console.warn('Failed to initiate media call:', err);
      }
    }
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
          if (this.localStream) {
            this.mediaConnection = call;
            call.answer(this.localStream);
            this.setupCall(call);
          } else {
            // Hold until local stream is ready
            this.pendingIncomingCall = call;
            call.on('close', () => {
              if (this.pendingIncomingCall === call) this.pendingIncomingCall = null;
            });
          }
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

          // Initiate call to host if stream is already ready
          this.initiateMediaCallIfReady();

          resolve();
        });

        peer.on('call', (call) => {
          if (this.localStream) {
            this.mediaConnection = call;
            call.answer(this.localStream);
            this.setupCall(call);
          } else {
            this.pendingIncomingCall = call;
            call.on('close', () => {
              if (this.pendingIncomingCall === call) this.pendingIncomingCall = null;
            });
          }
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

    // Primary: PeerJS stream event
    call.on('stream', (remoteStream) => {
      useRemoteStore.getState().setRemoteStream(remoteStream);
    });

    // Backup: PeerConnection ontrack event (catches tracks added/replaced dynamically)
    if (call.peerConnection) {
      call.peerConnection.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          useRemoteStore.getState().setRemoteStream(event.streams[0]);
        } else if (event.track) {
          const existing = useRemoteStore.getState().remoteStream;
          if (existing) {
            existing.addTrack(event.track);
            useRemoteStore.getState().setRemoteStream(existing);
          } else {
            const newStream = new MediaStream([event.track]);
            useRemoteStore.getState().setRemoteStream(newStream);
          }
        }
      };
    }

    call.on('close', () => {
      if (this.mediaConnection === call) {
        this.mediaConnection = null;
        useRemoteStore.getState().setRemoteStream(null);
      }
    });

    call.on('error', (err) => {
      console.error('Call error:', err);
    });
  }

  private setupDataConnection(conn: DataConnection, _role: RemoteRole, customName?: string) {
    this.dataConnection = conn;

    conn.on('open', () => {
      useRemoteStore.getState().setStatus('connected');
      const myName = customName || useRemoteStore.getState().userName;
      this.send({ type: 'PARTNER_JOINED', name: myName, peerId: this.peer?.id });

      // If we have local stream, initiate media call immediately
      this.initiateMediaCallIfReady();
    });

    conn.on('data', (data: unknown) => {
      this.handleIncomingMessage(data as RemoteMessage);
    });

    conn.on('close', () => {
      useRemoteStore.getState().setStatus('disconnected');
      useRemoteStore.getState().setRemoteStream(null);
      useRemoteStore.getState().setIsPartnerReady(false);
      this.remotePeerId = null;
    });

    conn.on('error', (err) => {
      console.error('Data connection error:', err);
    });
  }

  private handleIncomingMessage(msg: RemoteMessage) {
    switch (msg.type) {
      case 'PARTNER_JOINED':
        if (msg.peerId) {
          this.remotePeerId = msg.peerId;
        }
        useRemoteStore.getState().setPartnerName(msg.name || 'Partner');
        useRemoteStore.getState().setStatus('connected');
        this.initiateMediaCallIfReady();
        break;

      case 'STREAM_READY':
        if (msg.peerId) {
          this.remotePeerId = msg.peerId;
        }
        this.initiateMediaCallIfReady();
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
        this.remotePeerId = null;
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

    if (this.pendingIncomingCall) {
      try {
        this.pendingIncomingCall.close();
      } catch {
        // Ignore
      }
      this.pendingIncomingCall = null;
    }

    this.remotePeerId = null;

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
