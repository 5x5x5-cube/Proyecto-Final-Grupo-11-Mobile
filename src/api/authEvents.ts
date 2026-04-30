type Listener = () => void;

const listeners: Set<Listener> = new Set();

export function onSessionExpired(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitSessionExpired(): void {
  listeners.forEach(fn => fn());
}
