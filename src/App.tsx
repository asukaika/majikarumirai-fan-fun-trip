import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Player, PlayerListener } from "textalive-app-api";
import { Stage, Text, Graphics } from "@pixi/react";
import * as PIXI from "pixi.js";
import "./App.css";

export const App = () => {
  const [currentLyric, setCurrentLyric] = useState<string>("");
  const [player, setPlayer] = useState<Player | null>(null);
  const [mediaElement, setMediaElement] = useState<HTMLDivElement | null>(null);
  const media = useMemo(
    () => <div className="media" ref={setMediaElement} />,
    []
  );
  const [x, setX] = useState(400);
  const myRef = useRef<boolean>(true);

  const [app] = useState(675);
  const [y, setY] = useState(550);
  const [jump, setJump] = useState(false);
  const [jumpSpeed, setJumpSpeed] = useState(0);

  // const useIntervalBy1s = (callback: () => void) => {
  //   const callbackRef = useRef<() => void>(callback);
  //   useEffect(() => {
  //     callbackRef.current = callback; // 新しいcallbackをrefに格納！
  //   }, [callback]);

  //   useEffect(() => {
  //     const tick = () => {
  //       callbackRef.current();
  //     };
  //     const id = setInterval(tick, 1000);
  //     return () => {
  //       clearInterval(id);
  //     };
  //   }, []); //refはミュータブルなので依存配列に含めなくてもよい
  // };

  const drawBox = useCallback((g: PIXI.Graphics) => {
    g.clear();
    g.beginFill(0x8ababb);
    g.drawRect(0, 0, 50, 50); // 幅50、高さ50の四角形を描画
    g.endFill();
  }, []);

  useEffect(() => {
    const jumpBox = () => {
      if (jump) {
        setY((y) => y - jumpSpeed);
        setJumpSpeed((jumpSpeed) => jumpSpeed - 1);
        if (y > 550) {
          setJump(false);
          setJumpSpeed(0);
          setY(550);
        }
      }
    };

    const handleClick = () => {
      if (!jump) {
        setJump(true);
        setJumpSpeed(15);
      }
    };

    window.addEventListener("click", handleClick);

    const ticker = new PIXI.Ticker();
    ticker.add(jumpBox);
    ticker.start();

    return () => {
      ticker.remove(jumpBox);
      window.removeEventListener("click", handleClick);
    };
  }, [jump, y, jumpSpeed, app]);

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
          p.createFromSongUrl("https://piapro.jp/t/hZ35/20240130103028", {
            video: {
              // 音楽地図訂正履歴
              beatId: 4592293,
              chordId: 2727635,
              repetitiveSegmentId: 2824326,
              // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FhZ35%2F20240130103028
              lyricId: 59415,
              lyricDiffId: 13962,
            },
          });
        }
      },
      onVideoReady: () => {
        let c = p.video.firstChar;
        let lastPhraseStartTime: number;

        let charContainer: string = "";
        while (c) {
          //実装へんこうすべき//setTime
          c.animate = (now, u) => {
            if (u.contains(now)) {
              if (lastPhraseStartTime !== u.startTime) {
                myRef.current = false;
                lastPhraseStartTime = u.startTime;
                charContainer += u.text;
                setCurrentLyric(charContainer);
              }
              if (u.next.startTime > u.startTime + 5000) {
                myRef.current = true;
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

        const newX = prevX - 0.6;
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
        <Stage width={1200} height={675} options={{ background: 0xb3e6ea }}>
          <Graphics draw={drawBox} x={50} y={y} />

          <Text text={currentLyric} x={x} y={650} anchor={{ x: 0, y: 1 }} />
        </Stage>
        <button onClick={handlePlayClick}>再生</button>
      </div>
    </>
  );
};
