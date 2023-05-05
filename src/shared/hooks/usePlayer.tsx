import Hls from 'hls.js';
import { RefObject, useEffect, useState } from 'react';

import { getFileExtension } from '../utils/lib/getFileExtension';

declare global {
  interface Window {
    resizeLag?: NodeJS.Timeout;
  }
}

type Props = {
  element: RefObject<HTMLVideoElement>;
  videoUrl: string;
};

type HookReturnType = {
  forwardHandler: () => void;
  backwardHandler: () => void;
  error: string;
};

export const usePlayer = ({ element, videoUrl }: Props): HookReturnType => {
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('portrait');
  const [error, setError] = useState<string>('');

  const isLandscape = () =>
    window.matchMedia('(orientation: landscape) and (max-width: 900px)').matches;

  useEffect(() => {
    if (element.current) {
      if (element.current.canPlayType('application/vnd.apple.mpegurl')) {
        element.current.src = videoUrl;
      } else if (Hls.isSupported() && getFileExtension(videoUrl) === 'm3u8') {
        const hls = new Hls();
        hls.loadSource(videoUrl);
        hls.attachMedia(element.current);
      } else {
        element.current.src = videoUrl;
      }
    }
  }, [element, videoUrl]);

  const requestFullscreen = async () => {
    if (!element?.current) {
      return;
    }

    try {
      setError('');
      await element.current.requestFullscreen();
    } catch (e) {
      setError('Unable to enter full screen mode. Use the native functionality');
    }
  };

  useEffect(() => {
    if (orientation === 'landscape') {
      requestFullscreen();
    }
  }, [orientation]);

  const onWindowResize = () => {
    clearTimeout(window.resizeLag);
    window.resizeLag = setTimeout(() => {
      delete window.resizeLag;
      setOrientation(isLandscape() ? 'landscape' : 'portrait');
    }, 200);
  };

  useEffect(() => {
    if (typeof window !== undefined) {
      window.addEventListener('resize', () => onWindowResize());

      return window.removeEventListener('resize', () => onWindowResize());
    }
  }, []);

  const forwardHandler = () => {
    if (element.current) {
      element.current.currentTime += 10;
    }
  };

  const backwardHandler = () => {
    if (element.current) {
      element.current.currentTime -= 10;
    }
  };

  return {
    forwardHandler,
    backwardHandler,
    error,
  };
};
