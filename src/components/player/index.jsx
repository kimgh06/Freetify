"use client";
import { useEffect, useRef, useState } from 'react';
import * as S from './style';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { AccessToken, AddbuttonIndex, AudioSrc, NowPlayingId, PlayingCurrentTime, Volume } from '@/app/recoilStates';
import Link from 'next/link';
import Lyric from '../lyric';
import { MenuComponent } from './menucomponent';

export default function Player() {
  const audio = useRef(null);
  const [modify, setModify] = useState(false);
  const [info, setInfo] = useState({});
  const [play, setPlay] = useState(false);
  const [durationT, setDurationT] = useState(`0:00`);
  const [extensionMode, setExtenstionMode] = useState(false);
  const [innerWidth, setInnerWidth] = useState(null);

  const [id, setId] = useRecoilState(NowPlayingId);
  const [src, setSrc] = useRecoilState(AudioSrc);
  const [access, setAccess] = useRecoilState(AccessToken);
  const [currentT, setCurrentT] = useRecoilState(PlayingCurrentTime);
  const [volume, setVolume] = useRecoilState(Volume);
  const [popup, setPopup] = useRecoilState(AddbuttonIndex);

  const blob2base64 = blob => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject
    });
  }

  const base642blob = base64 => {
    const decompressed = Lzstring.decompressFromBase64(base64);
    const byteCharacters = atob(decompressed);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'audio/mp3' });
  }

  const getMusicUrl = async (id) => {
    if (!id) {
      return;
    }
    await axios.get(`/api/get_video?songId=${id}`, {
      responseType: 'blob',
      headers: {
        'Authorization': access,
        'user_access': localStorage.getItem('user_access') || null
      }
    }).then(e => {
      // let cached_url = JSON.parse(localStorage.getItem('cached_url')) || {};
      // if (cached_url[`${id}`]) {
      //   return;
      // }
      // const new_blob = e.data;
      // const url = URL.createObjectURL(new_blob);
      // const caching = new Audio(url)
      // caching.play()
      //   .then(e => caching.pause())
      // cached_url[`${id}`] = url;

      const rq = indexedDB.open('caching_blob')
      rq.onupgradeneeded = (event) => {
        const db = event.target.result;

        // if (!db.objectStoreNames.contains("blob")) {
        db.createObjectStore("blob", { keyPath: "id" });
        console.log("created object store");
        // }
      };

      rq.onsuccess = (e) => {
        const db = e.target.result;
        db.transaction('blob', 'readwrite')
          .objectStore('blob')
          .add({ id, data: new_blob });
      }
      // localStorage.setItem('cached_url', JSON.stringify(cached_url));
    }).catch(e => {
      console.log(e.message, id);
    })
  }
  const recommendTracks = async e => {
    const recentTrack = localStorage.getItem('recent_track_list').split(',').slice(-2);
    const recentArtists = localStorage.getItem('recent_artists_list').split(',').slice(-2);
    let tracklist = localStorage.getItem('TrackList').split(',');
    await axios.get(`https://api.spotify.com/v1/recommendations?seed_tracks=${recentTrack}&seed_artists=${recentArtists}`,
      { headers: { Authorization: `Bearer ${access}` } })
      .then(e => {
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
        console.log('get recommendations')
      }).catch(e => {
        console.log("err: ", e);
      })
  }
  const getTrackinfos = async id => {
    let token = access
    return id && await axios.get(`https://api.spotify.com/v1/tracks/${id}`,
      { headers: { Authorization: `Bearer ${token}` } })
      .then(async e => {
        return e.data;
      }).catch(e => {
        setAccess(localStorage.getItem('access'))
        console.log(e);
        return null;
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
        recommendTracks().then(NextTrack);
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
      const expired = await CheckExpiredBlobUrl(src); //true 만료됨
      if (id === localStorage.getItem('now_playing_id') && !expired) { // 토큰이 바뀌었을 떄
        audio.current.currentTime = currentT + 0.2;
        return;
      }

      audio.current.src = null;
      // let cached_url = JSON.parse(localStorage.getItem('cached_url')) || {};
      // let url = cached_url[`${id}`];
      let url;

      const rq = indexedDB.open('caching_blob')
      rq.onsuccess = (e) => {
        const db = e.target.result;
        let rq = db.transaction('blob', 'readwrite')
          .objectStore('blob')
          .get(id)
        rq.onsuccess = async event => {
          url = URL.createObjectURL(event.target.result['data']);
          console.log(url)

          if (url) {
            const spl = audio.current.src.split("/")
            if (spl[spl.length - 1] !== 'null' && localStorage.getItem('now_playing_id') === id) {
              return;
            }
            audio.current.src = url
          } else {
            await getMusicUrl(id).then(() => {
              // let cached_url = JSON.parse(localStorage.getItem('cached_url')) || {};
              // let new_src = cached_url[`${id}`]
              const rq = indexedDB.open('caching_blob')
              rq.onsuccess = (e) => {
                const db = e.target.result;
                let rq = db.transaction('blob', 'readwrite')
                  .objectStore('blob')
                  .get(id)
                rq.onsuccess = event => {
                  url = URL.createObjectURL(event.target.result['data']);
                  console.log("new url", url)
                }
              }
              audio.current.src = url;
            });
          }
          audio.current.play();
          setPlay(true);

          setSrc(audio.current.src)
          localStorage.setItem('now_playing_id', id);
        }
      }

      let recentList = JSON.stringify(localStorage.getItem('recent_track_list'))
        .replace(/\\/g, '').replace(/"/g, '');
      let recentArtists = JSON.stringify(localStorage.getItem('recent_artists_list'))
        .replace(/\\/g, '').replace(/"/g, '')
      if (recentList != 'null' && recentArtists != 'null') {
        //최근 트랙
        recentList = recentList.split(',').filter(element => element !== id && element);
        recentList.push(id);
        localStorage.setItem('recent_track_list', recentList);

        //최근 아티스트
        recentArtists = recentArtists.split(',').filter(element => element !== music_data.artists[0].id && element);
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
      // url = cached_url[list[index + 1]];

      const new_rq = indexedDB.open('caching_blob')
      new_rq.onsuccess = (e) => {
        const db = e.target.result;
        let rq = db.transaction('blob', 'readwrite')
          .objectStore('blob')
          .get(list[index + 1])
        rq.onsuccess = event => {
          url = URL.createObjectURL(event.target.result['data']);
          console.log(url)
          if (url) {
            return;
          }
          getMusicUrl(list[index + 1]);
        }
      }
    } catch (e) {
      console.log(e)
    }
  }
  const CheckExpiredBlobUrl = async url => { //Blob url 유효성 검사
    if (!url && url === 'undefined') {
      return true;
    }
    return await fetch(url).then(e => {
      audio.current.src = url;
      audio.current.currentTime = 0;
      const plays = localStorage.getItem('play') === 'true';
      if (plays) audio.current.play();
      setPlay(e => plays)
      return false;
    }).catch(e => {
      localStorage.setItem("cached_url", JSON.stringify({}));
      console.log("expired", e.toString())
      return true;
    });
  }

  useEffect(e => {
    navigator.mediaSession.setActionHandler("nexttrack", NextTrack)
    navigator.mediaSession.setActionHandler("previoustrack", PreviousTrack)
    if (!id && src) {
      setId(localStorage.getItem('now_playing_id'));
      return;
    }
    getCurrentMusicURL();

    const path = window.location.pathname;
    const tracklist = localStorage?.getItem("TrackList")?.split(',') || [];
    if (path === '/search' && tracklist.findIndex(e => e === id) <= 0) { // 검색 창일때 현재 플레이 리스트에서 찾지 못 할 때만 추천 리스트 받아오기
      localStorage.setItem("TrackList", id);
      recommendTracks()
    }
  }, [id, access]);

  useEffect(e => {
    if (!audio.current.src) {
      audio.current.src = src;
      return;
    }
    if (modify) {
      audio.current.pause();
      return;
    }
    document.querySelector('.play').focus()
    localStorage.setItem('play', play);
    if (play && audio.current.paused) {
      let promise = audio.current.play();
      promise.catch(err => {
        console.log(err);
        getMusicUrl(id).then(() => {
          let url;
          const rq = indexedDB.open('caching_blob')
          rq.onsuccess = (e) => {
            const db = e.target.result;
            let rq = db.transaction('blob', 'readwrite')
              .objectStore('blob')
              .get(id)
            rq.onsuccess = event => {
              url = URL.createObjectURL(event.target.result['data']);
              console.log(url)
            }
          }

          audio.current.src = url;
          setPlay(true);
          return;
        })
        setPlay(false)
      });
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
    }
  }, []);

  useEffect(e => {
    audio.current.volume = volume;
    if (popup === 'popup') {
      setPopup('')
    }
  }, [id, volume]);

  useEffect(e => {
    localStorage.setItem('currentT', currentT);
    if (info?.name) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: info?.name,
        artist: info?.artists[0].name,
        album: info?.album.name,
        artwork: [{ src: info?.album.images[0].url }]
      });
    }
  }, [currentT, info])
  return <S.Player style={{
    width: `${(innerWidth >= 1200 && !extensionMode) ? '100px' :
      innerWidth < 1200 ? '98vw' : '400px'}`,
    height: `${(innerWidth <= 1200 && extensionMode) ?
      innerWidth < 651 ? '90vh' : '550px' :
      innerWidth > 1200 ? '99vh' : '120px'}`
  }} >
    <div className='audio'>
      {innerWidth >= 1200 && <div className='extention' style={{ right: `${!extensionMode ? '75px' : '370px'}` }}
        onClick={e => setExtenstionMode(a => !a)}>
        <div className='___' />
        <div className='___' />
        <div className='___' />
      </div>}
      <div className='head'>
        {innerWidth >= 1200 ? (extensionMode ? <>
          <div className='main_original'>
            <img src={info?.album?.images[1]?.url} alt='img' />
            <div>
              <Link href={`/album/${info?.album?.id}#${info?.name}`}>
                <h2>{info?.name}</h2>
              </Link>
              <Link href={`/artist/${info?.artists && info?.artists[0]?.id} `}>
                {info?.artists && info?.artists[0]?.name}
              </Link>
            </div>
            <div className='playbutton'>
              <button className='left' onClick={PreviousTrack}>{'◀'}</button>
              <button className='play' autoFocus style={{ transform: `rotate(${play ? - 270 : 0}deg)` }}
                onClick={e => setPlay(a => !a)}>{play ? '=' : '▶'}</button>
              <button className='right' onClick={NextTrack}>{'▶'}</button>
            </div>
          </div>
          {info && <Lyric isrc={info?.external_ids?.isrc} />}
        </> : <S.Main_smaller>
          <button className='play' autoFocus style={{ transform: `rotate(${play ? - 270 : 0}deg)` }}
            onClick={e => setPlay(a => !a)}>{play ? '=' : '▶'}</button>
          <button className='left' onClick={PreviousTrack}>{'◀'}</button>
          <button className='right' onClick={NextTrack}>{'▶'}</button>
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
                <div className='title' href={`/album/${info?.album?.id}#${info?.name}`}>{info?.name?.length >= 15 ? info?.name.substr(0, 15) + '..' : info?.name}</div><br />
                <div href={`/artist/${info?.artists && info?.artists[0]?.id} `}>
                  {info?.artists && (info?.artists[0]?.name?.length >= 15 ? info?.artists[0]?.name.substr(0, 15) + '...' : info?.artists[0]?.name)}
                </div>
              </div>
              <button className='left' onClick={PreviousTrack}>{'◀'}</button>
              <button className='play' autoFocus style={{ transform: `rotate(${play ? - 270 : 0}deg)` }}
                onClick={e => setPlay(a => !a)}>{play ? '=' : '▶'}</button>
              <button className='right' onClick={NextTrack}>{'▶'}</button>
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
                  <Link href={`/album/${info?.album?.id}#${info?.name}`}>
                    <h2>{info?.name}</h2>
                  </Link>
                  <Link href={`/artist/${info?.artists && info?.artists[0]?.id} `}>
                    {info?.artists && info?.artists[0]?.name}
                  </Link>
                </div>
                <div className='playbutton'>
                  <button className='left' onClick={PreviousTrack}>{'◀'}</button>
                  <button className='play' autoFocus style={{ transform: `rotate(${play ? - 270 : 0}deg)` }} onClick={e => setPlay(a => !a)}>{play ? '=' : '▶'}</button>
                  <button className='right' onClick={NextTrack}>{'▶'}</button>
                </div>
              </div>
            </div>
          </S.ExtensionMode_mobile>)
        }
      </div>
      {(innerWidth >= 1200 || extensionMode) && <div className='bar_div' style={{ width: innerWidth >= 1200 ? (!extensionMode ? '80px' : '300px') : '' }} >
        <div className='bar' style={{ width: `${currentT * 1000 / durationT * 100}%` }} />
        <input className='bar_cursor' type='range'
          style={{ width: innerWidth >= 1200 ? (extensionMode ? '300px' : '80px') : 'calc(88vw - 20px)' }}
          onChange={e => {
            setCurrentT(e.target.value / 1000)
            audio.current.currentTime = e.target.value / 1000;
          }}
          onMouseDown={e => setModify(true)}
          onMouseUp={e => setModify(false)}
          value={currentT * 1000} min={0} max={durationT} />
      </div>}
      {!(innerWidth >= 1200 && !extensionMode) &&
        <span>
          {(currentT - currentT % 60) / 60}
          :{((currentT % 60 - (currentT % 60) % 1) / 1).toString().padStart(2, '0')} / {(durationT - durationT % 60000) / 60000}
          :{((durationT % 60000 - (durationT % 60000) % 1000) / 1000).toString().padStart(2, '0')}
        </span>}
      {!(innerWidth >= 1200 && !extensionMode) ? <>
        {extensionMode && <div className='volume'>
          <button onClick={e => setVolume(a => a - 0.1 < 0.1 ? a : a - 0.1)}>-</button>
          <span>{Math.round(volume * 100)}%</span>
          <button onClick={e => setVolume(a => a + 0.1 > 1 ? a : a + 0.1)}>+</button>
          <button className='addplaylist' onClick={e => popup !== 'popup' ? setPopup('popup') : setPopup('')}>
            <div className='dot' />
            <div className='dot' />
            <div className='dot' />
          </button>
        </div>}
      </> : <S.Main_smaller>
        <button onClick={e => setVolume(a => a + 0.1 > 1 ? a : a + 0.1)}>+</button>
        <span>{Math.round(volume * 100)}%</span>
        <button onClick={e => setVolume(a => a - 0.1 < 0.1 ? a : a - 0.1)}>-</button>
        <button className='addplaylist' onClick={e => popup !== 'popup' ? setPopup('popup') : setPopup('')}>
          <div className='dot' />
          <div className='dot' />
          <div className='dot' />
        </button>
        <div className='title'>
          <span>{info?.name}</span>
        </div>
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
      onLoadedData={e => localStorage.getItem('play') === 'true' && setPlay(true)}
      onPause={e => !modify && setPlay(false)}
      onPlay={e => setPlay(true)} />
    {popup === 'popup' && <MenuComponent albumId={info?.album?.id} title={info?.name} />}
  </S.Player>;
}
