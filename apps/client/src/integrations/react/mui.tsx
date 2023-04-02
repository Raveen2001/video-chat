/** @jsxImportSource react */
import { qwikify$ } from '@builder.io/qwik-react';
import MUITypes from '@mui/types';
import MUISystem from '@mui/system';
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Fab,
  Snackbar,
} from '@mui/material';
import { CallEnd as CallEndIcon } from '@mui/icons-material';

export const MUIDialog = qwikify$(Dialog);
export const MUITextField = qwikify$(TextField);
export const MUIDialogActions = qwikify$(DialogActions);
export const MUIDialogContent = qwikify$(DialogContent);
export const MUIDialogContentText = qwikify$(DialogContentText);
export const MUIDialogTitle = qwikify$(DialogTitle);
export const MUIButton = qwikify$(Button);
export const MUIFab = qwikify$(Fab);
export const MUICallEndIcon = qwikify$(CallEndIcon);
export const MUISnackbar = qwikify$(Snackbar);
