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

import './global.scss';
import { answerToCall, callToUser, initailizePeer } from './network';
import Peer, { PeerErrorType } from 'peerjs';
import { MUISnackbar } from './integrations/react/mui';

interface IPeerContext {
  isInitialized: boolean;
  peer?: Peer;
  call?: ReturnType<typeof callToUser>;
  answer?: ReturnType<typeof answerToCall>;
}

export const PeerContext = createContextId<Signal<IPeerContext>>('peer');

export default component$(() => {
  const isSnackbarOpen = useSignal<boolean>(false);
  const peerSignal = useSignal<IPeerContext>({
    isInitialized: false,
    peer: undefined,
    call: undefined,
    answer: undefined,
  });

  useContextProvider(PeerContext, peerSignal);

  useVisibleTask$(async () => {
    initailizePeer((peer) => {
      peerSignal.value = {
        isInitialized: true,
        peer: noSerialize(peer),
        call: callToUser(peer),
        answer: answerToCall(peer),
      };

      peer.on('error', (error: any) => {
        if (error.type === 'peer-unavailable') {
          console.error('--------> ', error.type);
        }
      });
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
