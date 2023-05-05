import { useEffect, useRef } from 'react';

import { usePlayer } from '@/shared/hooks/usePlayer';

import css from './index.module.css';

type Props = {
  video: string;
};

export const Player = ({ video }: Props) => {
  const playerRef = useRef<HTMLVideoElement>(null);

  const { forwardHandler, backwardHandler, requestFs, hideFsBtn, isShowFSBtn } = usePlayer({
    element: playerRef,
    videoUrl: video,
  });

  useEffect(() => {
    if (isShowFSBtn) {
      setTimeout(() => hideFsBtn(), 5000);
    }
  }, [isShowFSBtn, hideFsBtn]);

  if (!video) {
    return null;
  }

  return (
    <div>
      <div className={css['video-wrapper']}>
        <video className={css.video} controls playsInline ref={playerRef} />
        <button type="button" className={css.backward} onClick={backwardHandler}>
          Backward
        </button>
        <button type="button" className={css.forward} onClick={forwardHandler}>
          Forward
        </button>
        {isShowFSBtn ? (
          <button className={css.fullscreen} type="button" onClick={requestFs}>
            Fullscreen
          </button>
        ) : null}
      </div>
    </div>
  );
};
