import Peer from 'peerjs';
import { isBrowser } from '@builder.io/qwik/build';
import { $ } from '@builder.io/qwik';

export const initailizePeer = (onInit: (peer: Peer) => void) => {
  if (isBrowser) {
    const peer = new Peer({
      debug: 3,
    });

    peer.on('open', (id) => {
      onInit(peer);
    });
  }
};

export const callToUser = (peer: Peer) => {
  return $(
    (
      userId: string,
      stream: MediaStream,
      onAnswer: (userId: string, stream: MediaStream) => void,
    ) => {
      if (userId === peer?.id) return;

      // console.log('calling', userId, stream);
      const call = peer?.call(userId, stream);

      call?.once('stream', (remoteStream) => {
        // console.log('answer from ', userId, remoteStream);
        onAnswer(userId, remoteStream);
      });
    },
  );
};

export const answerToCall = (peer: Peer) => {
  return $(
    (
      stream: MediaStream,
      onCall: (userId: string, stream: MediaStream) => void,
    ) => {
      console.log('This function called');
      peer?.on('call', (call) => {
        // console.log('call from ', call);
        call.answer(stream);

        call.once('stream', (remoteStream) => {
          // console.log('answer ', remoteStream);
          onCall(call.peer, remoteStream);
        });
      });
    },
  );
};

// destroy the peer connection
export const destroyPeer = (peer: Peer) => {
  return $(() => {
    peer?.destroy();
  });
};
