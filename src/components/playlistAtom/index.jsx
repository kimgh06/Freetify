"use client"
import axios from 'axios';
import * as S from './style';

const url = 'https://api.spotify.com/v1';

export default function PlaylistAtom({ img, title, artist, id, type, playingtime, playtime, artistId }) {
  const getMusicData = async e => {
    await axios.get(`${url}/audio-analysis/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } }).then(e => {
      console.log(e.data);
    }).catch(e => {
      console.log(e);
    })
  }
  return <S.PlayAtom>
    <img src={img} alt="alt" onClick={e => {
      // console.log(id, type);
      getMusicData();
    }} />
    <div>
      <div className="title" onClick={e => {
        console.log(id, type);
      }}>{title}</div>&nbsp;
      <div className="artist" onClick={e => {
        console.log(artistId)
      }}>{artist}</div>
    </div>
    <div className="playingtime">{playingtime}</div>
    <div className="playtime">{playtime}</div>
  </S.PlayAtom>;
}