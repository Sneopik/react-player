import Hls from 'hls.js';
import { ChangeEvent, RefObject, useEffect, useState } from 'react';

import { getFileExtension } from '../utils/lib/getFileExtension';

declare global {
  interface Window {
    resizeLag?: NodeJS.Timeout;
  }

  interface HTMLVideoElement {
    mozRequestFullScreen(): Promise<void>;
    webkitRequestFullscreen(): Promise<void>;
    msRequestFullscreen(): Promise<void>;
  }
}

type Props = {
  element: RefObject<HTMLVideoElement>;
  videoUrl: string;
};

type HookReturnType = {
  forwardHandler: () => void;
  backwardHandler: () => void;
  isPlaying: boolean;
  togglePlay: () => void;
  togglePause: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  progress: number;
  onSeek: (e: ChangeEvent<HTMLInputElement>) => void;
  onTimeUpdate: () => void;
  fullscreenHandler: () => void;
  isShowControls: boolean;
  error: string;
};

export const usePlayer = ({ element, videoUrl }: Props): HookReturnType => {
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('portrait');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [isShowControls, setIsShowControls] = useState<boolean>(false);

  const togglePlay = () => {
    if (element.current) {
      setIsPlaying(true);
      element.current.play();
    }
  };

  const togglePause = () => {
    if (element.current) {
      setIsPlaying(false);
      element.current.pause();
    }
  };

  const onTimeUpdate = () => {
    if (element.current) {
      const progress = (element.current.currentTime / element.current.duration) * 100;
      setProgress(progress);
    }
  };

  const onSeek = (e: ChangeEvent<HTMLInputElement>) => {
    if (element.current) {
      const newValue = Number(e.target.value);
      element.current.currentTime = (element.current.duration / 100) * newValue;
      setProgress(newValue);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    if (element.current) {
      isMuted ? (element.current.muted = true) : (element.current.muted = false);
    }
  }, [isMuted, element]);

  const isLandscape = () =>
    window.matchMedia('(orientation: landscape) and (max-width: 1024px)').matches;

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
      if (element?.current.requestFullscreen) {
        await element.current.requestFullscreen();
      } else if (element?.current?.webkitRequestFullscreen) {
        await element.current.webkitRequestFullscreen();
      } else if (element?.current?.mozRequestFullScreen) {
        await element.current.mozRequestFullScreen();
      } else if (element?.current?.msRequestFullscreen) {
        await element.current.msRequestFullscreen();
      } else {
        setIsShowControls(true);
        setError('Unable to enter full screen mode. Use the native functionality');
      }
    } catch (e) {
      setIsShowControls(true);
      setError('Unable to enter full screen mode. Use the native functionality');
    }
  };

  useEffect(() => {
    if (orientation === 'landscape') {
      requestFullscreen();
    } else {
      setIsShowControls(false);
    }
  }, [orientation]);

  const onWindowResize = () => {
    clearTimeout(window.resizeLag);
    window.resizeLag = setTimeout(() => {
      delete window.resizeLag;
      setOrientation(isLandscape() ? 'landscape' : 'portrait');
    }, 200);
  };

  const handleKeyClick = (e: KeyboardEvent) => {
    if (e.key === ' ') {
      !isPlaying ? togglePlay() : togglePause();
    }

    if (e.key.toLowerCase() === 'arrowright') {
      forwardHandler();
    }

    if (e.key.toLowerCase() === 'arrowleft') {
      backwardHandler();
    }

    if (e.key.toLowerCase() === 'f') {
      requestFullscreen();
    }
  };

  useEffect(() => {
    if (typeof window !== undefined) {
      window.addEventListener('resize', () => onWindowResize());
      window.addEventListener('keyup', handleKeyClick);

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
    isPlaying,
    togglePlay,
    togglePause,
    isMuted,
    toggleMute,
    progress,
    onSeek,
    onTimeUpdate,
    fullscreenHandler: requestFullscreen,
    isShowControls,
    error,
  };
};
