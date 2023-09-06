"use client"
import { useEffect, useState } from 'react';
import * as S from './style';
import axios from 'axios';

const url = 'https://api.spotify.com/v1';

export default function PlaylistAtom({ img, title, artist, playingtime, playtime }) {
  // const [artist, setArtist] = useState('');
  // const getArtistInfos = async e => {
  //   await axios.get(`${url}/artists/${artistid}`, { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } }).then(e => {
  //     console.log(e.data);
  //   }).catch(e => {
  //     console.log(e);
  //   })
  // }
  // useEffect(e => {
  //   getArtistInfos();
  // })
  return <S.PlayAtom>
    <img src={img} alt="alt" />
    <div className="title">{title}</div>
    <div className="artist">{artist}</div>
    <div className="playingtime">{playingtime}</div>~
    <div className="playtime">{playtime}</div>
  </S.PlayAtom>;
}