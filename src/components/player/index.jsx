"use client";
import { useEffect, useState } from 'react';
import * as S from './style';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { NowPlayingId } from '@/app/recoilStates';
import Link from 'next/link';

export default function Player() {
  const [audio, setAudio] = useState(new Audio());
  const [now_playing_id, setNow_playing_id] = useRecoilState(NowPlayingId);
  const [id, setId] = useState(localStorage.getItem('now_playing_id'));
  const [info, setInfo] = useState({});
  const [play, setPlay] = useState(false);
  const [currentT, setCurrentT] = useState(0);
  const [durationT, setDurationT] = useState(`0:00`);
  const [first, setFirst] = useState(false);
  const [volume, setVolume] = useState(0.5);

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
    getTrackinfos();
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
    audio.volume = volume;
    const { currentTime, duration } = audio;
    setCurrentT(`${(currentTime - currentTime % 60) / 60}:${((currentTime % 60 - (currentTime % 60) % 1) / 1).toString().padStart(2, '0')}`);
    setDurationT(`${(duration - duration % 60) / 60}:${((duration % 60 - (duration % 60) % 1) / 1).toString().padStart(2, '0')}`);
    if (duration - currentTime === 0) {
      setPlay(false);
      setCurrentT('0:00');

    }
  });
  useEffect(e => {
    if (play) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [play]);
  const getTrackinfos = async e => {
    await axios.get(`https://api.spotify.com/v1/tracks/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } }).then(e => {
      // setTrack(e.data.tracks);
      console.log(e.data);
      setInfo(e.data);
    }).catch(e => {
      console.log(e);
    });
  }
  return <S.Player>
    <div className='audio'>
      <div className='head'>
        {window.innerWidth >= 1000 ?
          <>
            <img src={info?.album?.images[1]?.url} />
            <div>
              <Link href={`/album/${info?.album?.id}`}>{info?.name}</Link>
              <div>{info?.artists && info?.artists[0]?.name}</div>
            </div>
            <button style={{ transform: `rotate(${play ? -270 : 0}deg)` }} onClick={e => setPlay(a => !a)}>{play ? '=' : '▶'}</button>
          </>
          : <>
            <img src={info?.album?.images[2]?.url} />
            <div>
              <div>{info?.name}</div>
              <div>{info?.artists && info?.artists[0]?.name}</div>
            </div>
            <button style={{ transform: `rotate(${play ? -270 : 0}deg)` }} onClick={e => setPlay(a => !a)}>{play ? '=' : '▶'}</button>
          </>
        }
      </div>
      <div className='bar' style={{ width: `${audio.currentTime / audio.duration * (window.innerWidth >= 1000 ? 28 : 95)}vw` }} />
      {`${currentT} / ${durationT}`}
    </div>
  </S.Player>;
}

