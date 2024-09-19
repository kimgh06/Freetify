'use client';
import Navi from "@/components/nav";
import * as S from './style';
import PlaylistAtom from "@/components/playlistAtom";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import AritstProfile from "@/components/artistprofile";
import { RecoilRoot, useRecoilState } from "recoil";
import { AccessToken } from "../recoilStates";
import { useRouter } from "next/navigation";

const url = 'https://api.spotify.com/v1';

export default function App() {
  return <RecoilRoot>
    <InnerContent />
  </RecoilRoot>;
}

function InnerContent() {
  const [q, setQ] = useState('');
  const [albums, setAlbums] = useState([]);
  const [artist, setArtist] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [access, setAccess] = useRecoilState(AccessToken);
  const searchInput = useRef();
  const navigate = useRouter();
  const searchItems = async q => {
    await axios.get(`${url}/search?q=${q}&type=album,track,artist&limit=5`, { headers: { Authorization: "Bearer " + access } }).then(e => {
      const data = e.data;
      let artists = data.artists.items.slice(0, 5);
      console.log("album", data.albums.items, "artists", artists, "tracks", data.tracks.items);
      document.title = q;
      navigate.push(`${window.location.pathname}?q=${q}`)
      setAlbums(data.albums.items);
      setTracks(data.tracks.items);
      setArtist(artists);
    }).catch(e => {
      console.log(e);
    });
  }
  useEffect(e => {
    document.title = "search";
    const q = new URLSearchParams(window.location.search).get('q');
    searchInput.current.focus();
    console.log(q)
    if (q) {
      setQ(q);
      searchItems(q)
    }
  }, []);
  return <>
    <Navi />
    <S.Search>
      <form onSubmit={e => {
        e.preventDefault();
        searchItems(q);
      }}>
        <input ref={searchInput}
          onChange={e => setQ(e.target.value)}
          value={q} className="search"
          placeholder="Search"
        />
        <button>Search</button>
      </form>
      <main className="results">
        <div className="result">
          <p>
            Tracks
          </p>
          {tracks?.length !== 0 && tracks?.map((i, n) => <PlaylistAtom index={n} preview={i?.preview_url} playingtime={i?.duration_ms} key={n} album={i?.album} img={i.album.images[2].url} type={i?.type}
            id={i?.id} title={i?.name} artist={i?.artists} artistId={i?.artists[0].id} isInPlay={e => {
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
      </main>
    </S.Search></>
}