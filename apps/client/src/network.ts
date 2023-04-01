import Peer from 'peerjs';
import { isBrowser } from '@builder.io/qwik/build';

let peer: Peer | undefined = undefined;

export const initailizePeer = () => {
  if (isBrowser) {
    peer = new Peer({
      host: '/',
      port: 3001,
    });

    peer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
    });
  }
};

export const getUserId = (): string | undefined => peer?.id;

export const callToUser = (
  userId: string,
  stream: MediaStream,
  onAnswer: (stream: MediaStream) => void,
) => {
  if (userId === peer?.id) return;

  console.log('calling', userId);
  const call = peer?.call(userId, stream);

  call?.on('stream', (remoteStream) => {
    console.log('answer from ', userId, remoteStream);
    onAnswer(remoteStream);
  });
};

export const answerToCall = (
  stream: MediaStream,
  onCall: (stream: MediaStream) => void,
) => {
  console.log('This function called');
  peer?.on('call', (call) => {
    console.log('call from ', call);
    call.answer(stream);

    call.on('stream', (remoteStream) => {
      console.log('answer ', remoteStream);
      onCall(remoteStream);
    });
  });
};
