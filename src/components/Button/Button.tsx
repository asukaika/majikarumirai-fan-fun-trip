interface Props {
  onClick(): void;
}
export const Button = ({ onClick }: Props) => {
  return (
    <>
      <button onClick={onClick}>再生</button>
    </>
  );
};
