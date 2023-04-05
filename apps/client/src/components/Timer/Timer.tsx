import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';

export const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'full',
  timeStyle: 'short',
});

export default component$(() => {
  const dateTime = useSignal(new Date());

  useVisibleTask$(({ cleanup }) => {
    const interval = setInterval(() => {
      dateTime.value = new Date();
    }, 1000);

    cleanup(() => clearInterval(interval));
  });

  return (
    <span style={{ fontSize: '18px', fontWeight: '500' }}>
      {dateFormatter.format(dateTime.value)}
    </span>
  );
});
