import { isBrowser } from '@builder.io/qwik/build';
import { Socket, io } from 'socket.io-client';

export const initializeSocket = (onInit: (socket: Socket) => void) => {
  if (isBrowser) {
    const socket = io('http://localhost:5000');
    socket.on('connect', () => {
      onInit(socket);
    });
  }
};
