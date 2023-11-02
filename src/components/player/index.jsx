"use client";
import { useEffect, useRef, useState } from 'react';
import * as S from './style';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { AccessToken, AudioSrc, NowPlayingId } from '@/app/recoilStates';
import Link from 'next/link';

export default function Player() {
  const audio = useRef(null);
  const [id, setId] = useRecoilState(NowPlayingId);
  const [modify, setModify] = useState(false);
  const [src, setSrc] = useRecoilState(AudioSrc);
  const [info, setInfo] = useState({});
  const [play, setPlay] = useState(false);
  const [currentT, setCurrentT] = useState(0);
  const [durationT, setDurationT] = useState(`0:00`);
  const [volume, setVolume] = useState(0.7);
  const [access, setAccess] = useRecoilState(AccessToken);
  const [extensionMode, setExtenstionMode] = useState(false);
  const [innerWidth, setInnerWidth] = useState(null);
  const Axios_controler = new AbortController();

  const getMusicUrl = async (the_id, artist, title, album) => {
    await axios.get(`/api/get_video?q=${album}+${title}+${artist}+topic`, {
      responseType: 'blob',
      signal: Axios_controler.signal
    }).then(e => {
      const url = URL.createObjectURL(e.data);
      audio.current.src = url;
      setSrc(url);
    }).catch(e => {
      console.log(e);
    })
  }
  const getTrackinfos = async id => {
    await axios.get(`https://api.spotify.com/v1/tracks/${id}`, { headers: { Authorization: `Bearer ${access}` } }).then(e => {
      setInfo(e.data);
      console.log(e.data)
      const d = e.data.duration_ms;
      setDurationT(d);
      getMusicUrl(id, e.data?.artists[0]?.name, e.data?.name, e.data.album.name);
    }).catch(e => {
      console.log(e);
    });
  }
  const NextTrack = e => {
    setPlay(false);
    const list = localStorage.getItem("TrackList").split(',');
    if (list) {
      const index = list.findIndex(e => e === id);
      audio.current.src = null;
      if (list[index + 1]) {
        setId(list[index + 1]);
      }
    }
  }
  const PreviousTrack = e => {
    setPlay(false);
    const list = localStorage.getItem("TrackList").split(',');
    if (list) {
      const index = list.findIndex(e => e === id);
      audio.current.src = null;
      if (list[index - 1]) {
        setId(list[index - 1]);
      }
    }
  }
  useEffect(e => {
    if (id) {
      setPlay(false);
      localStorage.setItem('now_playing_id', id);
      getTrackinfos(id);
      let list = localStorage.getItem("TrackList")?.split(',');
      if (list) {
        const index = list.findIndex(e => e === id);
        if (index >= 0) {
          console.log(index)
          localStorage.setItem('now_index_in_tracks', index);
        } else {
          setId(null);
        }
      }
    } else {
      setId(localStorage.getItem('now_playing_id'));
    }
  }, [id, access]);
  useEffect(e => {
    if (audio.current.src) {
      if (play) {
        let promise = audio.current.play();
        promise.catch(err => { console.log(err); setPlay(false) });
      } else {
        audio.current.pause();
      }
    } else {
      audio.current.src = src;
    }
  }, [play]);
  useEffect(e => {
    if (typeof window !== undefined) {
      setInnerWidth(window.innerWidth);
      setExtenstionMode(e => window.innerWidth >= 1200 ? true : false);
      window.addEventListener('resize', e => {
        setInnerWidth(window.innerWidth);
      })
    }
  }, []);
  useEffect(e => {
    audio.current.volume = volume;
  }, [id, volume]);
  return <S.Player style={{ width: `${(innerWidth >= 1200 && !extensionMode) ? '100px' : innerWidth < 1200 ? '98vw' : '30vw'}` }}>
    <div className='audio' onMouseUp={e => {
      setModify(false);
    }} onMouseMove={e => {
      if (modify) {
        const one_vw = innerWidth / 100;
        console.log(e.clientX, one_vw);
      }
    }}>
      {innerWidth >= 1200 && <div className='extention' style={{ right: `${!extensionMode ? '75px' : '28vw'}` }} onClick={e => setExtenstionMode(a => !a)}>
        <div className='___' />
        <div className='___' />
        <div className='___' />
      </div>}
      <div className='head'>
        {innerWidth >= 1200 ? (extensionMode ? <>
          <div className='main_original'>
            <img src={info?.album?.images[1]?.url} />
            <div>
              <Link href={`/album/${info?.album?.id} `}>
                <h2>{info?.name}</h2>
              </Link>
              <Link href={`/artist/${info?.artists && info?.artists[0]?.id} `}>{info?.artists && info?.artists[0]?.name}</Link>
            </div>
            <div className='playbutton'>
              <button className='left' onClick={e => {
                PreviousTrack();
              }}>{'<'}</button>
              <button className='play' style={{ transform: `rotate(${play ? - 270 : 0}deg)` }} onClick={e => setPlay(a => !a)}>{play ? '=' : '▶'}</button>
              <button className='right' onClick={e => {
                NextTrack();
              }}>{'>'}</button>
            </div>
          </div>
        </> : <S.Main_smaller>
          <button className='play' style={{ transform: `rotate(${play ? - 270 : 0}deg)` }} onClick={e => setPlay(a => !a)}>{play ? '=' : '▶'}</button>
          <button className='left' onClick={e => {
            PreviousTrack();
          }}>{'<'}</button>
          <button className='right' onClick={e => {
            NextTrack();
          }}>{'>'}</button></S.Main_smaller>)
          : (!extensionMode ? <>
            <div className='extenstion' onClick={e => setExtenstionMode(true)}>
              <div className='___' />
              <div className='___' />
              <div className='___' />
            </div>
            <div className='content'>
              <img src={info?.album?.images[2]?.url} />
              <div className='between'>
                <div className='title' href={`/album/${info?.album?.id} `}>{info?.name}</div><br />
                <div href={`/artist/${info?.artists && info?.artists[0]?.id} `}>{info?.artists && info?.artists[0]?.name}</div>
              </div>
              <button className='play' style={{ transform: `rotate(${play ? - 270 : 0}deg)` }} onClick={e => setPlay(a => !a)}>{play ? '=' : '▶'}</button>
            </div>
          </> : <S.ExtensionMode_mobile>
            <div className='extenstion' onClick={e => setExtenstionMode(false)}>
              <div className='___' />
              <div className='___' />
              <div className='___' />
            </div>
            <div className='contents'>
              <img src={info?.album?.images[1]?.url} />
              <div className='texts'>
                <div className='links'>
                  <Link href={`/album/${info?.album?.id} `}>
                    <h2>{info?.name}</h2>
                  </Link>
                  <Link href={`/artist/${info?.artists && info?.artists[0]?.id} `}>{info?.artists && info?.artists[0]?.name}</Link>
                </div>
                <div className='playbutton'>
                  <button className='left' onClick={e => {
                    PreviousTrack();
                  }}>{'<'}</button>
                  <button className='play' style={{ transform: `rotate(${play ? - 270 : 0}deg)` }} onClick={e => setPlay(a => !a)}>{play ? '=' : '▶'}</button>
                  <button className='right' onClick={e => {
                    NextTrack();
                  }}>{'>'}</button>
                </div>
              </div>
            </div>
          </S.ExtensionMode_mobile>)
        }
      </div>
      <div className='bar_div' onMouseDown={e => { e.preventDefault(); setModify(true); }}>
        <div className='bar' style={{ width: `${currentT / durationT * 100}%` }} />
        <div className='bar_cursor' />
      </div>
      {!(innerWidth >= 1200 && !extensionMode) && `${(currentT - currentT % 60000) / 60000}:${((currentT % 60000 - (currentT % 60000) % 1000) / 1000).toString().padStart(2, '0')} / ${(durationT - durationT % 60000) / 60000}:${((durationT % 60000 - (durationT % 60000) % 1000) / 1000).toString().padStart(2, '0')}`}
      {!(innerWidth >= 1200 && !extensionMode) ? <div className='volume'>
        <button onClick={e => setVolume(a => (a * 100 - 10) / 100 < 0.1 ? a : (a * 100 - 10) / 100)}>-</button>
        <span>{volume * 100}%</span>
        <button onClick={e => setVolume(a => (a * 100 + 10) / 100 > 1 ? a : (a * 100 + 10) / 100)}>+</button>
      </div> : <S.Main_smaller>
        <button onClick={e => setVolume(a => (a * 100 + 10) / 100 > 1 ? a : (a * 100 + 10) / 100)}>+</button>
        <span>{volume * 100}%</span>
        <button onClick={e => setVolume(a => (a * 100 - 10) / 100 < 0.1 ? a : (a * 100 - 10) / 100)}>-</button>
        <div className='title'>{info?.name}</div>
      </S.Main_smaller>}
    </div>
    <audio ref={audio} onTimeUpdate={e => {
      // audio.current.currentTime = 50
      const { currentTime, duration } = audio.current;
      setCurrentT(currentTime * 1000);
      if (audio.current && durationT / 1000 - currentTime <= 0) {
        NextTrack();
      }
    }} onLoadedData={e => {
      setPlay(true);
    }} onEnded={e => {
      NextTrack();
    }} />
  </S.Player >;
}

