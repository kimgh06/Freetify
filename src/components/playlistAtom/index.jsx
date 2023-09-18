"use client"
import axios from 'axios';
import * as S from './style';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
// const url = 'https://open.spotify.com';
const url = 'https://api.spotify.com/v1';
const proxy = 'https://cors-proxy.fringe.zone';

export default function PlaylistAtom({ preview, img, title, artist, id, type, playingtime, artistId, isInPlay, album }) {
  const [toggle, setToggle] = useState(isInPlay);
  const [audio, setAudio] = useState(new Audio(preview));
  const [play, setPlay] = useState(false);
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
  // const getPreview = async e => {
  //   await axios.get(preview).then(e => {
  //     const source = e.data;
  //     console.log(blob)
  //   }).catch(e => {
  //     console.log(e);
  //   });
  // }
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
  useEffect(e => {
    if (play) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [play]);
  return <S.PlayAtom>
    <img src={img} alt="alt" onClick={e => {
      // console.log(id, type);
      getMusicData();
    }} />
    <div>
      <div className="title" onClick={e => {
        if (location.href.split('/')[3] === 'search') {
          location.href = `/album/${album.id}`
        }
      }
      }>{title}</div>&nbsp;
      <div className="artist" onClick={e => {
        console.log(artistId);
        location.href = `/artist/${artistId}`;
      }}>{artist}</div>
    </div>
    {playingtime && <div className="playingtime">{`${(playingtime - playingtime % 60000) / 60000}:${((playingtime % 60000 - (playingtime % 60000) % 1000) / 1000).toString().padStart(2, '0')}`}</div>}
    {type === "track" && <div className='isInPlay' onClick={listcontrol}>{toggle ? '-' : '+'}</div>}
    {preview && <div className='audio'>
      <button onClick={e => setPlay(a => !a)}>{play ? '⏸' : '▶'}</button>
    </div>}
  </S.PlayAtom>;
}