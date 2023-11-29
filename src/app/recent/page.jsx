"use client"
import Navi from "@/components/nav";
import PlaylistAtom from "@/components/playlistAtom";
import axios from "axios";
import * as S from './style';
import { useEffect, useState } from "react";
import { RecoilRoot, useRecoilState } from "recoil";
import { AccessToken, AudioSrc, NowPlayingId } from "../recoilStates";

export default function Home() {
  return <RecoilRoot>
    <InnerComponent />
  </RecoilRoot>;
}

function InnerComponent() {
  const [tracks, setTracks] = useState([]);
  const [access, setAccess] = useRecoilState(AccessToken);
  const getTrackinfos = async ids => {
    if (ids) {
      return await axios.get(`https://api.spotify.com/v1/tracks?ids=${ids}`, { headers: { Authorization: `Bearer ${access}` } }).then(e => {
        return e.data.tracks
      }).catch(e => {
        console.log(e);
      });
    }
  }
  const GettingInfos = async e => {
    let ids = [];
    if (localStorage.getItem('recent_track_list') !== null) {
      ids = localStorage.getItem('recent_track_list').split(',')
      ids = ids.slice(-50).reverse()
      ids = ids.join(',')
    }
    let tr = await getTrackinfos(ids);

    setTracks(tr);
    let TrackList = [];
    tr.forEach(items => {
      if (TrackList.indexOf(items.id) === -1) {
        TrackList.push(items.id);
      }
    });
    localStorage.setItem('TrackList', `${TrackList}`);
  }
  useEffect(e => {
    if (access) {
      GettingInfos();
    }
  }, [access]);
  return <S.App>
    <Navi />
    <h1>Recent Tracks</h1>
    {tracks?.length !== 0 && tracks?.map((i, n) => <PlaylistAtom index={n} preview={i?.preview_url} album={i?.album} playingtime={i?.duration_ms} key={n} img={i?.album.images[2].url} type={i?.type}
      id={i?.id} title={i?.name} artist={i?.artists} artistId={i?.artists[0].id} isInPlay={e => {
        let list = [];
        list = JSON.parse(localStorage.getItem('list'));
        if (list === null) {
          list = [];
        }
        return list.find(a => a === i?.id)
      }} />)}
    <S.PaddingBox />
  </S.App>;
}