"use client"
import axios from 'axios';
import * as S from './style';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRecoilState } from 'recoil';
import { NowPlayingId } from '@/app/recoilStates';

const url = 'https://api.spotify.com/v1';

export default function PlaylistAtom({ index, img, title, artist, id, type, playingtime, artistId, isInPlay, album }) {
  const [toggle, setToggle] = useState(isInPlay);
  const [now_playing_id, setNow_playing_id] = useRecoilState(NowPlayingId);
  const [durationT, setDurationT] = useState(`${(playingtime - playingtime % 60000) / 60000}:${((playingtime % 60000 - (playingtime % 60000) % 1000) / 1000).toString().padStart(2, '0')}`);
  const getMusicAnalsisData = async e => {
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
  useEffect(e => {
    if (id && type === 'track') {
      setDurationT(`${(playingtime - playingtime % 60000) / 60000}:${((playingtime % 60000 - (playingtime % 60000) % 1000) / 1000).toString().padStart(2, '0')}`);

    }
  }, [id]);
  return <S.PlayAtom>
    <img src={img} alt="" onClick={e => {
      // console.log(id, type);
      getMusicAnalsisData();
    }} />
    <div>
      <div className='hea'>
        <Link className="title" href={album ? `/album/${album?.id}` : '#'} >{title}</Link>&nbsp;
        {playingtime && <div className="playingtime">{durationT}</div>}
        {type === "track" && <div className='isInPlay' onClick={listcontrol}>{toggle ? '-' : '+'}</div>}
      </div>
      <div className='foo'>
        <Link className="artist" href={`/artist/${artistId}`}>{artist[0].name}{type === 'track' && artist.length > 1 && `+${artist.length - 1}`}</Link>
        {type === 'track' && <div className='audio'>
          <button onClick={e => {
            setNow_playing_id(id);
            localStorage.setItem('now_index_in_tracks', index);
          }}>{now_playing_id === id ? '⏸' : '▶'}</button>
        </div>}
      </div>
    </div>
  </S.PlayAtom>;
}
