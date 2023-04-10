import { $, component$, useSignal, useStyles$ } from '@builder.io/qwik';
import styles from './Home.scss?inline';
import NewMeetingIconUrl from '~/assets/new-meeting.png?url';
import { useNavigate } from '@builder.io/qwik-city';
import { createRoom } from '~/utils/server';
import Loading from '~/components/LoadIng/Loading';
export default component$(() => {
  useStyles$(styles);
  const meetingId = useSignal<string>();
  const nav = useNavigate();
  const isLoading = useSignal(false);

  const joinRoom = $(async (type: 'new' | 'existing') => {
    isLoading.value = true;
    try {
      const roomId = type === 'new' ? await createRoom() : meetingId.value;
      console.log('room id', roomId);
      if (!roomId) return;
      nav(`/${roomId}`);
    } catch (err) {
      console.log(err);
      isLoading.value = false;
    }
  });

  if (isLoading.value) return <Loading text="Joining room" />;

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
              joinRoom('new');
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
                  joinRoom('existing');
                }}
              >
                join
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
});
