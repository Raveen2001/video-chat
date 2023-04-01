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
  open: Signal<boolean>;
  name: Signal<string>;
  onConfirm: QRL<() => void>;
}

export default component$(({ name, open, onConfirm }: NameDialogProps) => {
  useStyles$(styles);
  const showError = useSignal(false);

  const handleClose = $(() => {
    open.value = false;
  });

  const handleConfirm = $(() => {
    if (name.value) {
      console.log('heelo');
      onConfirm();
    } else {
      showError.value = true;
    }
  });

  useVisibleTask$(({ track }) => {
    track(open);
    showError.value = false;
  });

  return (
    <MUIDialog open={open.value} onClose$={handleClose}>
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
            host:onClick$={handleClose}
            sx={{
              color: 'red',
            }}
          >
            Cancel
          </MUIButton>
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
