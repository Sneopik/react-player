import Hls from 'hls.js';
import { RefObject, useEffect, useState } from 'react';

import { getFileExtension } from '../utils/lib/getFileExtension';

type Props = {
  element: RefObject<HTMLVideoElement>;
  videoUrl: string;
};

type HookReturnType = {
  isShowFSBtn: boolean;
  forwardHandler: () => void;
  backwardHandler: () => void;
  requestFs: () => void;
  hideFsBtn: () => void;
};

export const usePlayer = ({ element, videoUrl }: Props): HookReturnType => {
  const [isShowFSBtn, setIsShowFSBtn] = useState<boolean>(false);

  const hideFsBtn = () => {
    setIsShowFSBtn(false);
  };

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
      setIsShowFSBtn(false);
      await element.current.requestFullscreen();
    } catch (e) {
      console.log(e);
      setIsShowFSBtn(true);
    }
  };

  const handleOrientation = () => {
    if (!element) {
      return;
    }

    if (window.screen.orientation.type.includes('landscape')) {
      requestFullscreen();
    } else {
      setIsShowFSBtn(false);
    }
  };

  useEffect(() => {
    if (typeof window !== undefined) {
      window.addEventListener('orientationchange', () => handleOrientation());

      return window.removeEventListener('orientationchange', () => handleOrientation());
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
    isShowFSBtn,
    forwardHandler,
    backwardHandler,
    requestFs: requestFullscreen,
    hideFsBtn,
  };
};
