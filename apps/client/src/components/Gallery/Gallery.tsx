import {
  NoSerialize,
  Signal,
  component$,
  useStylesScoped$,
} from '@builder.io/qwik';
import styles from './Gallery.scss?inline';
import UserVideoCard from '../UserVideoCard';

export type TUserDetail = {
  name: string;
  stream: NoSerialize<MediaStream>;
  isVideoOn: boolean;
  isAudioOn: boolean;
};

interface IGalleryProps {
  connectedClientsDetails: Record<string, TUserDetail>;
}

export default component$(({ connectedClientsDetails }: IGalleryProps) => {
  useStylesScoped$(styles);
  return (
    <div class="Gallery">
      {Object.keys(connectedClientsDetails).map((userId) => {
        return (
          <UserVideoCard
            key={userId}
            userDetail={connectedClientsDetails[userId]}
          />
        );
      })}
    </div>
  );
});
