import { useState, useEffect, useMemo } from "react";
import { Player, PlayerListener } from "textalive-app-api";
import "./App.css";

function App() {
  const [currentLyric, setCurrentLyric] = useState<string>("");
  const [player, setPlayer] = useState<Player | null>(null);
  const [mediaElement, setMediaElement] = useState<HTMLDivElement | null>(null);
  const media = useMemo(
    () => <div className="media" ref={setMediaElement} />,
    []
  );

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
          p.createFromSongUrl("https://piapro.jp/t/XiaI/20240201203346");
        }
      },
      onVideoReady: () => {
        let c = p.video.firstChar;
        let lastPhraseStartTime: number;
        let charContainer: string = "";
        while (c && c.next) {
          c.animate = (now, u) => {
            if (u.contains(now)) {
              if (lastPhraseStartTime !== u.startTime) {
                lastPhraseStartTime = u.startTime;
                charContainer = charContainer + u.text;
                setCurrentLyric(charContainer);
              }
            }
          };
          c = c.next;
        }
      },
    };
    p.addListener(playerListener);
    setPlayer(p);
    return () => {
      p.removeListener(playerListener);
      p.dispose();
    };
  }, [mediaElement]);
  const handlePlayClick = () => {
    if (player) {
      player.requestPlay();
    }
  };

  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1>Lyric Display App</h1>
          <div className="Lyric-container">
            <div>
              {" "}
              {media}
              {currentLyric}
            </div>
          </div>
          <div>
            <button onClick={handlePlayClick}>再生</button>
          </div>
        </header>
      </div>
    </>
  );
}

export default App;
