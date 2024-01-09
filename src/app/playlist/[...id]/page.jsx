import { PlaylistPage } from "./playlistpage";

export async function generateMetadata({ params, searchParams }) {
  console.log(params['id'][0], searchParams['playlist'])
  // getPlaylistAtoms()
  return {
    title: searchParams['playlist'] || 'playlist',
    description: params['id'][0] || 'description'
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
  await axios.post(`/api/playlist`, { nickname: nickname, playlist: playlist })
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
      console.log(tr)
    }).catch(e => {
      console.log(e);
    })
}


const refresh_token = async e => {
  return await axios.patch(`/api/refresh_token`,
    { refreshToken: process.env.NEXT_PUBLIC_REFRESH_TOKEN }).then(e => {
      const info = e.data;
      // if (!info?.error) {
      //   localStorage.setItem('access', info.access_token);
      //   localStorage.setItem('expire', new Date().getTime() + info.expires_in * 1000);
      //   setAccess(info.access_token);
      // }
      return info.access_token;
    }).catch(e => {
      console.log(e);
    })
}

export default function App(props) {
  return <PlaylistPage {...props} />;
}