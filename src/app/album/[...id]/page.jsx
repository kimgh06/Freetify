import axios from 'axios';
import { InnerContent } from './InnerContent';


export async function generateMetadata({ params }, parent) {
  if (!params['id'][0] || params['id'][0] === 'null' || params['id'][0] === 'undefined') {
    return;
  }
  const { img, title, tracks, author, duration } = await getAlbumInfos(params['id'][0]);
  const description = `${title} - ${author}, album, ${tracks.length} songs, ${duration}`
  const previousImg = (await parent)?.openGraph?.images || []
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_AUTH_URL),
    openGraph: {
      title: `${title} - ${author}` || 'playlist',
      description: description || 'description',
      images: [img]
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
      return { img: e.data?.images[0].url, title: e.data.name, author: e.data.artists.map((i, n) => i.name).join(' & '), tracks: tr, duration: sum };
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


export default async function App(props) {
  const id = props.params.id[0];
  const url = 'https://api.spotify.com/v1';
  const refresh_token = async e => {
    return await axios.patch(`${process.env.NEXT_PUBLIC_AUTH_URL}/api/refresh_token`,
      { refreshToken: process.env.NEXT_PUBLIC_REFRESH_TOKEN }).then(e => {
        return e.data.access_token;
      }).catch(e => {
        console.log(e);
        return null;
      })
  }
  const getAlbumInfos = async e => {
    const access = await refresh_token();
    return await axios.get(`${url}/albums/${id}`, { headers: { Authorization: `Bearer ${access}` } })
      .then(e => {
        const albumInfo = e.data;
        let TrackList = [];
        let sum = 0;
        albumInfo.tracks.items.forEach(items => {
          TrackList.push(items.id);
          sum += items.duration_ms
        });
        let totalDuration = `${Math.floor(sum / 60 / 1000)}m ${((sum % 60000 - (sum % 60000) % 1000) / 1000).toString().padStart(2, '0')}s`;
        return {
          albumInfo,
          tracks: albumInfo.tracks.items,
          totalDuration,
          TrackList
        }
      }).catch(e => {
        console.log(e);
      });
  }
  let { albumInfo, tracks, totalDuration, TrackList } = await getAlbumInfos();
  return <InnerContent albumInfo={albumInfo} tracks={tracks} totalDuration={totalDuration} TrackList={TrackList} />
}
