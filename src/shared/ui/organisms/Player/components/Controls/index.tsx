import { ChangeEvent, ComponentProps } from 'react';
import cx from 'classnames';

import css from './index.module.css';

type Props = ComponentProps<'div'> & {
  isPlaying: boolean;
  togglePlay: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  progress: number;
  onSeek: (e: ChangeEvent<HTMLInputElement>) => void;
  fullscreenHandler: () => void;
};

export const Controls = ({
  isPlaying,
  togglePlay,
  isMuted,
  toggleMute,
  className,
  progress,
  onSeek,
  fullscreenHandler,
  ...props
}: Props) => (
  <div className={cx(css.wrapper, className)} {...props}>
    <div className={css.controls}>
      <button type="button" onClick={togglePlay}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button type="button" onClick={toggleMute}>
        {isMuted ? 'Unmute' : 'Mute'}
      </button>
      <button type="button" onClick={fullscreenHandler}>
        Fullscreen
      </button>
    </div>
    <input
      className={css.progress}
      type="range"
      min="0"
      max="100"
      value={progress || 0}
      onChange={onSeek}
    />
  </div>
);
