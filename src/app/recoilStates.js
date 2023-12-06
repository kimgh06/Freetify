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
  default: '',
  effects_UNSTABLE: [persistAtom]
})
export const PlayingCurrentTime = atom({
  key: 'PlayingCurrentTime',
  default: 0,
  effects_UNSTABLE: [persistAtom]
})
export const Volume = atom({
  key: 'Volume',
  default: 0.7,
  effects_UNSTABLE: [persistAtom]
})
export const AddbuttonIndex = atom({
  key: 'AddButtonIndex',
  default: false
})