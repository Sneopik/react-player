import { useEffect, useRef, useState } from 'react';
import cx from 'classnames';

import { usePlayer } from '@/shared/hooks/usePlayer';

import { Error } from '../../atoms/Error';

import { Controls } from './components/Controls';

import css from './index.module.css';

type Props = {
  video: string;
};

export const Player = ({ video }: Props) => {
  const playerRef = useRef<HTMLVideoElement>(null);
  const [isVisibleError, setIsVisibleError] = useState<boolean>(false);
  const [isVisibleControls, setIsVisibleControls] = useState<boolean>(false);
  const [waitingClick, setWaitingClick] = useState<NodeJS.Timeout | null>(null);
  const [lastClick, setLastClick] = useState<number>(0);

  const {
    forwardHandler,
    backwardHandler,
    isPlaying,
    onTimeUpdate,
    error,
    togglePlay,
    isMuted,
    toggleMute,
    progress,
    onSeek,
    fullscreenHandler,
  } = usePlayer({
    element: playerRef,
    videoUrl: video,
  });

  const doubleClickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && playerRef.current) {
      const position = event.clientX;
      const playerPos = playerRef.current.getBoundingClientRect();

      if (position >= playerPos.left && position <= playerPos.width / 2) {
        backwardHandler();
      } else {
        forwardHandler();
      }
    }
  };

  const doubleTouchHandler = (event: React.TouchEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && playerRef.current) {
      const position = event.changedTouches[0].clientX;
      const playerPos = playerRef.current.getBoundingClientRect();

      if (position >= playerPos.left && position <= playerPos.width / 2) {
        backwardHandler();
      } else {
        forwardHandler();
      }
    }
  };

  const handleDoubleTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    if (lastClick && e.timeStamp - lastClick < 250 && waitingClick) {
      setLastClick(0);
      clearTimeout(waitingClick);
      setWaitingClick(null);
      doubleTouchHandler(e);
    } else {
      setLastClick(e.timeStamp);
      setWaitingClick(
        setTimeout(() => {
          setWaitingClick(null);
        }, 251)
      );
    }
  };

  const clickHandler = () => {
    setIsVisibleControls(true);

    setTimeout(() => {
      setIsVisibleControls(false);
    }, 5000);
  };

  useEffect(() => {
    if (error) {
      setIsVisibleError(true);
      setTimeout(() => {
        setIsVisibleError(false);
      }, 3000);
    }
  }, [error]);

  if (!video) {
    return null;
  }

  return (
    <>
      <div
        className={css['video-wrapper']}
        onClick={clickHandler}
        onDoubleClick={doubleClickHandler}
        onTouchEnd={handleDoubleTouch}
      >
        <video
          onTimeUpdate={onTimeUpdate}
          muted={isMuted}
          className={css.video}
          playsInline
          ref={playerRef}
        />
        {!isPlaying ? (
          <button className={css.play} type="button" onClick={togglePlay}>
            Play
          </button>
        ) : null}
        <Controls
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          isMuted={isMuted}
          toggleMute={toggleMute}
          progress={progress}
          onSeek={onSeek}
          fullscreenHandler={fullscreenHandler}
          className={cx({
            [css.controls_visible]: isVisibleControls,
          })}
        />
      </div>
      <Error
        className={cx(css.error, {
          [css.error_visible]: isVisibleError,
        })}
        msg={error}
      />
    </>
  );
};
