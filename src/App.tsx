import { useState, useEffect, useMemo } from "react";
import { Player, PlayerListener } from "textalive-app-api";

import "./App.css";
import { GameCanvas } from "./components/Game/GameCanvas";
import { Button } from "./components/Button/Button";

export const App = () => {
  const [currentLyric, setCurrentLyric] = useState<string>("");
  const [position, setPosition] = useState(-1);
  const [player, setPlayer] = useState<Player | null>(null);
  // const [isVideoReady, setIsVideoReady] = useState(false);
  const [mediaElement, setMediaElement] = useState<HTMLDivElement | null>(null);
  const media = useMemo(
    () => <div className="media" ref={setMediaElement} />,
    []
  );
  // const [lyricPlaying, setLyricPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined" || !mediaElement) {
      return;
    }
    const p = new Player({
      app: {
        token: "1qZhyX3989MTUw4H",
      },
      mediaElement,
    });
    const playerListener: PlayerListener = {
      onAppReady: (app) => {
        if (app.songUrl) {
          //ホストあり
        } else {
          //    // Super Hero
          // p.createFromSongUrl("https://piapro.jp/t/hZ35/20240130103028", {
          //   video: {
          //     // 音楽地図訂正履歴
          //     beatId: 4592293,
          //     chordId: 2727635,
          //     repetitiveSegmentId: 2824326,
          //     // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FhZ35%2F20240130103028
          //     lyricId: 59415,
          //     lyricDiffId: 13962,
          //   },
          // });
          p.createFromSongUrl("https://piapro.jp/t/RoPB/20220122172830", {
            video: {
              // 音楽地図訂正履歴: https://songle.jp/songs/2243651/history
              beatId: 4086301,
              chordId: 2221797,
              repetitiveSegmentId: 2247682,
              // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FRoPB%2F20220122172830
              lyricId: 53718,
              lyricDiffId: 7076,
            },
          });
        }
      },
      //この中に詰めない,
      onVideoReady: () => {},
      onTimeUpdate: (position) => {
        setPosition(position);
      },
    };
    p.addListener(playerListener);
    setPlayer(p);

    return () => {
      p.removeListener(playerListener);
      p.dispose();
    };
  }, [mediaElement]);

  useEffect(() => {
    setCurrentLyric(player?.video.firstChar.text || "");
  }, [position]);

  const handlePlayClick = () => {
    if (player) {
      player.requestPlay();
    }
  };

  return (
    <>
      <div className="App">
        {media}
        <GameCanvas currentLyric={currentLyric} lyricPlaying={true} />
        <Button isVideoReady={false} onClick={handlePlayClick} />
      </div>
    </>
  );
};
