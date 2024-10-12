import { create } from "zustand";
import { persist } from 'zustand/middleware'

export const Store = create((set) => ({
  NowPlayingId: '',
  AudioSrc: '',
  RefreshToken: '',
  PlayingCurrentTime: 0,
  Volume: 0.7,
  AddButtonIndex: false,
  playlists: []
}))


export const PlaylistsStore = create(
  persist((set) => ({
    playlists: [],
    setPlaylists: (playlists) => set({ playlists })
  }),
    { name: 'playlists-store' },
  )
)

export const PlayStore = create(
  persist((set) => ({
    play: false,
    setPlay: (play) => set({ play })
  }),
    { name: 'play-store' })
)

// export const NowPlayingId = atom({
//   key: 'NowPlayingId',
//   default: '',
// });
// export const AudioSrc = atom({
//   key: 'AudioSrc',
//   default: '',
//   effects_UNSTABLE: [persistAtom]
// })
// export const AccessToken = atom({
//   key: 'RefreshToken',
//   default: '',
//   effects_UNSTABLE: [persistAtom]
// })
// export const PlayingCurrentTime = atom({
//   key: 'PlayingCurrentTime',
//   default: 0,
//   effects_UNSTABLE: [persistAtom]
// })
// export const Volume = atom({
//   key: 'Volume',
//   default: 0.7,
//   effects_UNSTABLE: [persistAtom]
// })
// export const AddbuttonIndex = atom({
//   key: 'AddButtonIndex',
//   default: false
// })