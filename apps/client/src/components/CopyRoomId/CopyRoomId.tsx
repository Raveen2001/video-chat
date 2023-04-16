import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import {
  MUIButton,
  MUICard,
  MUICardActions,
  MUICardContent,
  MUITypography,
} from '~/integrations/react/mui';

interface ICopyRoomIdProps {
  roomId: string;
}

export default component$(({ roomId }: ICopyRoomIdProps) => {
  const copyButtonText = useSignal('Copy Room ID');

  useVisibleTask$(({ track }) => {
    track(copyButtonText);
    setTimeout(() => {
      copyButtonText.value = 'Copy Room ID';
    }, 2000);
  });

  return (
    <MUICard
      variant="outlined"
      sx={{
        width: 'max-content',
        position: 'absolute',
        right: 'var(--spacing)',
        top: 'var(--topbar-height)',
      }}
    >
      <MUICardContent
        sx={{
          paddingBottom: '0 !important',
        }}
      >
        <MUITypography sx={{ fontSize: 14 }} gutterBottom>
          Your Room ID
        </MUITypography>
        <MUITypography sx={{ fontSize: 14, fontWeight: 600 }} gutterBottom>
          {roomId}
        </MUITypography>
      </MUICardContent>
      <MUICardActions
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <MUIButton
          size="small"
          sx={{
            color: 'var(--accent-color)',
          }}
          host:onClick$={() => {
            copyButtonText.value = 'Copied to clipboard !';
            navigator.clipboard.writeText(roomId);
          }}
        >
          {copyButtonText}
        </MUIButton>
      </MUICardActions>
    </MUICard>
  );
});
