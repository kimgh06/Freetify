"use client";
import { useEffect, useState } from 'react';
import * as S from './style';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { NowPlayingId, PlayingAudio } from '@/app/recoilStates';
import Link from 'next/link';

export default function Player() {
  const [audio, setAudio] = useRecoilState(PlayingAudio);
  const [id, setId] = useRecoilState(NowPlayingId);
  const [info, setInfo] = useState({});
  const [play, setPlay] = useState(false);
  const [currentT, setCurrentT] = useState(0);
  const [durationT, setDurationT] = useState(`0:00`);
  const [volume, setVolume] = useState(0.7);

  const getMusicUrl = async id => {
    await axios.get(`https://api.spotifydown.com/download/${id}`).then(e => {
      const newAudio = new Audio(`https://cors.spotifydown.com/${e.data.link}`);
      setAudio(newAudio);
      newAudio.onload = e => {
        setPlay(true);
      }
    }).catch(e => {
      console.log(e);
    })
  }
  audio.addEventListener('timeupdate', e => {
    audio.volume = volume;
    const { currentTime, duration } = audio;
    setCurrentT(currentTime * 1000);
    console.log(currentT / durationT)
    if (duration - currentTime <= 0) {
      audio.currentTime = 0
      setCurrentT(0);
      const index = parseInt(localStorage.getItem('now_index_in_tracks'));
      let list = localStorage.getItem("TrackList");
      list = list.split(',');
      if (list[index + 1]) {
        setId(list[index + 1]);
        localStorage.setItem('now_index_in_tracks', index + 1);
      }
    }
  });
  const getTrackinfos = async id => {
    await axios.get(`https://api.spotify.com/v1/tracks/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } }).then(e => {
      console.log(e.data);
      setInfo(e.data);
      const d = e.data.duration_ms
      setDurationT(d);
    }).catch(e => {
      console.log(e);
    });
  }
  audio.onloadeddata = e => {
    setPlay(true);
  }
  useEffect(e => {
    audio.currentTime = 0
    setCurrentT(0);
    setPlay(false);
    if (id) {
      getMusicUrl(id);
      getTrackinfos(id);
      let list = localStorage.getItem("TrackList");
      const index = parseInt(localStorage.getItem('now_index_in_tracks'));
      list = list.split(',');
      console.log(`${list[index - 1] ? `past: ${list[index + 1]}\n` : ''}now: ${id}${list[index + 1] ? `\nxnext: ${list[index + 1]}` : ''} `);
      localStorage.setItem('now_playing_id', id);
    } else {
      setId(localStorage.getItem('now_playing_id'));
    }
  }, [id]);
  useEffect(e => {
    if (play) {
      let promise = audio.play();
      promise.catch(err => setPlay(false));
    } else {
      audio.pause();
    }
  }, [play]);
  return <S.Player>
    <div className='audio'>
      <div className='head'>
        {window.innerWidth >= 1000 ?
          <>
            <img src={info?.album?.images[1]?.url} />
            <div>
              <Link href={`/ album / ${info?.album?.id} `}>
                <h2>{info?.name}</h2>
              </Link>
              <Link href={`/ artist / ${info?.artists && info?.artists[0]?.id} `}>{info?.artists && info?.artists[0]?.name}</Link>
            </div>
            <div className='playbutton'>
              <button style={{ transform: `rotate(${play ? - 270 : 0}deg)` }} onClick={e => setPlay(a => !a)}>{play ? '=' : '▶'}</button>
            </div>
          </>
          : <>
            <img src={info?.album?.images[2]?.url} />
            <div>
              <div href={`/ album / ${info?.album?.id} `}>{info?.name}</div><br />
              <div href={`/ artist / ${info?.artists && info?.artists[0]?.id} `}>{info?.artists && info?.artists[0]?.name}</div>
            </div>
            <button style={{ transform: `rotate(${play ? - 270 : 0}deg)` }} onClick={e => setPlay(a => !a)}>{play ? '=' : '▶'}</button>
          </>
        }
      </div>
      <div className='bar' style={{ width: window.innerWidth >= 1000 ? `${currentT / durationT * 300}px` : `${currentT / durationT * 95}vw` }} />
      {`${(currentT - currentT % 60000) / 60000}:${((currentT % 60000 - (currentT % 60000) % 1000) / 1000).toString().padStart(2, '0')} / ${(durationT - durationT % 60000) / 60000}:${((durationT % 60000 - (durationT % 60000) % 1000) / 1000).toString().padStart(2, '0')}`}
      {
        window.innerWidth >= 1000 && <div className='volume'>
          <button onClick={e => setVolume(a => (a * 100 - 10) / 100 < 0.1 ? a : (a * 100 - 10) / 100)}>-</button>
          <span>{volume * 100}%</span>
          <button onClick={e => setVolume(a => (a * 100 + 10) / 100 > 1 ? a : (a * 100 + 10) / 100)}>+</button>
        </div>
      }
    </div >
  </S.Player >;
}

