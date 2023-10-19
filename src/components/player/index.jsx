"use client";
import { useEffect, useRef, useState } from 'react';
import * as S from './style';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { AudioSrc, NowPlayingId, PlayingAudio } from '@/app/recoilStates';
import Link from 'next/link';
import qs from 'qs';

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

  const getMusicUrl = async (the_id) => {
    const undefinedId = 'd5b2acff5a0cde541204f0c062c924300caed77a'
    let ak, fa;
    const spclient_url = `https://gae2-spclient.spotify.com/storage-resolve/v2/files/audio/interactive/10/${undefinedId}?version=10000000&product=9&platform=39&alt=json`
    const seektable_url = `https://seektables.scdn.co/seektable/${undefinedId}.json`;
    const Bearer = `BQAgStpjcpKjry0JJLonfOQ6zVszHuGXGcU6Ts7CbaZ91JBNqvGwUbq1tRB_IF5FQ5M5oDyBNQ0oyT6-oVAFb4zwn90th3eHG8_ZzAGa4VED14u6YtHI33CyDojLSmbOWW47Iq7IObl5MHMe7_0V3WE_sH8sfKOT54Rd5ZWh_Zr6qHJ-0eMgsvtalnpirjWvDM4nj9q7XRn0obOFfipJsa31RBsmn4TcS9l19QEuN_tnf5QeeSuEsaVqU04C2Hav9KTYgw4NFlP3RrphSUNHm5etO6Cl1O317ppge7c5dErSbI2XUAjoWEj73L_GZNhvUpguNFPgPibLqgPlPU3b52CM4iLa`;

    let blobs = [];
    let data_sets = [];
    let seektable, spclient;
    await axios.get(seektable_url).then(e => {
      seektable = e.data;
      console.log(seektable);
      let sum = seektable.offset - 1;
      data_sets.push([0, sum]);
      for (let i = 0; i < seektable.segments.length; i++) {
        data_sets.push([sum + 1, sum + seektable.segments[i][0]]);
        sum += seektable.segments[i][0];
      }
    }).catch(e => {
      console.log(e)
    })
    await axios.get(spclient_url, { headers: { 'Authorization': `Bearer ${Bearer}` } }).then(async e => {
      spclient = e.data;
      ak = spclient.cdnurl[0]; fa = spclient.cdnurl[1];
      console.log(spclient, data_sets);
      // for (let i = 0; i < data_sets.length; i++) {
      await axios.get(ak/*, { headers: { 'Range': `bytes=${data_sets[i][0]}-${data_sets[i][1]}` } }*/).then(e => {
        const byteNumbers = new Array(e.data.length);
        for (let i = 0; i < e.data.length; i++) {
          byteNumbers[i] = e.data.charCodeAt(i);
        }
        blobs.push(new Blob([new Uint8Array(byteNumbers)], { type: 'application/aac' }))
      }).catch(e => {
        console.log(e);
      })
      // }
      audio.current.src = URL.createObjectURL(blobs[0]);
      console.log(blobs[0], audio.current.src);
    }).catch(e => {
      console.log(e)
    })
    audio.current.onloadeddata = e => {
      console.log(audio)
      setPlay(true);
    }
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
  return <S.Player style={{ width: `${(innerWidth >= 1200 && !extensionMode) ? '100px' : innerWidth < 1200 ? '98vw' : '30vw'}` }}>
    <div className='audio'>
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
        </> : <S.Main_smaller>
          <button className='play' style={{ transform: `rotate(${play ? - 270 : 0}deg)` }} onClick={e => setPlay(a => !a)}>{play ? '=' : '▶'}</button>
          <button className='left' onClick={e => {
            let list = localStorage.getItem("TrackList");
            const index = parseInt(localStorage.getItem('now_index_in_tracks'));
            list = list.split(',');
            if (list[index - 1]) {
              setId(list[index - 1]);
              localStorage.setItem('now_index_in_tracks', index - 1);
            }
          }}>{'<'}</button>
          <button className='right' onClick={e => {
            let list = localStorage.getItem("TrackList");
            const index = parseInt(localStorage.getItem('now_index_in_tracks'));
            list = list.split(',');
            if (list[index + 1]) {
              setId(list[index + 1]);
              localStorage.setItem('now_index_in_tracks', index + 1);
            }
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
        <div className='bar' style={{ width: innerWidth >= 1200 ? `${currentT / durationT * 100}%` : `${currentT / durationT * 93}vw` }} />
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
    <audio ref={audio} />
  </S.Player >;
}

