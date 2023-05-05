import { Player } from '@/shared/ui/organisms/Player';

export const PlayerPage = () => {
  const hls = 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8';
  return (
    <section>
      <Player video={hls} />
    </section>
  );
};
