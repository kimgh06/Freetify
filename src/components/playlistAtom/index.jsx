"use client"
import * as S from './style';

const url = 'https://api.spotify.com/v1';

export default function PlaylistAtom({ img, title, artist, id, type, playingtime, playtime, artistId }) {
  return <S.PlayAtom>
    <img src={img} alt="alt" onClick={e => {
      console.log(id, type);
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