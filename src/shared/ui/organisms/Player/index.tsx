import { useEffect, useRef, useState } from 'react';
import cx from 'classnames';

import { usePlayer } from '@/shared/hooks/usePlayer';

import { Error } from '../../atoms/Error';

import css from './index.module.css';

type Props = {
  video: string;
};

export const Player = ({ video }: Props) => {
  const playerRef = useRef<HTMLVideoElement>(null);
  const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false);

  const { forwardHandler, backwardHandler, error } = usePlayer({
    element: playerRef,
    videoUrl: video,
  });

  useEffect(() => {
    if (error) {
      setIsErrorVisible(true);
      setTimeout(() => {
        setIsErrorVisible(false);
      }, 3000);
    }
  }, [error]);

  if (!video) {
    return null;
  }

  return (
    <>
      <div className={css['video-wrapper']}>
        <video className={css.video} controls playsInline ref={playerRef} />
        <button type="button" className={css.backward} onClick={backwardHandler}>
          Backward
        </button>
        <button type="button" className={css.forward} onClick={forwardHandler}>
          Forward
        </button>
      </div>
      <Error
        className={cx(css.error, {
          [css.error_visible]: isErrorVisible,
        })}
        msg={error}
      />
    </>
  );
};
