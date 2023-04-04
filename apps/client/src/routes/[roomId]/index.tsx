import {
  $,
  component$,
  noSerialize,
  useContext,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from '@builder.io/qwik';
import { useLocation, useNavigate } from '@builder.io/qwik-city';
import styles from './Room.scss?inline';
import { MUICallEndIcon, MUIFab } from '~/integrations/react/mui';
import { addStreamToGallery, removeStreamFromGallery } from '~/utils/common';
import { PeerContext, socketContext } from '~/root';

export default component$(() => {
  const myVideoRef = useSignal<HTMLVideoElement>();
  const { roomId } = useLocation().params;
  const currentRoomId = useSignal<string>();

  const nav = useNavigate();
  const peerContext = useContext(PeerContext);
  const socket = useContext(socketContext);

  useStyles$(styles);

  // turn off your audio and video
  useVisibleTask$(async ({ track, cleanup }) => {
    track(peerContext);
    track(socket);

    if (!peerContext.value.isInitialized || !socket.value.isInitialized) return;
    currentRoomId.value = roomId;
    console.log('passed');

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (myVideoRef.value) {
          myVideoRef.value.srcObject = stream;

          console.log('here', socket.value.socket);
          socket.value.socket?.emit(
            'join-room',
            currentRoomId.value,
            peerContext.value.peer?.id,
          );

          // call the user when they are connected
          socket.value.socket?.on('user-connected', (userId) => {
            peerContext.value.call?.(userId, stream, addStreamToGallery);
          });

          // when the user is disconnected
          socket.value.socket?.on('user-disconnected', (userId) => {
            removeStreamFromGallery(userId);
          });

          // send your stream to other users
          peerContext.value.answer?.(stream, addStreamToGallery);
        }
      });

    cleanup(() => {
      const myStream = myVideoRef.value?.srcObject as MediaStream;
      myStream.getTracks().forEach((track) => {
        track.stop();
      });
      socket.value.socket?.emit(
        'leave-room',
        currentRoomId.value,
        peerContext.value.peer?.id,
      );
      peerContext.value.peer?.removeAllListeners();
      socket.value.socket?.removeAllListeners();
    });
  });

  return (
    <div class="Room">
      <div class="gallery">
        {/* <Video video={}> */}
        <video class="video" ref={myVideoRef} autoPlay muted></video>
        {/* </Video> */}
      </div>
      <MUIFab
        color="secondary"
        sx={{
          position: 'absolute',
          bottom: 20,
          right: '50%',
          transform: 'translateX(50%)',
          backgroundColor: 'red',
        }}
        host:onClick$={() => {
          const myStream = myVideoRef.value?.srcObject as MediaStream;
          nav('/');
        }}
      >
        <MUICallEndIcon />
      </MUIFab>
    </div>
  );
});
