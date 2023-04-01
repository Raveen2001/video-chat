import {
  NoSerialize,
  component$,
  useSignal,
  useStylesScoped$,
  useVisibleTask$,
} from '@builder.io/qwik';
import styles from './Video.scss?inline';

interface IVideoProps {
  stream: NoSerialize<MediaStream>;
}

export default component$(({ stream }: IVideoProps) => {
  useStylesScoped$(styles);
  const videoRef = useSignal<HTMLVideoElement>();

  useVisibleTask$(() => {
    if (videoRef.value) videoRef.value.srcObject = stream as any;
  });

  return <video class="Video" ref={videoRef}></video>;
});
