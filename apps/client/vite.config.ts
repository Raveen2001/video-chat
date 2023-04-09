import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import svgr from 'vite-plugin-svgr';
import tsConfigPaths from 'vite-tsconfig-paths';
import { qwikReact } from '@builder.io/qwik-react/vite';

export default defineConfig(() => {
  return {
    plugins: [tsConfigPaths(), svgr(), qwikReact(), qwikCity(), qwikVite()],
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    },
  };
});
