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
  const getMusicUrl = async (artist, title, album) => {
    await axios.get(`/api/get_video?q=${album}+${title}+${artist}+topic`, {
      responseType: 'blob',
      signal: Axios_controler.signal
    }).then(e => {
      const url = URL.createObjectURL(e.data);
      let cached_url = JSON.parse(localStorage.getItem('cached_url'));
      cached_url[`${album}+${title}+${artist}`] = url;
      localStorage.setItem('cached_url', JSON.stringify(cached_url));
    }).catch(e => {
      console.log(e.message, title);
    })
    // Axios_controler.abort();
  }
  const getTrackinfos = async id => {
    return await axios.get(`https://api.spotify.com/v1/tracks/${id}`, { headers: { Authorization: `Bearer ${access}` } }).then(async e => {
      return e.data;
    }).catch(e => {
      console.log(e);
    });
  }
  const NextTrack = e => {
    const list = localStorage.getItem("TrackList").split(',');
    if (list) {
      const index = list.findIndex(e => e === id);
      if (list[index + 1]) {
        setId(list[index + 1]);
      }
    }
  }
  const PreviousTrack = e => {
    const list = localStorage.getItem("TrackList").split(',');
    if (list) {
      const index = list.findIndex(e => e === id);
      if (list[index - 1]) {
        setId(list[index - 1]);
      }
    }
  }
  const getCurrentMusicURL = async e => {
    try {
      const music_data = await getTrackinfos(id);
      setInfo(music_data);
      setDurationT(music_data.duration_ms)

      let cached_url = JSON.parse(localStorage.getItem('cached_url'));
      const url = cached_url[`${music_data.album.name}+${music_data?.name}+${music_data?.artists[0]?.name}`];
      audio.current.src = null;
      if (url) {
        audio.current.src = url
        console.log('exists')
      } else {
        await getMusicUrl(music_data?.artists[0]?.name, music_data?.name, music_data?.album.name).then(() => {
          let cached_url = JSON.parse(localStorage.getItem('cached_url'));
          let new_src = cached_url[`${music_data?.album.name}+${music_data?.name}+${music_data?.artists[0]?.name}`]
          audio.current.src = new_src;
          setPlay(false);
          setSrc(new_src);
        });
      }

      let list = localStorage.getItem("TrackList")?.split(',');
      if (list) {
        const index = list.findIndex(e => e === id);
        if (index >= 0) {
          if (index < list.length) {
            const next_data = await getTrackinfos(list[index + 1]);
            let cached_url = JSON.parse(localStorage.getItem('cached_url'));
            const url = cached_url[`${next_data.album.name}+${next_data?.name}+${next_data?.artists[0]?.name}`];
            if (!url) {
              getMusicUrl(next_data?.artists[0]?.name, next_data?.name, next_data?.album.name);
              console.log(next_data)
            }
          }
          localStorage.setItem('now_index_in_tracks', index);
        } else {
          localStorage.setItem('now_index_in_tracks', 0);
        }
      }
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(e => {
    if (id) {
      setPlay(false)
      localStorage.setItem('now_playing_id', id);
      getCurrentMusicURL();
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
  }, [play, audio]);
  useEffect(e => {
    if (typeof window !== undefined) {
      setInnerWidth(window.innerWidth);
      setExtenstionMode(e => window.innerWidth >= 1200 ? true : false);
      localStorage.setItem("cached_url", JSON.stringify({}));
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
        if (innerWidth < 1200) {
          const percent = (e.clientX - 10) / (innerWidth - one_vw);
          audio.current.currentTime = Math.floor(percent * durationT) / 1000;
        }
        else if (innerWidth >= 1200) {
          if (extensionMode) {
            const start_point = (318 + (one_vw * 30 - 300) / 2) - (innerWidth - e.clientX);
            const percent = start_point / 300;
            audio.current.currentTime = Math.floor(percent * durationT) / 1000;
          }
        }
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
          }}>{'>'}</button>
        </S.Main_smaller>)
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
      <div className='bar_div'
        onMouseDown={e => { e.preventDefault(); setModify(true); }}
      >
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
      const { currentTime, duration } = audio.current;
      setCurrentT(currentTime * 1000);
      if (audio.current && durationT / 1000 - currentTime <= 0) {
        NextTrack();
      }
    }} onLoadedData={e => setPlay(true)} onEnded={e => NextTrack()}
      onPause={e => setPlay(false)} onPlay={e => setPlay(true)} />
  </S.Player >;
}

