import { atom } from "recoil";
export const NowPlayingId = atom({
  key: 'NowPlayingId',
  default: ''
});
export const AudioSrc = atom({
  key: 'AudioSrc',
  default: ''
})
export const AccessToken = atom({
  key: 'RefreshToken',
  default: ''
})

function string2tag(str) {
  if (str) {
    let D = document.createElement("div");
    D.innerHTML = str;
    return D.querySelectorAll('audio')[0];
  }
  return new Audio(null);
}