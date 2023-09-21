"use client";

import AritstProfile from "@/components/artistprofile";
import Navi from "@/components/nav";
import Tag from "@/components/tag";
import axios from "axios";
import * as S from './style';
import { useEffect, useState } from "react";
import PlaylistAtom from "@/components/playlistAtom";
import { RecoilRoot } from "recoil";

const url = 'https://api.spotify.com/v1';

export default function asdf({ params }) {
  const { id } = params;
  const [info, setInfos] = useState();
  const [topTracks, setTopTracks] = useState([]);
  async function getArtistTopTracks() {
    await axios.get(`${url}/artists/${id}/top-tracks?market=US`, { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } })
      .then(e => {
        console.log(e.data);
        setTopTracks(e.data.tracks);
      }).catch(e => {
        console.log(e);
      });
  }
  async function getArtistInfo() {
    await axios.get(`${url}/artists/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } })
      .then(e => {
        // console.log(e.data);
        setInfos(e.data);
        document.title = e.data.name;
        getArtistTopTracks();
      }).catch(e => {
        console.log(e);
      });
  }
  async function getArtistAlbums() {
    await axios.get(`${url}/artists/${id}/albums`, { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } })
      .then(e => {
        console.log(e.data);
      }).catch(e => {
        console.log(e);
      })
  }
  useEffect(e => {
    getArtistInfo();
  }, [])
  return <RecoilRoot>
    <S.PaddingBox />
    <Navi />
    {info && <>
      <AritstProfile id={info?.id} img={info?.images[1]} name={info?.name} popularity={info?.popularity} followers={info?.followers.total} />
      <S.Genres>
        {info?.genres?.map((i, n) => <Tag genre={i} key={n} />)}
      </S.Genres>
      <S.TracksHeader>Top Tracks</S.TracksHeader>
      {topTracks !== 0 && <>
        {topTracks?.map((i, n) => <PlaylistAtom album={i?.album} index={n} preview={i?.preview_url} key={n} artist={info?.name} artistId={id} title={i?.name} id={i?.id}
          img={i?.album?.images[2]?.url} type={i?.type} isInPlay={e => {
            let list = [];
            list = JSON.parse(localStorage.getItem('list'));
            if (list === null) {
              list = [];
            }
            return list.find(a => a === i?.id)
          }} playingtime={i?.duration_ms} />)}
      </>}
      <S.End>
        <h3>End</h3>
      </S.End>
    </>}
  </RecoilRoot>;
}
