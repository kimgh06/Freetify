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
      }
    }).catch(e => {
      console.log(e);
    });
  }
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
    let ids = ["3H4ZrsDezaN37zplSpXUWd", "3LDNcikQd7Zui9gJCISTtR", "7fhiGdj0nn0ZCmIAocG8G0"]
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
    const queries = new URLSearchParams(location.search);
    if (queries.size !== 0) {
      getTokens();
    } else {
      console.log((localStorage.getItem('expire') - new Date().getTime()) / 60000); //시간 계산용
      if (access) {
        GettingInfos();
      }
    }
  }, [access]);
  return <S.App>
    <Navi />
    <h1>Host Pick</h1>
    {tracks?.length !== 0 && tracks?.map((i, n) => <PlaylistAtom index={n} preview={i?.preview_url} album={i?.album} playingtime={i?.duration_ms} key={n} img={i.album.images[2].url} type={i?.type}
      id={i?.id} title={i?.name} artist={i?.artists} artistId={i?.artists[0].id} isInPlay={e => {
        let list = [];
        list = JSON.parse(localStorage.getItem('list'));
        if (list === null) {
          list = [];
        }
        return list.find(a => a === i?.id)
      }} />)}
  </S.App>;
}