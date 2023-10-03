"use client";
import { useEffect, useRef, useState } from 'react';
import * as S from './style';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { AudioSrc, NowPlayingId, PlayingAudio } from '@/app/recoilStates';
import Link from 'next/link';

export default function Player() {
  // const [audio, setAudio] = useRecoilState(PlayingAudio);
  const audio = useRef(null);
  const [id, setId] = useRecoilState(NowPlayingId);
  const [src, setSrc] = useRecoilState(AudioSrc);
  const [info, setInfo] = useState({});
  const [play, setPlay] = useState(false);
  const [currentT, setCurrentT] = useState(0);
  const [durationT, setDurationT] = useState(`0:00`);
  const [volume, setVolume] = useState(0.7);

  const [extensionMode, setExtenstionMode] = useState(false);
  const [innerWidth, setInnerWidth] = useState(null);

  const getMusicUrl = async the_id => {
    await axios.get(`https://api.spotifydown.com/download/${the_id}`).then(e => {
      // const newAudio = new Audio(`https://cors.spotifydown.com/${e.data.link}`);
      audio.current.src = `https://cors.spotifydown.com/${e.data.link}`;
      localStorage.setItem('audio_src', `https://cors.spotifydown.com/${e.data.link}`);
      setSrc(`https://cors.spotifydown.com/${e.data.link}`);
      audio.current.onloadeddata = e => {
        setPlay(true);
      }
    }).catch(e => {
      console.log(e);
    })
  }
  audio.current?.src && audio.current.addEventListener('timeupdate', e => {
    if (audio.current.volume) {
      audio.current.volume = volume;
    }
    const { currentTime, duration } = audio.current;
    setCurrentT(currentTime * 1000);
    if (duration - currentTime <= 0) {
      setPlay(false);
      const index = parseInt(localStorage.getItem('now_index_in_tracks'));
      let list = localStorage.getItem("TrackList");
      if (list) {
        audio.current.src = null;
        list = list.split(',');
        if (list[index + 1]) {
          setId(list[index + 1]);
          localStorage.setItem('now_index_in_tracks', index + 1);
        }
      }
    }
  }, false);
  const getTrackinfos = async id => {
    await axios.get(`https://api.spotify.com/v1/tracks/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } }).then(e => {
      console.log(e.data);
      setInfo(e.data);
      const d = e.data.duration_ms;
      setDurationT(d);
    }).catch(e => {
      console.log(e);
    });
  }
  useEffect(e => {
    if (id) {
      getMusicUrl(id);
      setPlay(false)
      localStorage.setItem('now_playing_id', id);
      let list = localStorage.getItem("TrackList")?.split(',');
      if (list) {
        const index = parseInt(localStorage.getItem('now_index_in_tracks'));
        console.log(`${list[index - 1] ? `past: ${list[index + 1]}\n` : ''}now: ${id}${list[index + 1] ? `\nxnext: ${list[index + 1]}` : ''} `);
      }
      getTrackinfos(id);
    } else {
      setId(localStorage.getItem('now_playing_id'));
    }
  }, [id]);
  useEffect(e => {
    console.log(play, audio?.current?.src?.substring(audio.current.src.length - 8), src.substring(src.length - 8));
    if (audio.current.src) {
      if (play) {
        let promise = audio.current.play();
        promise.catch(err => setPlay(false));
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
      window.addEventListener('resize', e => {
        setInnerWidth(window.innerWidth);
      })
    }
  }, []);
  return <S.Player>
    <div className='audio'>
      <div className='head'>
        {innerWidth >= 1000 ? <>
          <img src={info?.album?.images[1]?.url} />
          <div>
            <Link href={`/album/${info?.album?.id} `}>
              <h2>{info?.name}</h2>
            </Link>
            <Link href={`/artist/${info?.artists && info?.artists[0]?.id} `}>{info?.artists && info?.artists[0]?.name}</Link>
          </div>
          <div className='playbutton'>
            <button className='left' onClick={e => {
              let list = localStorage.getItem("TrackList");
              const index = parseInt(localStorage.getItem('now_index_in_tracks'));
              list = list.split(',');
              if (list[index - 1]) {
                setId(list[index - 1]);
                localStorage.setItem('now_index_in_tracks', index - 1);
              }
            }}>{'<'}</button>
            <button className='play' style={{ transform: `rotate(${play ? - 270 : 0}deg)` }} onClick={e => setPlay(a => !a)}>{play ? '=' : '▶'}</button>
            <button className='right' onClick={e => {
              let list = localStorage.getItem("TrackList");
              const index = parseInt(localStorage.getItem('now_index_in_tracks'));
              list = list.split(',');
              if (list[index + 1]) {
                setId(list[index + 1]);
                localStorage.setItem('now_index_in_tracks', index + 1);
              }
            }}>{'>'}</button>
          </div>
        </>
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
                    let list = localStorage.getItem("TrackList");
                    const index = parseInt(localStorage.getItem('now_index_in_tracks'));
                    list = list.split(',');
                    if (list[index - 1]) {
                      setId(list[index - 1]);
                      localStorage.setItem('now_index_in_tracks', index - 1);
                    }
                  }}>{'<'}</button>
                  <button className='play' style={{ transform: `rotate(${play ? - 270 : 0}deg)` }} onClick={e => setPlay(a => !a)}>{play ? '=' : '▶'}</button>
                  <button className='right' onClick={e => {
                    let list = localStorage.getItem("TrackList");
                    const index = parseInt(localStorage.getItem('now_index_in_tracks'));
                    list = list.split(',');
                    if (list[index + 1]) {
                      setId(list[index + 1]);
                      localStorage.setItem('now_index_in_tracks', index + 1);
                    }
                  }}>{'>'}</button>
                </div>
              </div>
            </div>
          </S.ExtensionMode_mobile>)
        }
      </div>
      <div className='bar_div'>
        <div className='bar' style={{ width: innerWidth >= 1000 ? `${currentT / durationT * 300}px` : `${currentT / durationT * 93}vw` }} />
      </div>
      {`${(currentT - currentT % 60000) / 60000}:${((currentT % 60000 - (currentT % 60000) % 1000) / 1000).toString().padStart(2, '0')} / ${(durationT - durationT % 60000) / 60000}:${((durationT % 60000 - (durationT % 60000) % 1000) / 1000).toString().padStart(2, '0')}`}
      {(innerWidth >= 1000 || extensionMode) && <div className='volume'>
        <button onClick={e => setVolume(a => (a * 100 - 10) / 100 < 0.1 ? a : (a * 100 - 10) / 100)}>-</button>
        <span>{volume * 100}%</span>
        <button onClick={e => setVolume(a => (a * 100 + 10) / 100 > 1 ? a : (a * 100 + 10) / 100)}>+</button>
      </div>}
    </div>
    <audio ref={audio} />
  </S.Player >;
}

