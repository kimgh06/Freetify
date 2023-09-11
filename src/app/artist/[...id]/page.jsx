"use client";

import AritstProfile from "@/components/artistprofile";
import Navi from "@/components/nav";
import Tag from "@/components/tag";
import axios from "axios";
import * as S from './style';
import { useEffect, useState } from "react";

export default function asdf({ params }) {
  const { id } = params;
  const [info, setInfos] = useState();
  async function getArtistInfo() {
    await axios.get(`https://api.spotify.com/v1/artists/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } })
      .then(e => {
        console.log(e.data);
        setInfos(e.data);
        document.title = e.data.name
      }).catch(e => {
        console.log(e);
      });
  }
  useEffect(e => {
    getArtistInfo();
  }, [])
  return <>
    <Navi />
    {info && <>
      <AritstProfile id={info?.id} img={info?.images[1]} name={info?.name} popularity={info?.popularity} followers={info?.followers.total} />
      <S.Genres>
        {info?.genres?.map((i, n) => <Tag genre={i} key={n} />)}
      </S.Genres>
    </>}
  </>
}
