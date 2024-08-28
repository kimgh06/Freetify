"use client"

import Navi from '@/components/nav';
import * as S from './style';
import Link from 'next/link';
import PlaylistAtom from '@/components/playlistAtom';
import { RecoilRoot } from 'recoil';
export function InnerContent({ albumInfo, tracks, totalDuration, TrackList }) {
  // const [albumInfo, setAlbumInfo] = useState(null);
  // const [totalDuration, setTotalDuration] = useState('0');
  // const [tracks, setTracks] = useState([]);
  if (typeof window === 'undefined') {
    return;
  }
  document.title = albumInfo.name;
  localStorage.setItem('TrackList', `${TrackList}`);
  const paramId = decodeURIComponent(window.location.href.split('#')[1])
  return <>
    <RecoilRoot>
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
    </RecoilRoot>
  </>
}