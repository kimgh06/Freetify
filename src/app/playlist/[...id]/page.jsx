import axios from "axios";
import { PlaylistPage } from "./playlistpage";

export async function generateMetadata({ params, searchParams }) {
  if (!(params['id'][0] && searchParams['playlist'])) {
    return
  }
  const info = await getPlaylistAtoms(params['id'][0], searchParams['playlist']);
  if (!info) {
    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_AUTH_URL),
      openGraph: {
        title: `${searchParams['playlist']}, made by ${params['id'][0]}` || 'playlist',
        description: 'Access to error to get playlist'
      }
    };
  }
  const description = `${searchParams['playlist']}, playlist, ${info['length']} songs`
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
  return await axios.get(`${process.env.NEXT_PUBLIC_AUTH_URL}/api/playlist/${nickname}/${playlist}`)
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

export default async function App(props) {
  const { params, searchParams } = props;
  if (!(params['id'][0] && searchParams['playlist'])) {
    return
  }
  const info = await getPlaylistAtoms(params['id'][0], searchParams['playlist']);
  return <PlaylistPage {...props} trackss={info} />;
}