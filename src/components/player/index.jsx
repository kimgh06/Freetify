"use client";
import { useEffect, useState } from 'react';
import * as S from './style';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { NowPlayingId } from '@/app/recoilStates';

export default function Player() {
  const [audio, setAudio] = useState(new Audio());
  const [id, setId] = useState(localStorage.getItem('now_playing_id'));
  const [play, setPlay] = useState(false);
  const [now_playing_id, setNow_playing_id] = useRecoilState(NowPlayingId);
  const [currentT, setCurrentT] = useState(0);
  const [durationT, setDurationT] = useState(`0:00`);
  const [first, setFirst] = useState(false);

  const getMusicUrl = async id => {
    await axios.get(`https://api.spotifydown.com/download/${id}`).then(e => {
      setAudio(new Audio(`https://cors.spotifydown.com/${e.data.link}`));
    }).catch(e => {
      console.log(e);
    })
  }
  audio.onloadeddata = e => {
    if (first) {
      setPlay(true);
    } else {
      setFirst(true);
    }
  }
  useEffect(e => {
    if (id) {
      audio.pause();
      setPlay(false);
    }
    getMusicUrl(id);
  }, [id]);
  useEffect(e => {
    if (now_playing_id === '') {
      setNow_playing_id(localStorage.getItem('now_playing_id'));
      setId(localStorage.getItem('now_playing_id'));
    } else {
      audio.pause();
      setPlay(false);
      setId(now_playing_id);
      localStorage.setItem('now_playing_id', now_playing_id);
    }
    console.log("now playing id:", now_playing_id);
  }, [now_playing_id]);
  audio.addEventListener('timeupdate', e => {
    const { currentTime, duration } = audio;
    setCurrentT(`${(currentTime - currentTime % 60) / 60}:${((currentTime % 60 - (currentTime % 60) % 1) / 1).toString().padStart(2, '0')}`);
    setDurationT(`${(duration - duration % 60) / 60}:${((duration % 60 - (duration % 60) % 1) / 1).toString().padStart(2, '0')}`);
    if (duration - currentTime === 0) {
      setPlay(false);
      setCurrentT('0:00');

    }
  });
  useEffect(e => {
    audio.volume = 0.5;
    if (play) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [play]);
  return <S.Player>
    <div className='audio'>
      <button style={{ transform: `rotate(${play ? -270 : 0}deg)` }} onClick={e => setPlay(a => !a)}>{play ? '=' : '▶'}</button>
      <div className='bar' style={{ width: `${audio.currentTime / audio.duration * (window.innerWidth >= 1000 ? 28 : 95)}vw` }} />
      {`${currentT} / ${durationT}`}
    </div>
  </S.Player>;
}

