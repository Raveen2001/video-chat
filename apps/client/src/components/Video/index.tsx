import { Slot, component$, useStylesScoped$ } from '@builder.io/qwik';
import styles from './Video.scss?inline';

interface IVideoProps {
  video: any;
  name: string;
}

export default component$<any>(({ name, video }: IVideoProps) => {
  useStylesScoped$(styles);

  return <div class="Video">{video}</div>;
});
