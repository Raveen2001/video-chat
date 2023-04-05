import { component$, useStyles$ } from '@builder.io/qwik';
import Timer from '../Timer';
import styles from './Topbar.scss?inline';

export default component$(() => {
  useStyles$(styles);
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
        <a href="https://www.raveen.in" target="_blank" rel="noreferrer">
          About developer
        </a>
      </div>
    </div>
  );
});
