"use client"
import axios from 'axios';
import * as S from './style';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const url = 'https://api.spotify.com/v1';

export default function PlaylistAtom({ index, img, title, artist, id, type, playingtime, artistId, isInPlay, album }) {
  const [toggle, setToggle] = useState(isInPlay);
  const [audio, setAudio] = useState(new Audio());
  const [currentT, setCurrentT] = useState(0);
  const [durationT, setDurationT] = useState(`${(playingtime - playingtime % 60000) / 60000}:${((playingtime % 60000 - (playingtime % 60000) % 1000) / 1000).toString().padStart(2, '0')}`);
  const [full, setFull] = useState(null);
  const [play, setPlay] = useState(false);
  const getMusicAnalsisData = async e => {
    // await axios.get(`${backendUrl}/geturl?url=${url}/${type}/${id}&authorization=${`Bearer ${localStorage.getItem('access')}`}`).then(e => {
    //   console.log(e.data);
    // }).catch(e => {
    //   console.log(e);
    // });
    // await axios.get(`${proxy}/${url}/${type}/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } }).then(e => {
    //   console.log(e.data);
    // }).catch(e => {
    //   console.log(e);
    // })
    await axios.get(`${url}/audio-analysis/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } }).then(e => {
      console.log(e.data);
    }).catch(e => {
      console.log(e);
    });
  }
  const getMusicUrl = async e => {
    await axios.get(`https://api.spotifydown.com/download/${id}`).then(e => {
      setFull(`https://cors.spotifydown.com/${e.data.link}`);
    }).catch(e => {
      console.log(e);
    })
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
      setCurrentT(0);
      setFull(null);
      setDurationT(`${(playingtime - playingtime % 60000) / 60000}:${((playingtime % 60000 - (playingtime % 60000) % 1000) / 1000).toString().padStart(2, '0')}`);
      getMusicUrl();
    }
  }, [id]);
  useEffect(e => {
    if (full) {
      audio.pause();
      setPlay(false);
      setCurrentT(0);
      const newAudio = new Audio(full);
      setAudio(newAudio);
    }
  }, [full]);
  audio.addEventListener('timeupdate', e => {
    const { currentTime, duration } = audio;
    setCurrentT(`${(currentTime - currentTime % 60) / 60}:${((currentTime % 60 - (currentTime % 60) % 1) / 1).toString().padStart(2, '0')}`);
    setDurationT(`${(duration - duration % 60) / 60}:${((duration % 60 - (duration % 60) % 1) / 1).toString().padStart(2, '0')}`);
    if (duration - currentTime === 0) {
      audio.currentTime = 0;
      setCurrentT('0:00');
      setPlay(false);

    }
  });
  useEffect(e => {
    audio.volume = 0.5;
    if (play) {
      console.log(index);
      localStorage.setItem('now_index_in_tracks', index);
      localStorage.setItem('now_playing_id', id)
      audio.play();
    } else {
      audio.pause();
    }
  }, [play]);
  return <S.PlayAtom>
    <img src={img} alt="" onClick={e => {
      // console.log(id, type);
      getMusicAnalsisData();
    }} />
    <div>
      <div className='hea'>
        <Link className="title" href={album ? `/album/${album?.id}` : '#'} >{title}</Link>&nbsp;
        {type === "track" && <div className='isInPlay' onClick={listcontrol}>{toggle ? '-' : '+'}</div>}
      </div>
      <div className='foo'>
        <Link className="artist" href={`/artist/${artistId}`}>{artist}</Link>
        {full ? <div className='audio'>
          <div className='bar' style={{ width: `${audio.currentTime / audio.duration * 13}vw` }} />
          <button onClick={e => setPlay(a => !a)}>{play ? '⏸' : '▶'}</button>
          {currentT}/{durationT}
        </div> : type === 'track' && <div className='audio'>...</div>}
      </div>
    </div>
    {/* {playingtime && <div className="playingtime">{durationT}</div>} */}
  </S.PlayAtom>;
}