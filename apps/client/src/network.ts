import Peer from 'peerjs';
import { isBrowser } from '@builder.io/qwik/build';
import { $ } from '@builder.io/qwik';

export const initailizePeer = (onInit: (peer: Peer) => void) => {
  if (isBrowser) {
    const peer = new Peer({
      host: '/',
      port: 8080,
      debug: 3,
    });

    peer.on('open', (id) => {
      onInit(peer);
      console.log('My peer ID is: ' + id);
    });
  }
};

export const callToUser = (peer: Peer) => {
  return $(
    (
      userId: string,
      stream: MediaStream,
      onAnswer: (stream: MediaStream) => void,
    ) => {
      if (userId === peer?.id) return;
      console.log('calling', userId, stream);
      const call = peer?.call(userId, stream);

      call?.on('stream', (remoteStream) => {
        console.log('answer from ', userId, remoteStream);
        onAnswer(remoteStream);
      });
    },
  );
};

export const answerToCall = (peer: Peer) => {
  return $((stream: MediaStream, onCall: (stream: MediaStream) => void) => {
    console.log('This function called');
    peer?.on('call', (call) => {
      console.log('call from ', call);
      call.answer(stream);

      call.on('stream', (remoteStream) => {
        console.log('answer ', remoteStream);
        onCall(remoteStream);
      });
    });
  });
};
