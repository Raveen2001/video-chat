import {
  $,
  component$,
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
import NameDialog from '~/components/NameDialog';
import Loading from '~/components/LoadIng/Loading';

export default component$(() => {
  useStyles$(styles);
  const myVideoRef = useSignal<HTMLVideoElement>();
  const { roomId } = useLocation().params;
  const currentRoomId = useSignal<string>();

  const nav = useNavigate();
  const peerContext = useContext(PeerContext);
  const socket = useContext(socketContext);
  const nameSignal = useSignal<string>('');
  const isNameDialogOpen = useSignal<boolean>(false);

  useVisibleTask$(() => {
    isNameDialogOpen.value = true;
  });

  const onNameConfirm = $(async (name: string) => {
    isNameDialogOpen.value = false;
    nameSignal.value = name;
  });

  // turn off your audio and video
  useVisibleTask$(async ({ track, cleanup }) => {
    track(peerContext);
    track(socket);
    track(nameSignal);

    if (
      !peerContext.value.isInitialized ||
      !socket.value.isInitialized ||
      nameSignal.value.length === 0
    )
      return;

    console.log('name', nameSignal.value);
    currentRoomId.value = roomId;

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

  return <Loading text="Waiting for connections" />;
  if (nameSignal.value.length === 0) {
    return (
      <NameDialog open={isNameDialogOpen.value} onConfirm={onNameConfirm} />
    );
  }

  return (
    <div class="Room">
      <div class="gallery">
        <video class="video" ref={myVideoRef} autoPlay muted></video>
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
