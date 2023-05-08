import { ChangeEvent, ComponentProps } from 'react';
import cx from 'classnames';

import { PlayIcon } from '@/shared/ui/atoms/icons/PlayIcon';
import { PauseIcon } from '@/shared/ui/atoms/icons/PauseIcon';
import { MutedIcon } from '@/shared/ui/atoms/icons/MutedIcon';
import { VolumeIcon } from '@/shared/ui/atoms/icons/VolumeIcon';
import { FullscreenIcon } from '@/shared/ui/atoms/icons/FullscreenIcon';

import css from './index.module.css';

type Props = ComponentProps<'div'> & {
  isPlaying: boolean;
  togglePlay: () => void;
  togglePause: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  progress: number;
  onSeek: (e: ChangeEvent<HTMLInputElement>) => void;
  fullscreenHandler: () => void;
};

export const Controls = ({
  isPlaying,
  togglePlay,
  togglePause,
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
      <button className={css.play} type="button" onClick={isPlaying ? togglePause : togglePlay}>
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      <button className={css.mute} type="button" onClick={toggleMute}>
        {isMuted ? <MutedIcon /> : <VolumeIcon />}
      </button>
      <button className={css.fullscreen} type="button" onClick={fullscreenHandler}>
        <FullscreenIcon />
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
