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
import { createFakeStream, addStreamToGallery } from '~/utils';
import { PeerContext } from '~/root';

export default component$(() => {
  const myVideoRef = useSignal<HTMLVideoElement>();

  const { id: roomOwnerId } = useLocation().params;
  const nav = useNavigate();
  const peer = useContext(PeerContext);

  useStyles$(styles);

  // turn off your audio and video
  useVisibleTask$(async ({ track }) => {
    track(peer);
    console.log('hello');

    if (!peer.value.isInitialized) return;
    console.log('passed');

    // navigator.mediaDevices
    //   .getUserMedia({ video: true, audio: true })
    //   .then((stream) => {
    //     if (myVideoRef.value) {
    //       myVideoRef.value.srcObject = stream;
    //       // call the room owner
    //       callToUser(roomOwnerId, stream, addStreamToGallery);

    //       // send your stream to other users
    //       answerToCall(stream, addStreamToGallery);
    //     }
    //   });

    const stream = await createFakeStream();
    if (myVideoRef.value) {
      myVideoRef.value.srcObject = stream;
      // call the room owner
      peer.value.call?.(roomOwnerId, stream, addStreamToGallery);

      // send your stream to other users
      peer.value.answer?.(stream, addStreamToGallery);
    }
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
          myStream.getTracks().forEach((track) => {
            track.stop();
          });
          nav('/');
        }}
      >
        <MUICallEndIcon />
      </MUIFab>
    </div>
  );
});
