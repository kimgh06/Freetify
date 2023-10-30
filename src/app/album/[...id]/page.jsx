"use client"
import Navi from '@/components/nav';
import * as S from './style';
import axios from "axios";
import { useEffect, useState } from "react"
import Link from 'next/link';
import PlaylistAtom from '@/components/playlistAtom';
import { RecoilRoot, useRecoilState } from 'recoil';
import { AccessToken } from '@/app/recoilStates';

export default function App({ params }) {
  const id = params.id[0];
  return <RecoilRoot>
    <InnerContent id={id} />
  </RecoilRoot>;
}

function InnerContent({ id }) {
  const url = 'https://api.spotify.com/v1';
  const [albumInfo, setAlbumInfo] = useState(null);
  const [access, setAccess] = useRecoilState(AccessToken);
  const [tracks, setTracks] = useState([]);
  const getAlbumInfos = async e => {
    await axios.get(`${url}/albums/${id}`, { headers: { Authorization: `Bearer ${access}` } })
      .then(e => {
        console.log(e.data);
        setAlbumInfo(e.data);
        setTracks(e.data.tracks.items);
        let TrackList = [];
        e.data.tracks.items.forEach(items => {
          TrackList.push(items.id);
        });
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
  return <>  <Navi />
    <S.AlbumInfos>
      <div className='header'>
        <img src={albumInfo?.images[1].url} alt='img' />
        <div className='description'>
          <h1>{albumInfo?.name}</h1>
          <div className='information'>
            {albumInfo?.artists.map((i, n) => <Link key={n} href={`/artist/${i?.id}`}>{i.name}</Link>)}
            <span>{albumInfo?.tracks.items.length}곡</span>&nbsp;&nbsp;
            <span>{albumInfo?.release_date.substr(0, 4)}년</span>
          </div>
        </div>
      </div>
      <div className='tracks'>
        {tracks?.map((i, n) => <PlaylistAtom index={n} preview={i?.preview_url} playingtime={i?.duration_ms} key={n} album={i?.album} img={i?.album?.images[2].url} type={i?.type}
          id={i?.id} title={i?.name} artist={i?.artists} artistId={i?.artists[0]?.id} isInPlay={e => {
            let list = [];
            list = JSON.parse(localStorage.getItem('list'));
            if (list === null) {
              list = [];
            }
            return list.find(a => a === i?.id)
          }} />)}
      </div>
      <div className='end'>
        <h3>End</h3>
      </div>
    </S.AlbumInfos>
  </>
}