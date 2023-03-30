import {
  $,
  component$,
  useSignal,
  useStyles$,
  useTask$,
} from '@builder.io/qwik';
import styles from './Home.scss?inline';
import NewMeetingIconUrl from '~/assets/new-meeting.png?url';
import NameDialog from '~/components/NameDialog';
import { MUIButton } from '~/integrations/react/mui';
export default component$(() => {
  useStyles$(styles);
  const meetingId = useSignal<string>();
  const nameDialogOpen = useSignal<boolean>(false);
  const name = useSignal<string>('');
  const selectedType = useSignal<'new' | 'join'>('new');

  const onNameConfirm = $(() => {
    nameDialogOpen.value = false;
    // singlePageNavigate()
  });

  useTask$(({ track }) => {
    track(() => [name]);
    console.log('name', name.value);
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
              nameDialogOpen.value = true;
              selectedType.value = 'new';
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
                  nameDialogOpen.value = true;
                  selectedType.value = 'join';
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
