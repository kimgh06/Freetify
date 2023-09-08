"use client"
import axios from 'axios';
import * as S from './style';
import { useState } from 'react';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
// const url = 'https://open.spotify.com';
const url = 'https://api.spotify.com/v1';
const proxy = 'https://cors-proxy.fringe.zone';

export default function PlaylistAtom({ img, title, artist, id, type, playingtime, playtime, artistId, isInPlay }) {
  const [toggle, setToggle] = useState(isInPlay);
  const getMusicData = async e => {
    // await axios.get(`${backendUrl}/geturl?url=${url}/${type}/${id}&authorization=${`Bearer ${localStorage.getItem('access')}`}`).then(e => {
    //   console.log(e.data);
    // }).catch(e => {
    //   console.log(e);
    // });
    // await axios.get(`${proxy}/${url}/${type}/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } }).then(e => {
    //   console.log(e.data);
    // }).catch(e => {
    //   console.log(e);
    // })
    await axios.get(`${url}/audio-analysis/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } }).then(e => {
      console.log(e.data);
    }).catch(e => {
      console.log(e);
    });
  }
  const listcontrol = e => {
    if (type === 'track') {
      let list = [];
      list = JSON.parse(localStorage.getItem('list'));
      if (list === null) {
        list = [];
      }
      if (!toggle) {
        list.push(id);
      } else if (toggle) {
        list = list.filter(track => track !== id);
      }
      console.log(list);
      localStorage.setItem('list', JSON.stringify(list));
      setToggle(a => !a);
    }
  }
  return <S.PlayAtom>
    <img src={img} alt="alt" onClick={e => {
      // console.log(id, type);
      getMusicData();
    }} />
    <div>
      <div className="title" onClick={e => {
        console.log(id, type);
      }}>{title}</div>&nbsp;
      <div className="artist" onClick={e => {
        console.log(artistId)
      }}>{artist}</div>
    </div>
    <div className="playingtime">{playingtime}</div>
    <div className="playtime">{playtime}</div>
    {type === "track" && <div className='isInPlay' onClick={e => { listcontrol() }}>{toggle ? '-' : '+'}</div>}
  </S.PlayAtom>;
}