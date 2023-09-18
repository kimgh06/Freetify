"use client"
import Navi from '@/components/nav';
import * as S from './style';
import axios from "axios";
import { useEffect, useState } from "react"

export default function asdf({ params }) {
  const id = params.id[0];
  const url = 'https://api.spotify.com/v1';
  const [albumInfo, setAlbumInfo] = useState(null);
  const getAlbumInfos = async e => {
    await axios.get(`${url}/albums/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("access")}` } })
      .then(e => {
        console.log(e.data);
        setAlbumInfo(e.data);
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
            {albumInfo?.artists.map((i, n) => <a key={n} href={`/artist/${i?.id}`}>{i.name}</a>)}
            <span>{albumInfo?.tracks.items.length}곡</span>
          </div>
        </div>
      </div>
    </S.AlbumInfos> :
      <h1>Loading...</h1>}
  </>;
}