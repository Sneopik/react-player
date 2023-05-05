import '@/global/styles/global.css';
import type { AppProps } from 'next/app';
import 'plyr/dist/plyr.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
