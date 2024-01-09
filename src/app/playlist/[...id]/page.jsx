import axios from "axios";
import { PlaylistPage } from "./playlistpage";

export async function generateMetadata({ params, searchParams }) {
  if (!(params['id'][0] && searchParams['playlist'])) {
    return
  }
  const info = await getPlaylistAtoms(params['id'][0], searchParams['playlist']);
  const description = info?.map((i, n) => `${i.name} release at ${i.album.release_date}, artist ${JSON.stringify(i.artists.map((i, n) => i.name).join(', ')).replace(/"/g, "")}, ${(i.duration_ms - i.duration_ms % 60000) / 60000}:${((i.duration_ms % 60000 - (i.duration_ms % 60000) % 1000) / 1000).toString().padStart(2, '0')} `)
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_AUTH_URL),
    openGraph: {
      title: `${searchParams['playlist']}, made by ${params['id'][0]}` || 'playlist',
      description: description || 'description'
    }
  }
}

const getTrackinfos = async ids => {
  const access = await refresh_token();
  if (ids) {
    return await axios.get(`https://api.spotify.com/v1/tracks?ids=${ids}`, { headers: { Authorization: `Bearer ${access}` } }).then(e => {
      return e.data.tracks
    }).catch(e => {
      console.log(e);
    });
  }
}

const getPlaylistAtoms = async (nickname, playlist) => {
  return await axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/api/playlist`, { nickname: nickname, playlist: playlist })
    .then(async e => {
      let ids = [];
      e.data.res.forEach(e => {
        ids.push(e.song_id)
      })
      ids = ids.join(',');
      let tr = await getTrackinfos(ids);
      if (!tr) {
        return;
      }
      return tr
    }).catch(e => {
      console.log(e);
    })
}


const refresh_token = async e => {
  return await axios.patch(`${process.env.NEXT_PUBLIC_AUTH_URL}/api/refresh_token`,
    { refreshToken: process.env.NEXT_PUBLIC_REFRESH_TOKEN }).then(e => {
      const info = e.data;
      return info.access_token;
    }).catch(e => {
      console.log(e);
    })
}

export default function App(props) {
  return <PlaylistPage {...props} />;
}