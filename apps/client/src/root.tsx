import {
  Signal,
  component$,
  createContextId,
  noSerialize,
  useContextProvider,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from '@builder.io/qwik-city';
import { RouterHead } from './components/router-head/router-head';
import { Peer } from 'peerjs';
import './global.scss';

interface IVideoChatContextSProps {
  peer: Signal<Peer>;
}
export const VideoChatContext =
  createContextId<IVideoChatContextSProps>('video-chat.peer');
export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */

  const peer = useSignal<Peer>();
  useContextProvider(VideoChatContext, { peer });

  useVisibleTask$(() => {
    peer.value = noSerialize(new Peer());

    peer.value?.on('open', (id) => {
      console.log('My peer ID is: ' + id);
    });
  });

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <title>Video Chat</title>

        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&display=swap"
          rel="stylesheet"
        ></link>
        <RouterHead />
      </head>
      <body lang="en">
        <RouterOutlet />

        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
