"use client"
import Navi from "@/components/nav";
import PlaylistAtom from "@/components/playlistAtom";
import axios from "axios";
import * as S from './style';
import { useEffect, useState } from "react";
import { RecoilRoot, useRecoilState } from "recoil";
import { AccessToken } from "./recoilStates";

export default function Home() {
  return <RecoilRoot>
    <InnerComponent />
  </RecoilRoot>;
}

function InnerComponent() {
  const [tracks, setTracks] = useState([]);
  const [access, setAccess] = useRecoilState(AccessToken);
  const getTokens = async e => {
    const queries = new URLSearchParams(location.search);
    await axios.post(`/api/getTokens`, {
      code: queries.get('code'),
      state: queries.get('state')
    }).then(e => {
      const info = e.data;
      if (!info?.error) {
        localStorage.setItem('access', info.access_token);
        localStorage.setItem('refresh', info.refresh_token);
        localStorage.setItem('expire', new Date().getTime() + info.expires_in * 1000);
        localStorage.setItem('scopes', info.scope)
        // window.location.href = '/';
        history.pushState(null, null, '/');
        getTrackinfos();
      }
    }).catch(e => {
      console.log(e);
    });
  }
  const getTrackinfos = async e => {
    let ids = [];
    ids = JSON.parse(localStorage.getItem('list'))?.join(',') || undefined;
    if (ids) {
      await axios.get(`https://api.spotify.com/v1/tracks?ids=${ids}`, { headers: { Authorization: `Bearer ${access}` } }).then(e => {
        setTracks(e.data.tracks);
        console.log(e.data)
        let TrackList = [];
        e.data.tracks.forEach(items => {
          TrackList.push(items.id);
        });
        localStorage.setItem('TrackList', `${TrackList}`);
      }).catch(e => {
        console.log(e);
      });
    }
  }
  useEffect(e => {
    const queries = new URLSearchParams(location.search);
    document.title = 'My Tracks'
    if (queries.size !== 0) {
      getTokens();
    } else {
      console.log((localStorage.getItem('expire') - new Date().getTime()) / 60000); //시간 계산용
      getTrackinfos();
    }
  }, [access]);
  return <S.App>
    <Navi />
    <h1>My track</h1>
    {tracks.length !== 0 && tracks?.map((i, n) => <PlaylistAtom index={n} preview={i?.preview_url} album={i?.album} playingtime={i?.duration_ms} key={n} img={i.album.images[2].url} type={i?.type}
      id={i?.id} title={i?.name} artist={i?.artists[0].name} artistId={i?.artists[0].id} isInPlay={e => {
        let list = [];
        list = JSON.parse(localStorage.getItem('list'));
        if (list === null) {
          list = [];
        }
        return list.find(a => a === i?.id)
      }} />)}
  </S.App>;
}