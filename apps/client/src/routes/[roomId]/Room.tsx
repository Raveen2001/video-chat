import {
  $,
  NoSerialize,
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
import { PeerContext, SocketContext } from '~/root';
import NameDialog from '~/components/NameDialog';
import Loading from '~/components/LoadIng/Loading';

type TUserDetails = {
  name: string;
  stream: NoSerialize<MediaStream>;
  isVideoOn: boolean;
  isAudioOn: boolean;
};

export default component$(() => {
  useStyles$(styles);
  const { roomId } = useLocation().params;
  const nav = useNavigate();

  const peerContext = useContext(PeerContext);
  const socketContext = useContext(SocketContext);

  const myVideoRef = useSignal<HTMLVideoElement>();
  const currentRoomId = useSignal<string>();
  const connectedClientsDetails = useSignal<Record<string, TUserDetails>>({});
  const name = useSignal<string>('');
  const isNameDialogOpen = useSignal<boolean>(false);

  useVisibleTask$(() => {
    isNameDialogOpen.value = true;
  });

  const onNameConfirm = $(async (userName: string) => {
    isNameDialogOpen.value = false;
    name.value = userName;
  });

  const onRemoteUserConnect = $(
    async (userId: string, name: string, stream: MediaStream) => {
      connectedClientsDetails.value = {
        ...connectedClientsDetails.value,
        [userId]: {
          name: name,
          stream: noSerialize(stream),
          isVideoOn: true,
          isAudioOn: true,
        },
      };
    },
  );

  const onRemoteUserDisconnect = $(async (userId: string) => {
    const temp = { ...connectedClientsDetails.value };
    delete temp[userId];
    connectedClientsDetails.value = temp;
  });

  // turn off your audio and video
  useVisibleTask$(async ({ track, cleanup }) => {
    track(peerContext);
    track(socketContext);
    track(name);

    if (
      !peerContext.value.isInitialized ||
      !socketContext.value.isInitialized ||
      name.value.length === 0
    )
      return;

    currentRoomId.value = roomId;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (myVideoRef.value) {
          myVideoRef.value.srcObject = stream;

          console.log('here', socketContext.value.socket);
          socketContext.value.socket?.emit(
            'join-room',
            currentRoomId.value,
            peerContext.value.peer?.id,
            name.value,
          );

          // call the user when they are connected
          socketContext.value.socket?.on(
            'user-connected',
            (remoteUserId, remoteUserName) => {
              connectedClientsDetails.value = {
                ...connectedClientsDetails.value,
                [remoteUserId]: {
                  name: remoteUserName,
                  isVideoOn: true,
                  isAudioOn: true,
                },
              };
              peerContext.value.call?.(
                peerContext.value.peer!.id,
                name.value,
                stream,
                remoteUserId,
                remoteUserName,
                onRemoteUserConnect,
              );
            },
          );

          // when the user is disconnected
          socketContext.value.socket?.on('user-disconnected', (userId) => {
            onRemoteUserDisconnect(userId);
          });

          // send your stream to other users
          peerContext.value.answer?.(stream, onRemoteUserConnect);
        }
      });

    cleanup(() => {
      const myStream = myVideoRef.value?.srcObject as MediaStream;
      myStream.getTracks().forEach((track) => {
        track.stop();
      });
      socketContext.value.socket?.emit(
        'leave-room',
        currentRoomId.value,
        peerContext.value.peer?.id,
      );
      peerContext.value.peer?.removeAllListeners();
      socketContext.value.socket?.removeAllListeners();
    });
  });

  useVisibleTask$(({ track }) => {
    track(connectedClientsDetails);
    console.log('000====> ', connectedClientsDetails.value);
  });

  //   return <Loading text="Waiting for connections" />;
  if (name.value.length === 0) {
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
