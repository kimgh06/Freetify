"use client"
import Navi from '@/components/nav';
import * as S from './style';
import axios from "axios";
import { useEffect, useState } from "react"
import Link from 'next/link';
import PlaylistAtom from '@/components/playlistAtom';
import { RecoilRoot, useRecoilState } from 'recoil';
import { AccessToken } from '@/app/recoilStates';

export function Album(props) {
  const id = props.params.id[0];
  return <RecoilRoot>
    <InnerContent id={id} />
  </RecoilRoot>;
}

function InnerContent({ id }) {
  const url = 'https://api.spotify.com/v1';
  const [albumInfo, setAlbumInfo] = useState(null);
  const [totalDuration, setTotalDuration] = useState('0');
  const [access, setAccess] = useRecoilState(AccessToken);
  const [tracks, setTracks] = useState([]);
  if (typeof window === 'undefined') {
    return;
  }
  const paramId = decodeURIComponent(window.location.href.split('#')[1])
  const getAlbumInfos = async e => {
    await axios.get(`${url}/albums/${id}`, { headers: { Authorization: `Bearer ${access}` } })
      .then(e => {
        setAlbumInfo(e.data);
        setTracks(e.data.tracks.items);
        let TrackList = [];
        let sum = 0;
        e.data.tracks.items.forEach(items => {
          TrackList.push(items.id);
          sum += items.duration_ms
        });
        setTotalDuration(`${Math.floor(sum / 60 / 1000)}m ${((sum % 60000 - (sum % 60000) % 1000) / 1000).toString().padStart(2, '0')}s`)
        localStorage.setItem('TrackList', `${TrackList}`);
        document.title = e.data.name;
      }).catch(e => {
        console.log(e);
      });
  }
  useEffect(e => {
    if (access) {
      getAlbumInfos();
    }
  }, [access]);
  return <>
    <Navi />
    <S.AlbumInfos>
      <div className='header'>
        <img src={albumInfo?.images[1].url} alt='img' />
        <div className='description'>
          <h1>{albumInfo?.name}</h1>
          <div className='information'>
            {albumInfo?.artists.map((i, n) => <Link key={n} href={`/artist/${i?.id}`}>{i.name}</Link>)}
            <span>{albumInfo?.tracks.items.length} {albumInfo?.tracks.items.length === 1 ? "track" : "tracks"}</span>&nbsp;&nbsp;
            <span>{totalDuration}</span>&nbsp;&nbsp;
            <span>Released on {albumInfo?.release_date.substr(0, 4)}</span>
          </div>
        </div>
      </div>
      <main className='tracks'>
        {tracks?.map((i, n) => <PlaylistAtom img={albumInfo?.images[2].url} index={n} preview={i?.preview_url} playingtime={i?.duration_ms} key={n} album={i?.album} type={i?.type}
          id={i?.id} paramId={paramId === i?.name} title={i?.name} artist={i?.artists} artistId={i?.artists[0]?.id} isInPlay={e => {
            let list = [];
            list = JSON.parse(localStorage.getItem('list'));
            if (!list) {
              list = [];
            }
            return list.find(a => a === i?.id)
          }} />)}
      </main>
      <div className='end' />
    </S.AlbumInfos>
  </>
}