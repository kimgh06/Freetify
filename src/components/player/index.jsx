"use client";
import { useEffect, useState } from 'react';
import * as S from './style';
import axios from 'axios';

export default function Player() {
  const [audio, setAudio] = useState(new Audio());
  const [id, setId] = useState(localStorage.getItem('now_playing_id'));
  const [playingtime, setPlayingtime] = useState(1000000);
  const [play, setPlay] = useState(false);
  const [currentT, setCurrentT] = useState(0);
  const [durationT, setDurationT] = useState(`${(playingtime - playingtime % 60000) / 60000}:${((playingtime % 60000 - (playingtime % 60000) % 1000) / 1000).toString().padStart(2, '0')}`);

  const getMusicUrl = async id => {
    await axios.get(`https://api.spotifydown.com/download/${id}`).then(e => {
      console.log(e.data)
      setAudio(new Audio(`https://cors.spotifydown.com/${e.data.link}`));
    }).catch(e => {
      console.log(e);
    })
  }
  useEffect(e => {
    getMusicUrl(id);
  }, []);
  useEffect(e => {
    if (id) {
      audio.pause();
      setPlay(false);
      setCurrentT(0);
      setDurationT(`${(playingtime - playingtime % 60000) / 60000}:${((playingtime % 60000 - (playingtime % 60000) % 1000) / 1000).toString().padStart(2, '0')}`);
      getMusicUrl(id);
    }
  }, [id]);
  useEffect(e => {
    audio.volume = 0.5;
    if (play) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [play]);
  return <S.Player>
    <button onClick={e => setPlay(a => !a)}>{play ? '⏸' : '▶'}</button>
  </S.Player>;
}