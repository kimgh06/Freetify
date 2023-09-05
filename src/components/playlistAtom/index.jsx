"use client"
import * as S from './style';

export default function PlaylistAtom({ img, title, artist, playingtime, playtime }) {
  return <S.PlayAtom>
    <img src={img} alt="alt" />
    <div className="title">{title}</div>
    <div className="artist">{artist}</div>
    <div className="playingtime">{playingtime}</div>~
    <div className="playtime">{playtime}</div>
  </S.PlayAtom>;
}