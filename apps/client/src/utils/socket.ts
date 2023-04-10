import { isBrowser } from '@builder.io/qwik/build';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
const SERVER_ENDPOINT = import.meta.env.VITE_SERVER_ENDPOINT;
export const initializeSocket = (onInit: (socket: Socket) => void) => {
  if (isBrowser) {
    const socket = io(SERVER_ENDPOINT);
    socket.on('connect', () => {
      onInit(socket);
    });
  }
};
