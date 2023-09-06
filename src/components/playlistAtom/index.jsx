"use client"
import * as S from './style';

const url = 'https://api.spotify.com/v1';

export default function PlaylistAtom({ img, title, artist, playingtime, playtime }) {
  return <S.PlayAtom>
    <img src={img} alt="alt" />
    <div>
      <div className="title">{title}</div>&nbsp;
      <div className="artist">{artist}</div>
    </div>
    <div className="playingtime">{playingtime}</div>~
    <div className="playtime">{playtime}</div>
  </S.PlayAtom>;
}