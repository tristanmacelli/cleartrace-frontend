// TODO: add settings page with setting to allow sounds to be played on user device
export const PlaySound = () => {
  const audio = new Audio(require("@/assets/electronic-chime.mp3"));
  audio.play();
};
