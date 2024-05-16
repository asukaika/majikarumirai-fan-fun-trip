import { useState, useEffect, useMemo } from "react";
import { Player, PlayerListener } from "textalive-app-api";
import { Stage, Container, Text } from "@pixi/react";
import * as PIXI from "pixi.js";
import "./App.css";

function App() {
  const [currentLyric, setCurrentLyric] = useState<string>("");
  const [player, setPlayer] = useState<Player | null>(null);
  const [mediaElement, setMediaElement] = useState<HTMLDivElement | null>(null);
  const media = useMemo(
    () => <div className="media" ref={setMediaElement} />,
    []
  );
  const [x, setX] = useState(0);
  const [direction, setDirection] = useState(1);

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
          p.createFromSongUrl("http://www.youtube.com/watch?v=XSLhsjepelI");
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

  useEffect(() => {
    const moveText = () => {
      setX((prevX) => {
        const newX = prevX + direction * 5;
        if (newX > window.innerWidth - 100 || newX < 0) {
          setDirection(-direction);
        }
        return newX;
      });
    };

    const ticker = new PIXI.Ticker();
    ticker.add(moveText);
    ticker.start();

    return () => {
      ticker.stop();
      ticker.destroy();
    };
  }, [direction]);
  const handlePlayClick = () => {
    if (player) {
      player.requestPlay();
    }
  };

  return (
    <>
      <div className="App">
        {media}
        <Stage options={{ background: 0xffffff }}>
          <Container x={x} y={330}>
            <Text text={currentLyric} anchor={{ x: 0, y: 1 }} />
          </Container>
        </Stage>
        <button onClick={handlePlayClick}>再生</button>
      </div>
    </>
  );
}

export default App;
