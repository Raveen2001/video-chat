import Peer from 'peerjs';
import { isBrowser } from '@builder.io/qwik/build';
import { $, type NoSerialize } from '@builder.io/qwik';

export const initailizePeer = (onInit: (peer: Peer) => void) => {
  if (isBrowser) {
    const peer = new Peer({
      // debug: 3,
    });

    peer.on('open', () => {
      onInit(peer);
    });
  }
};

export const callToUser = (peer: NoSerialize<Peer>) => {
  return $(
    (
      myUserId: string,
      myUserName: string,
      myStream: MediaStream,
      remoteUserId: string,
      remoteUserName: string,
      onAnswer: (userId: string, name: string, stream: MediaStream) => void,
    ) => {
      if (remoteUserId === peer?.id) return;

      const call = peer?.call(remoteUserId, myStream, {
        metadata: {
          id: myUserId,
          name: myUserName,
        },
      });

      call?.once('stream', (remoteStream) => {
        onAnswer(remoteUserId, remoteUserName, remoteStream);
      });
    },
  );
};

export const answerToCall = (peer: NoSerialize<Peer>) => {
  return $(
    (
      stream: MediaStream,
      onCall: (userId: string, userName: string, stream: MediaStream) => void,
    ) => {
      console.log('This function called');
      peer?.on('call', (call) => {
        // console.log('call from ', call);
        call.answer(stream);
        const { name: remoteUserName, id: remoteUserId } = call.metadata;

        call.once('stream', (remoteStream) => {
          onCall(remoteUserId, remoteUserName, remoteStream);
        });
      });
    },
  );
};

// destroy the peer connection
export const destroyPeer = (peer: NoSerialize<Peer>) => {
  return $(() => {
    peer?.destroy();
  });
};
