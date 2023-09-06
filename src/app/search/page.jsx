'use client';
import Navi from "@/components/nav";
import * as S from './style';
import PlaylistAtom from "@/components/playlistAtom";
import axios from "axios";
import { useState } from "react";

const url = 'https://api.spotify.com/v1';

export default function asdf() {
  const [q, setQ] = useState('');
  const [albums, setAlbums] = useState([]);
  const [artist, setArtist] = useState([]);
  const [tracks, setTracks] = useState([]);
  const searchItems = async e => {
    await axios.get(`${url}/search?q=${q}&type=album,track,artist&limit=10`, { headers: { Authorization: "Bearer " + localStorage.getItem('access') } }).then(e => {
      const data = e.data;
      console.log(data.albums.items, data.artists.items, data.tracks.items);
      setAlbums(data.albums.items);
      setArtist(data.artists.items);
      setTracks(data.tracks.items);
    }).catch(e => {
      console.log(e);
    });
  }
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
      {albums?.length !== 0 && <>
        {albums?.map((i, n) => <PlaylistAtom key={n} img={i.images[2].url} title={i.name} artist={i?.artists[0].name} />)}
      </>}
    </S.Search>
  </>;
}