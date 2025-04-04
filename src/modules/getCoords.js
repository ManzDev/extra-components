// 0 .. 35
// 0 .. 10 --> poco probable
// 10 .. 25 --> muy probable
// 25 .. 35 --> poco probable

export default (width) => {
  const x = Math.floor(Math.random() * width);
  const y = Math.random() > 0.2 ?
    (10 + Math.random() * 15) :
    (Math.random() > 0.5 ? 20 : 5) + Math.random() * 10;

  return { x, y };
}
