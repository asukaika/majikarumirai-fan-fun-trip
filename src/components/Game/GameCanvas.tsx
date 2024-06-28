import { useState, useEffect } from "react";
import { Stage, Text, Sprite } from "@pixi/react";
import * as PIXI from "pixi.js";
import miku from "../../assets/miku_v1.png";
interface Props {
  currentLyric: string;
  lyricPlaying: boolean;
}

export const GameCanvas = (LyricState: Props) => {
  const [x, setX] = useState(400);

  const [app] = useState(675);
  const [y, setY] = useState(550);
  const [jump, setJump] = useState(false);
  const [jumpSpeed, setJumpSpeed] = useState(0);

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
    const moveText = () => {
      setX((prevX) => {
        if (LyricState.lyricPlaying) {
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
  }, [LyricState.lyricPlaying]);

  return (
    <>
      <Stage width={1200} height={675} options={{ background: 0xb3e6ea }}>
        <Sprite width={64} height={96} image={miku} x={50} y={y} />
        <Text
          text={LyricState.currentLyric}
          x={x}
          y={650}
          anchor={{ x: 0, y: 1 }}
        />
      </Stage>
    </>
  );
};
