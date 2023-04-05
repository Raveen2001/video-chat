import {
  component$,
  useSignal,
  useStylesScoped$,
  useVisibleTask$,
} from '@builder.io/qwik';
import styles from './UserVideoCard.scss?inline';
import type { TUserDetail } from '../Gallery/Gallery';

interface IUserVideoCard {
  userDetail: TUserDetail;
}

export default component$(({ userDetail }: IUserVideoCard) => {
  useStylesScoped$(styles);
  const videoRef = useSignal<HTMLVideoElement>();

  useVisibleTask$(({ track }) => {
    track(videoRef);
    if (!videoRef.value) return;

    console.log('userDetail.stream', userDetail.stream);

    videoRef.value.srcObject = userDetail.stream as any;
    videoRef.value.play();
  });
  return (
    <div class="UserVideoCard">
      <video class="user-video" ref={videoRef} />
    </div>
  );
});
