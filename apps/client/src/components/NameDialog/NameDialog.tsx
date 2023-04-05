import {
  $,
  component$,
  QRL,
  Signal,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from '@builder.io/qwik';
import {
  MUIButton,
  MUIDialog,
  MUIDialogActions,
  MUIDialogContent,
  MUIDialogContentText,
  MUIDialogTitle,
} from '~/integrations/react/mui';
import styles from './NameDialog.scss?inline';

interface NameDialogProps {
  open: boolean;
  onConfirm: QRL<(name: string) => void>;
}

export default component$(({ open, onConfirm }: NameDialogProps) => {
  useStyles$(styles);
  const showError = useSignal(false);
  const name = useSignal('');

  // get name from localstorage
  useVisibleTask$(() => {
    const nameFromLocalStorage = localStorage.getItem('name');
    if (nameFromLocalStorage) {
      name.value = nameFromLocalStorage;
    }
  });

  const handleConfirm = $(() => {
    if (name.value.trim()) {
      localStorage.setItem('name', name.value);
      onConfirm(name.value);
    } else {
      showError.value = true;
    }
  });

  return (
    <MUIDialog open={open}>
      <div class="NameDialog">
        <MUIDialogTitle>Enter your name</MUIDialogTitle>
        <MUIDialogContent>
          <MUIDialogContentText>
            Please enter your name to continue, we will use this name to
            identify you in the meeting.
          </MUIDialogContentText>
          <input
            type="text"
            bind:value={name}
            class="name-input"
            placeholder="Name"
          />
          <span class="helper-text">
            {showError.value ? 'Please enter your name' : ''}
          </span>
        </MUIDialogContent>
        <MUIDialogActions>
          <MUIButton
            host:onClick$={handleConfirm}
            sx={{
              color: 'var(--accent-color)',
            }}
          >
            Confirm
          </MUIButton>
        </MUIDialogActions>
      </div>
    </MUIDialog>
  );
});
