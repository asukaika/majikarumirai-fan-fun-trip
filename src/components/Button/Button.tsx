interface Props {
  onClick(): void;
  isVideoReady: boolean;
}
export const Button = ({ onClick, isVideoReady }: Props) => {
  return (
    <>
      <button disabled={isVideoReady} onClick={onClick}>
        再生
      </button>
    </>
  );
};
