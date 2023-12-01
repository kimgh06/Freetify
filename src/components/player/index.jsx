"use client";
import { useEffect, useRef, useState } from 'react';
import * as S from './style';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { AccessToken, AudioSrc, NowPlayingId, PlayingCurrentTime, Volume } from '@/app/recoilStates';
import Link from 'next/link';

export default function Player() {
  const audio = useRef(null);
  const [id, setId] = useRecoilState(NowPlayingId);
  const [src, setSrc] = useRecoilState(AudioSrc);
  const [access, setAccess] = useRecoilState(AccessToken);
  const [currentT, setCurrentT] = useRecoilState(PlayingCurrentTime);
  const [volume, setVolume] = useRecoilState(Volume);
  const [modify, setModify] = useState(false);
  const [info, setInfo] = useState({});
  const [play, setPlay] = useState(false);
  const [durationT, setDurationT] = useState(`0:00`);
  const [extensionMode, setExtenstionMode] = useState(false);
  const [innerWidth, setInnerWidth] = useState(null);
  const Axios_controler = new AbortController();
  const getMusicUrl = async (artist, title, album, length, id) => {
    if (artist && title && album && length) {
      await axios.get(`/api/get_video?album=${album}&artist=${artist}&length=${length}&title=${title.replace(/&/g, "%38").replace(/#/g, "%35")}`, {
        responseType: 'blob',
        signal: Axios_controler.signal
      }).then(e => {
        let cached_url = JSON.parse(localStorage.getItem('cached_url')) || {};
        if (cached_url[`${id}`]) {
          return;
        }
        const url = URL.createObjectURL(e.data);
        cached_url[`${id}`] = url;
        localStorage.setItem('cached_url', JSON.stringify(cached_url));
        console.log(title, "loaded");
      }).catch(e => {
        console.log(e.message, title);
      })
      // Axios_controler.abort();
    }
  }
  const recommendTracks = async e => {
    const recentTrack = localStorage.getItem('recent_track_list').split(',').slice(-2);
    const recentArtists = localStorage.getItem('recent_artists_list').split(',').slice(-2);
    let tracklist = localStorage.getItem('TrackList').split(',');
    await axios.get(`https://api.spotify.com/v1/recommendations?seed_tracks=${recentTrack}&seed_artists=${recentArtists}`, { headers: { Authorization: `Bearer ${access}` } }).then(e => {
      const tracks = e.data.tracks;
      tracks.forEach(track => {
        if (tracklist.indexOf(track.id) == -1) {
          tracklist.push(track.id)
        }
      })
      let list = [];
      tracks.forEach(track => { list.push(track.id) });
      localStorage.setItem("recommendation", list);
      localStorage.setItem("TrackList", tracklist);
      NextTrack()
    }).catch(e => {
      console.log("err: ", e);
    })
  }
  const getTrackinfos = async id => {
    let token = access
    return id && await axios.get(`https://api.spotify.com/v1/tracks/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then(async e => {
      return e.data;
    }).catch(e => {
      setAccess(localStorage.getItem('access'))
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
      else { //트랙 추천
        recommendTracks();
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
      if (!id) {
        return;
      }
      const music_data = await getTrackinfos(id);
      if (!music_data) {
        return;
      }
      setInfo(music_data);
      setDurationT(music_data.duration_ms)

      audio.current.src = null;
      let cached_url = JSON.parse(localStorage.getItem('cached_url')) || {};
      let url = cached_url[`${id}`];

      if (url) {
        audio.current.src = url
        setSrc(url)
      } else {
        await getMusicUrl(music_data?.artists[0]?.name, music_data?.name, music_data?.album?.name, music_data.album.total_tracks, id).then(() => {
          let cached_url = JSON.parse(localStorage.getItem('cached_url')) || {};
          let new_src = cached_url[`${id}`]
          audio.current.src = new_src;
          setSrc(new_src);
          setPlay(false)
        });
      }

      navigator.mediaSession.metadata = new MediaMetadata({
        title: music_data.name,
        artist: music_data.artists[0].name,
        album: music_data.album.name,
        artwork: [{ src: music_data.album.images[0].url }]
      })
      let recentList = JSON.stringify(localStorage.getItem('recent_track_list')).replace(/\\/g, '').replace(/"/g, '');
      let recentArtists = JSON.stringify(localStorage.getItem('recent_artists_list')).replace(/\\/g, '').replace(/"/g, '')
      if (recentList != 'null' && recentArtists != 'null') {
        //최근 트랙
        recentList = recentList.split(',');
        recentArtists = recentArtists.split(',');
        recentList = recentList.filter(element => element !== id && element)

        recentList.push(id);
        localStorage.setItem('recent_track_list', recentList);

        //최근 아티스트
        recentArtists = recentArtists.filter(element => element !== music_data.artists[0].id && element)
        recentArtists.push(music_data.artists[0].id);
        localStorage.setItem('recent_artists_list', recentArtists);

      } else {
        localStorage.setItem('recent_track_list', [id]);
        localStorage.setItem('recent_artists_list', [music_data.artists[0].id]);
      }

      let list = localStorage.getItem("TrackList")?.split(',');
      if (!list) {
        localStorage.setItem('now_index_in_tracks', 0);
        return;
      }
      const index = list.findIndex(e => e === id);
      if (!(index >= 0 && index < list.length)) {
        return;
      }
      localStorage.setItem('now_index_in_tracks', index);
      const next_data = await getTrackinfos(list[index + 1]);
      if (!next_data) {
        return;
      }
      url = cached_url[list[index + 1]];
      if (url) {
        return;
      }
      getMusicUrl(next_data?.artists[0]?.name, next_data?.name, next_data?.album?.name, next_data.album.total_tracks, list[index + 1]);
    } catch (e) {
      console.log(e)
    }
  }
  const CheckExpiredBlobUrl = async url => {
    if (url) {
      await fetch(url).then(e => {
        audio.current.src = url;
        audio.current.currentTime = currentT + 0.5
        setPlay(false);
      }).catch(e => {
        audio.current.src = null;
        setSrc(null);
        localStorage.setItem("cached_url", JSON.stringify({}));
        console.log("expired", e.toString())
      });
    }
  }
  useEffect(e => {
    if (!id && src) {
      setId(localStorage.getItem('now_playing_id'));
      return;
    }
    setPlay(false)
    localStorage.setItem('now_playing_id', id);
    getCurrentMusicURL();
    navigator.mediaSession.setActionHandler("nexttrack", e => {
      NextTrack()
    })
    navigator.mediaSession.setActionHandler("previoustrack", e => {
      PreviousTrack()
    })
  }, [id, access]);
  useEffect(e => {
    if (!audio.current.src) {
      audio.current.src = src
      return;
    }
    if (modify) {
      audio.current.pause();
      return;
    }
    if (play) {
      let promise = audio.current.play();
      promise.catch(err => { console.log(err); setPlay(false) });
      return;
    }
    audio.current.pause();
  }, [play, modify]);
  useEffect(e => {
    if (typeof window !== undefined) {
      CheckExpiredBlobUrl(src);
      setInnerWidth(window.innerWidth);
      setExtenstionMode(e => window.innerWidth >= 1200 ? true : false);
      window.addEventListener('resize', e => {
        setInnerWidth(window.innerWidth);
      })
      window.addEventListener('keydown', e => {
        if (e.code === 'Space') {
          e.preventDefault()
          setPlay(a => !a)
        }
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
      if (!modify) {
        return;
      }
      const one_vw = innerWidth / 100;
      if (innerWidth < 1200) {
        const percent = (e.clientX - (one_vw + 10)) / (innerWidth - 2 * (one_vw + 10));
        audio.current.currentTime = Math.floor(percent * durationT) / 1000;
        return;
      }
      if (innerWidth >= 1200 && extensionMode) {
        const start_point = (318 + (one_vw * 30 - 300) / 2) - (innerWidth - e.clientX);
        const percent = start_point / 300;
        audio.current.currentTime = Math.floor(percent * durationT) / 1000;
        return;
      }
    }} onTouchEnd={e => setModify(false)}
      onTouchMove={e => {
        setModify(true)
        const one_vw = innerWidth / 100;
        if (innerWidth < 1200) {
          const percent = (e.touches[0].clientX - (one_vw + 10)) / (innerWidth - 2 * (one_vw + 10));
          audio.current.currentTime = Math.floor(percent * durationT) / 1000;
          return;
        }
        if (innerWidth >= 1200 && extensionMode) {
          const start_point = (318 + (one_vw * 30 - 300) / 2) - (innerWidth - e.clientX);
          const percent = start_point / 300;
          audio.current.currentTime = Math.floor(percent * durationT) / 1000;
          return;
        }
      }}
    >
      {innerWidth >= 1200 && <div className='extention' style={{ right: `${!extensionMode ? '75px' : '28vw'}` }} onClick={e => setExtenstionMode(a => !a)}>
        <div className='___' />
        <div className='___' />
        <div className='___' />
      </div>}
      <div className='head'>
        {innerWidth >= 1200 ? (extensionMode ? <>
          <div className='main_original'>
            <img src={info?.album?.images[1]?.url} alt='img' />
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
              <img src={info?.album?.images[2]?.url} alt='img' />
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
        onMouseDown={e => {
          e.preventDefault();
          if (extensionMode || innerWidth <= 1200) {
            setModify(true);
          }
        }}
      >
        <div className='bar' style={{ width: `${currentT * 1000 / durationT * 100}%` }} />
        <div className='bar_cursor' />
      </div>
      {!(innerWidth >= 1200 && !extensionMode) && `${(currentT - currentT % 60) / 60}:${((currentT % 60 - (currentT % 60) % 1) / 1).toString().padStart(2, '0')} / ${(durationT - durationT % 60000) / 60000}:${((durationT % 60000 - (durationT % 60000) % 1000) / 1000).toString().padStart(2, '0')}`}
      {!(innerWidth >= 1200 && !extensionMode) ? <div className='volume'>
        <button onClick={e => setVolume(a => a - 0.1 < 0.1 ? a : a - 0.1)}>-</button>
        <span>{Math.round(volume * 100)}%</span>
        <button onClick={e => setVolume(a => a + 0.1 > 1 ? a : a + 0.1)}>+</button>
      </div> : <S.Main_smaller>
        <button onClick={e => setVolume(a => a + 0.1 > 1 ? a : a + 0.1)}>+</button>
        <span>{Math.round(volume * 100)}%</span>
        <button onClick={e => setVolume(a => a - 0.1 < 0.1 ? a : a - 0.1)}>-</button>
        <div className='title'>{info?.name}</div>
      </S.Main_smaller>}
    </div>
    <audio ref={audio} onTimeUpdate={e => {
      const { currentTime, duration } = audio.current;
      setCurrentT(currentTime);
      if (currentTime >= durationT / 1000 || currentTime >= duration) {
        audio.current.src = null;
        setSrc(null)
        NextTrack();
      }
    }}
      onLoadedData={e => setPlay(true)}
      onPause={e => !modify && setPlay(false)}
      onPlay={e => setPlay(true)} />
  </S.Player>;
}

