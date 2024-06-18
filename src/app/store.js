import { create } from "zustand";

export const Store = create((set) => ({
  NowPlayingId: '',
  AudioSrc: '',
  RefreshToken: '',
  PlayingCurrentTime: 0,
  Volume: 0.7,
  AddButtonIndex: false
}))
// export const AccessToken = atom({
//   key: 'RefreshToken',
//   default: '',
//   effects_UNSTABLE: [persistAtom]
// })