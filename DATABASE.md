# DATABASE
 
## v1: No database
The app is client-only and stores nothing on a server. Photos stay in browser memory and are discarded on reset or tab close. This is a privacy feature and keeps hosting free.
 
## Local persistence (optional, v1.5+)
**IndexedDB** (via `idb` or Dexie) to let users recover a session after refresh.
 
| Store | Key | Fields |
|---|---|---|
| sessions | id | createdAt, mode, templateId, filterId |
| frames | sessionId + index | round (0-2), slot (0-1), blob (JPEG), width, height |
| stickers | sessionId + nodeId | assetId, x, y, scale, rotation, zIndex, flipped |
| prefs | key | mirror, sound, lastTheme, reducedMotion |
 
Auto-delete sessions after 24h, with a "Clear my data" button.
 
## Remote mode (v1.5)
Room state is ephemeral and held by the signaling service; no persistent DB needed. If using Supabase Realtime later:
 
| Table / channel | Fields |
|---|---|
| rooms (ephemeral) | code, hostPeerId, createdAt, expiresAt |
 
Rooms expire after ~1 hour. No photo data is ever stored.
 
## v2 ideas (only if accounts/galleries are added)
- users(id, email, createdAt)
- strips(id, userId, storagePath, templateId, createdAt, isPublic)
- Storage bucket with signed URLs, retention policy, delete-account flow
- Requires privacy policy and consent updates
## Decision
Do not add a server database until a feature genuinely needs it.
 