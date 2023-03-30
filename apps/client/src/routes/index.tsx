import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import styles from './Home.scss?inline';
import NewMeetingIconUrl from '~/assets/new-meeting.png?url';
export default component$(() => {
  useStyles$(styles);
  const meetingId = useSignal<string>();
  return (
    <div class="Home">
      <div class="left">
        <img src="/meeting.png" alt="meeting" />
        <span>Experience seamless video chat like never before!</span>
      </div>
      <div class="right">
        <span>Connect with the world, face-to-face, anytime, anywhere</span>
        <button class="new-meeting-btn">
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
          {meetingId.value && <button class="join-btn">join</button>}
        </div>
      </div>
    </div>
  );
});
