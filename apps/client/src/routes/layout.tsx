import { component$, Slot } from '@builder.io/qwik';
import Topbar from '~/components/Topbar';
export default component$(() => {
  return (
    <>
      <Topbar />
      <div class="main">
        <Slot />
      </div>
    </>
  );
});
