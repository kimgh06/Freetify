"use client"
import Navi from '@/components/nav';
import * as S from './style';
import axios from "axios";
import { useEffect, useState } from "react"
import Link from 'next/link';
import PlaylistAtom from '@/components/playlistAtom';

export default function asdf({ params }) {
  const id = params.id[0];
  const url = 'https://api.spotify.com/v1';
  const [albumInfo, setAlbumInfo] = useState(null);
  const [tracks, setTracks] = useState([]);
  const getAlbumInfos = async e => {
    await axios.get(`${url}/albums/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("access")}` } })
      .then(e => {
        console.log(e.data);
        setAlbumInfo(e.data);
        setTracks(e.data.tracks.items);
        document.title = e.data.name;
      }).catch(e => {
        console.log(e);
      });
  }
  useEffect(e => {
    console.log(id);
    getAlbumInfos();
  }, []);
  return <>
    <Navi />
    {albumInfo ? <S.AlbumInfos>
      <div className='header'>
        <img src={albumInfo?.images[1].url} alt='img' />
        <div className='description'>
          <h1>{albumInfo?.name}</h1>
          <div className='information'>
            {albumInfo?.artists.map((i, n) => <Link key={n} href={`/artist/${i?.id}`}>{i.name}</Link>)}
            <span>{albumInfo?.tracks.items.length}곡</span>
          </div>
        </div>
      </div>
      <div className='tracks'>
        {tracks?.map((i, n) => <PlaylistAtom preview={i?.preview_url} playingtime={i?.duration_ms} key={n} album={i?.album} img={i?.album?.images[2].url} type={i?.type}
          id={i?.id} title={i?.name} artist={i?.artists[0].name} artistId={i?.artists[0]?.id} isInPlay={e => {
            let list = [];
            list = JSON.parse(localStorage.getItem('list'));
            if (list === null) {
              list = [];
            }
            return list.find(a => a === i?.id)
          }} />)}
      </div>
    </S.AlbumInfos> :
      <h1>Loading...</h1>}
  </>;
}