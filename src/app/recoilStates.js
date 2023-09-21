import { atom } from "recoil";
export const NowPlayingId = atom({
  key: 'NowPlayingId',
  default: ''
});

export const PlayingAudio = atom({
  key: 'PlayingAudio',
  default: (new Audio())
})