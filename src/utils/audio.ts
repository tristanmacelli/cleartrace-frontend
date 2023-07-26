export const PlaySound = (path: string) => {
  new Audio(path).play();
};
