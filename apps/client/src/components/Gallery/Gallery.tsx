import {
  NoSerialize,
  Signal,
  component$,
  useStylesScoped$,
} from '@builder.io/qwik';
import styles from './Gallery.scss?inline';
import UserVideoCard from '../UserVideoCard';
import Loading from '../LoadIng/Loading';

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

  if (Object.keys(connectedClientsDetails).length === 0) {
    return <Loading text="Waiting for users to join" />;
  }
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
