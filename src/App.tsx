import { useState, useEffect } from "react";
import { Player } from "textalive-app-api";
import "./App.css";

function App() {
  const [currentLyric] = useState<{ text: string | null }>({ text: null });
  const player = new Player({
    app: {
      token: "1qZhyX3989MTUw4H",
    },
  });

  useEffect(() => {
    player.addListener({
      onAppReady: (app) => {
        if (app.songUrl) {
          //ホストあり
        } else {
          player.createFromSongUrl("https://piapro.jp/t/hZ35/20240130103028");
        }
      },
      onVideoReady: () => {
        const phrase = player?.video.firstPhrase;
        let lastPhraseStartTime: number;

        while (phrase) {
          phrase.animate = (now, unit) => {
            if (unit.contains(now)) {
              if (lastPhraseStartTime !== unit.startTime) {
                lastPhraseStartTime = unit.startTime;
                currentLyric.text = unit.text;
              }
            }
          };
        }
      },
    });
  });
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
            {currentLyric && <p>{currentLyric.text}</p>}
          </div>
          <div>
            <button onClick={handlePlayClick}>再生</button>
          </div>
          <video
            id="media"
            controls
            style={{ width: "100%", maxWidth: "640px" }}
          ></video>
        </header>
      </div>
    </>
  );
}

export default App;
