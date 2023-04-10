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
import { PeerContext, SocketContext } from '~/root';
import NameDialog from '~/components/NameDialog';
import Gallery, { type TUserDetail } from '~/components/Gallery/Gallery';
import CopyRoomId from '~/components/CopyRoomId/CopyRoomId';

export default component$(() => {
  useStyles$(styles);
  const { roomId } = useLocation().params;
  const nav = useNavigate();

  const peerContext = useContext(PeerContext);
  const socketContext = useContext(SocketContext);

  const myVideoRef = useSignal<HTMLVideoElement>();
  const currentRoomId = useSignal<string>();
  const connectedClientsDetails = useSignal<Record<string, TUserDetail>>({});
  const name = useSignal<string>('raveen');
  const isNameDialogOpen = useSignal<boolean>(false);

  //   useVisibleTask$(() => {
  //     isNameDialogOpen.value = true;
  //   });

  const onNameConfirm = $(async (userName: string) => {
    isNameDialogOpen.value = false;
    name.value = userName;
  });

  const onRemoteUserConnect = $(
    async (userId: string, name: string, stream: MediaStream) => {
      if (stream === undefined) return;
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
      <Gallery connectedClientsDetails={connectedClientsDetails.value} />
      <video class="my-video" ref={myVideoRef} autoPlay muted></video>
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
          nav('/');
        }}
      >
        <MUICallEndIcon />
      </MUIFab>

      <CopyRoomId roomId={roomId} />
    </div>
  );
});
