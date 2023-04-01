import {
  component$,
  useSignal,
  useStylesScoped$,
  useVisibleTask$,
} from '@builder.io/qwik';
import { useLocation, useNavigate } from '@builder.io/qwik-city';
import styles from './Room.scss?inline';
import { MUICallEndIcon, MUIFab } from '~/integrations/react/mui';
import { log } from 'console';

export default component$(() => {
  const myVideoRef = useSignal<HTMLVideoElement>();

  const { id } = useLocation().params;
  const nav = useNavigate();
  useStylesScoped$(styles);

  useVisibleTask$(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (myVideoRef.value) {
          myVideoRef.value.srcObject = stream;
        }
      });
  });
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
