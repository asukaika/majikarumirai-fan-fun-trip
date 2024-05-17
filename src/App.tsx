import { useState, useEffect, useMemo, useRef } from "react";
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
  const [x, setX] = useState(800);
  const myRef = useRef<boolean>(true);

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
        // eslint-disable-next-line prefer-const
        let c = p?.video.firstChar;
        let lastPhraseStartTime: number;

        let charContainer: string = "";
        while (c) {
          c.animate = (now, u) => {
            if (u.contains(now)) {
              if (lastPhraseStartTime !== u.startTime) {
                myRef.current = false;
                lastPhraseStartTime = u.startTime;
                charContainer = charContainer + u.text;
                setCurrentLyric(charContainer);
                console.log(1);
              }
              if (u.next.startTime > u.startTime) {
                console.log(2);
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
        if (myRef.current) {
          return prevX;
        }

        const newX = prevX - 2;
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
  }, []);
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
