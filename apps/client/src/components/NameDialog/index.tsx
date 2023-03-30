import { $, component$, QRL, Signal, useSignal } from '@builder.io/qwik';
import * as React from 'react';
import {
  MUIButton,
  MUIDialog,
  MUIDialogActions,
  MUIDialogContent,
  MUIDialogContentText,
  MUIDialogTitle,
  MUITextField,
} from '~/integrations/react/mui';

interface NameDialogProps {
  open: Signal<boolean>;
  name: Signal<string>;
  onConfirm: QRL<() => void>;
}

export default component$(({ open, onConfirm, name }: NameDialogProps) => {
  const handleClose = $(() => {
    open.value = false;
  });

  return (
    <div>
      <MUIDialog open={open.value} onClose$={handleClose}>
        <MUIDialogTitle>Enter your name</MUIDialogTitle>
        <MUIDialogContent>
          <MUIDialogContentText>
            Please enter your name to continue, we will use this name to
            identify you in the meeting.
          </MUIDialogContentText>
          <MUITextField
            value={name?.value}
            onChange$={(e: any) => {
              name.value = e.target.value;
            }}
            autoFocus
            margin="dense"
            id="name"
            type="name"
            placeholder="Name"
            fullWidth
            variant="outlined"
          />
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
            host:onClick$={onConfirm}
            sx={{
              color: 'var(--accent-color)',
            }}
          >
            Confirm
          </MUIButton>
        </MUIDialogActions>
      </MUIDialog>
    </div>
  );
});
