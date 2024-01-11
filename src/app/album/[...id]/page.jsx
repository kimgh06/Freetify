import axios from 'axios';
import { Album } from './albumpage';


export async function generateMetadata({ params }) {
  if (!params['id'][0]) {
    return;
  }
  const { title, tracks, author, duration } = await getAlbumInfos(params['id'][0]);
  const description = `${title} - ${author}, album, ${tracks.length} songs, ${duration}`
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_AUTH_URL),
    openGraph: {
      title: `${title} - ${author}` || 'playlist',
      description: description || 'description'
    }
  }
}

const getTrackinfos = async (ids, access) => {
  if (ids) {
    return await axios.get(`https://api.spotify.com/v1/tracks?ids=${ids}`, { headers: { Authorization: `Bearer ${access}` } }).then(e => {
      return e.data.tracks
    }).catch(e => {
      console.log(e);
    });
  }
}


const getAlbumInfos = async id => {
  const url = 'https://api.spotify.com/v1';
  const access = await refresh_token();
  return await axios.get(`${url}/albums/${id}`, { headers: { Authorization: `Bearer ${access}` } })
    .then(async e => {
      let TrackList = [];
      let sum = 0;
      e.data.tracks.items.forEach(items => {
        TrackList.push(items.id);
        sum += items.duration_ms
      });
      let tr = await getTrackinfos(TrackList, access);
      sum = `${Math.floor(sum / 60 / 1000)}m ${((sum % 60000 - (sum % 60000) % 1000) / 1000).toString().padStart(2, '0')}s`;
      return { title: e.data.name, author: e.data.artists.map((i, n) => i.name).join(' & '), tracks: tr, duration: sum };
    }).catch(e => {
      console.log(e);
    });
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
  return <Album {...props} />;
}
