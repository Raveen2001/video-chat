import { component$, useStylesScoped$ } from '@builder.io/qwik';
import styles from './Loading.scss?inline';
import { MUICircularProgress } from '~/integrations/react/mui';

interface ILoadingProps {
  text: string;
}

export default component$<any>(({ text }: ILoadingProps) => {
  useStylesScoped$(styles);
  return (
    <div class="Loading">
      <MUICircularProgress
        color="success"
        size={'25'}
        sx={{
          width: '25px',
        }}
      />
      <span class="text">{text}</span>
    </div>
  );
});
