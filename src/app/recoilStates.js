import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist()
export const NowPlayingId = atom({
  key: 'NowPlayingId',
  default: '',
});
export const AudioSrc = atom({
  key: 'AudioSrc',
  default: '',
  effects_UNSTABLE: [persistAtom]
})
export const AccessToken = atom({
  key: 'RefreshToken',
  default: ''
})
export const PlayingCurrentTime = atom({
  key: 'PlayingCurrentTime',
  default: 0,
  effects_UNSTABLE: [persistAtom]
})