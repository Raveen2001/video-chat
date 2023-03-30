import { component$ } from '@builder.io/qwik';
import Timer from '../Timer';

export default component$(() => {
  return (
    <div class="Topbar">
      <div class="logo">
        <img src="/logo.png" width={'45'} height={'45'} alt="Logo" />
        <span>
          <strong>Video</strong> Chat
        </span>
      </div>

      <Timer />

      <div class="about">
        <a href="https://www.raveen.in" target="_blank">
          About developer
        </a>
      </div>
    </div>
  );
});
