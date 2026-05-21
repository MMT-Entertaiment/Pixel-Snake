import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

// 👇 Remplace par l'URL de ton serveur déployé
const SERVER_URL = 'https://pixel-snake-server-mstudiogames.up.railway.app';

let socketInstance = null;

export function useSocket() {
  const socketRef = useRef(null);

  useEffect(() => {
    // Connexion singleton
    if (!socketInstance) {
      socketInstance = io(SERVER_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 10,
      });
    }
    socketRef.current = socketInstance;

    return () => {
      // Ne pas déconnecter à chaque démontage (singleton)
    };
  }, []);

  const emit = useCallback((event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  }, []);

  const on = useCallback((event, handler) => {
    socketRef.current?.on(event, handler);
    return () => socketRef.current?.off(event, handler);
  }, []);

  const off = useCallback((event, handler) => {
    socketRef.current?.off(event, handler);
  }, []);

  return {
    socket: socketRef.current,
    emit,
    on,
    off,
    connected: socketRef.current?.connected ?? false,
  };
}
