"use client"
import Navi from "@/components/nav";
import * as S from './style';
import { useEffect, useState } from "react";
import { RecoilRoot, useRecoilState } from "recoil";
import axios from "axios";
import { AccessToken, AddbuttonIndex } from "@/app/recoilStates";
import PlaylistAtom from "@/components/playlistAtom";

export default function App(props) {
  return <RecoilRoot>
    <PlaylistPage {...props} />
  </RecoilRoot>;
}

function PlaylistPage(props) {
  const [tracks, setTracks] = useState([]);
  const [access, setAccess] = useRecoilState(AccessToken);
  const [add, setAdd] = useRecoilState(AddbuttonIndex);
  const [holding, setHolding] = useState(false);
  const [clientY, setClientY] = useState(0);
  const getPlaylistAtoms = async e => {
    await axios.post(`/api/playlist`, { nickname: props.params['id'][0], playlist: props.searchParams['playlist'] },
      { headers: { 'Authorization': localStorage.getItem('user_access') } })
      .then(async e => {
        let ids = [];
        e.data.res.forEach(e => {
          ids.push(e.song_id)
        })
        ids = ids.join(',');

        let tr = await getTrackinfos(ids);
        setTracks(tr);
        let TrackList = [];
        tr.forEach(items => {
          if (TrackList.indexOf(items.id) === -1) {
            TrackList.push(items.id);
          }
        });
        localStorage.setItem('TrackList', `${TrackList}`);
      }).catch(e => {
        console.log(e);
      })
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
  useEffect(e => {
    document.title = props.searchParams['playlist']
    getPlaylistAtoms()
    document.addEventListener('mouseup', e => setHolding(false))
    document.addEventListener('mousemove', e => setClientY(e.pageY))
  }, [props, add])
  return <S.Playlist>
    <Navi />
    <main>
      <h1>
        {props.params['id'][0]} - {props.searchParams['playlist']}
      </h1>
      {tracks?.length !== 0 && tracks?.map((i, n) => <div className="box" style={holding === i ? {
        position: 'absolute',
        top: clientY - 40
      } : {}} key={n}>
        <div className="hold" onMouseDown={e => setHolding(i)}> </div>
        <PlaylistAtom index={n} preview={i?.preview_url} album={i?.album} playingtime={i?.duration_ms} key={n} img={i?.album.images[2].url} type={i?.type}
          id={i?.id} title={i?.name} artist={i?.artists} artistId={i?.artists[0].id} isInPlay={e => {
            let list = [];
            list = JSON.parse(localStorage.getItem('list'));
            if (list === null) {
              list = [];
            }
            return list.find(a => a === i?.id)
          }} />
      </div>)}
    </main>
    <S.PaddingBox />
  </S.Playlist>
}