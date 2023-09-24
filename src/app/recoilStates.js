import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();
export const NowPlayingId = atom({
  key: 'NowPlayingId',
  default: ''
});

export const PlayingAudio = atom({
  key: 'PlayingAudio',
  default: new Audio(),
  // effects_UNSTABLE: [persistAtom],
})

function string2tag(str) {
  if (str) {
    let D = document.createElement("div");
    D.innerHTML = str;
    return D.querySelectorAll('audio')[0];
  }
  return new Audio(null);
}