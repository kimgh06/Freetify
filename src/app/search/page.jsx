'use client';
import Navi from "@/components/nav";
import * as S from './style';
import PlaylistAtom from "@/components/playlistAtom";
import axios from "axios";
import { useEffect, useState } from "react";
import AritstProfile from "@/components/artistprofile";

const url = 'https://api.spotify.com/v1';

export default function asdf() {
  const [q, setQ] = useState('');
  const [albums, setAlbums] = useState([]);
  const [artist, setArtist] = useState([]);
  const [tracks, setTracks] = useState([]);
  const searchItems = async e => {
    await axios.get(`${url}/search?q=${q}&type=album,track,artist&limit=5`, { headers: { Authorization: "Bearer " + localStorage.getItem('access') } }).then(e => {
      const data = e.data;
      let artists = data.artists.items.slice(0, 5);
      console.log("album", data.albums.items, "artists", artists, "tracks", data.tracks.items);
      document.title = q;
      setAlbums(data.albums.items);
      setTracks(data.tracks.items);
      setArtist(artists);
    }).catch(e => {
      console.log(e);
    });
  }
  useEffect(e => {
    document.title = "search";
  }, []);
  return <>
    <Navi />
    <S.Search>
      <form onSubmit={e => {
        e.preventDefault();
        setAlbums(null);
        searchItems();
      }}>
        <input onChange={e => setQ(e.target.value)} value={q} />
        <button>검색</button>
      </form>
      <div className="results">
        <div className="result">
          <p>
            Tracks
          </p>
          {tracks?.length !== 0 && tracks?.map((i, n) => <PlaylistAtom preview={i?.preview_url} playingtime={i?.duration_ms} key={n} album={i?.album} img={i.album.images[2].url} type={i?.type}
            id={i?.id} title={i?.name} artist={i?.artists[0].name} artistId={i?.artists[0].id} isInPlay={e => {
              let list = [];
              list = JSON.parse(localStorage.getItem('list'));
              if (list === null) {
                list = [];
              }
              return list.find(a => a === i?.id)
            }} />)}
        </div>
        <div className="result">
          <p>
            Albums
          </p>
          {albums?.length !== 0 && albums?.map((i, n) => <PlaylistAtom album={i} key={n} img={i?.images[2]?.url} type={i?.type}
            id={i?.id} title={i.name} artist={i?.artists[0].name} artistId={i?.artists[0].id} />)}
        </div>
        <div className="result">
          <p>artists</p>
          {artist?.length !== 0 && artist?.map((i, n) => <AritstProfile key={n} followers={i?.followers.total}
            id={i?.id} img={i?.images[2]} name={i?.name} popularity={i?.popularity} />)}
        </div>
      </div>
    </S.Search>
  </>;
}