import {
  $,
  component$,
  useContext,
  useSignal,
  useStyles$,
  useStylesScoped$,
  useVisibleTask$,
} from '@builder.io/qwik';
import { useLocation, useNavigate } from '@builder.io/qwik-city';
import styles from './Room.scss?inline';
import { MUICallEndIcon, MUIFab } from '~/integrations/react/mui';
import Video from '~/components/Video';
import { answerToCall, callToUser } from '~/network';

export default component$(() => {
  const myVideoRef = useSignal<HTMLVideoElement>();

  const { id: roomOwnerId } = useLocation().params;
  const nav = useNavigate();
  useStyles$(styles);

  const addStreamToGallery = $((stream: MediaStream) => {
    console.log('addStreamToGallery', stream);
    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    video.classList.add('video');
    video.muted = true;
    video.playsInline = true;
    document.querySelector('.gallery')?.appendChild(video);
  });

  const createFakeStream = $(() => {
    const mediaStream = new MediaStream();

    // Create a fake video track
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const videoStream = canvas.captureStream(30);
    const videoTrack = videoStream.getVideoTracks()[0];
    mediaStream.addTrack(videoTrack);

    // Create a fake audio track
    const audioContext = new AudioContext();
    const audioNode = audioContext.createMediaStreamDestination();
    const audioTrack = audioNode.stream.getAudioTracks()[0];
    mediaStream.addTrack(audioTrack);

    return mediaStream;
  });

  // turn off your audio and video
  useVisibleTask$(async () => {
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
      callToUser(roomOwnerId, stream, addStreamToGallery);

      // send your stream to other users
      answerToCall(stream, addStreamToGallery);
    }
  });

  // call the room owner
  // get the stream from the room owner
  useVisibleTask$(() => {});

  // answer calls from other users

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
