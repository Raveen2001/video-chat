import {
  $,
  component$,
  useSignal,
  useStyles$,
  useTask$,
  useContext,
} from '@builder.io/qwik';
import styles from './Home.scss?inline';
import NewMeetingIconUrl from '~/assets/new-meeting.png?url';
import NameDialog from '~/components/NameDialog';
import { useNavigate } from '@builder.io/qwik-city';
import { PeerContext } from '~/root';
import { createRoom } from '~/utils/server';
export default component$(() => {
  useStyles$(styles);

  const peer = useContext(PeerContext);
  const meetingId = useSignal<string>();
  const nameDialogOpen = useSignal<boolean>(false);
  const name = useSignal<string>('');

  const selectedType = useSignal<'new' | 'join'>('new');
  const nav = useNavigate();

  const onNameConfirm = $(async () => {
    nameDialogOpen.value = false;
    const roomId =
      selectedType.value === 'new' ? await createRoom() : meetingId.value;
    nav(`/${roomId}`);
  });

  return (
    <>
      <div class="Home">
        <div class="left">
          <img src="/meeting.png" alt="meeting" />
          <span>Experience seamless video chat like never before!</span>
        </div>
        <div class="right">
          <span>Connect with the world, face-to-face, anytime, anywhere</span>
          <button
            class="new-meeting-btn"
            onClick$={() => {
              // nameDialogOpen.value = true;
              selectedType.value = 'new';
              onNameConfirm();
            }}
          >
            <img src={NewMeetingIconUrl} alt="new" />
            New Meeting
          </button>

          <div class="join">
            <input
              type="text"
              placeholder="Enter meeting ID"
              bind:value={meetingId}
              autoComplete="new-password"
            />
            {meetingId.value && (
              <button
                class="join-btn"
                onClick$={() => {
                  // nameDialogOpen.value = true;
                  selectedType.value = 'join';
                  onNameConfirm();
                }}
              >
                join
              </button>
            )}
          </div>
        </div>
      </div>
      <NameDialog open={nameDialogOpen} name={name} onConfirm={onNameConfirm} />
    </>
  );
});
