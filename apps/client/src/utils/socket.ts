import { isBrowser } from '@builder.io/qwik/build';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

export const initializeSocket = (onInit: (socket: Socket) => void) => {
  if (isBrowser) {
    const socket = io();
    socket.on('connect', () => {
      onInit(socket);
    });
  }
};
