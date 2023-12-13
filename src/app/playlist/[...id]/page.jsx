"use client"
import Navi from "@/components/nav";
import * as S from './style';
import { useEffect, useState } from "react";
import { RecoilRoot, useRecoilState } from "recoil";
import axios from "axios";
import { AccessToken } from "@/app/recoilStates";
import PlaylistAtom from "@/components/playlistAtom";

export default function App(props) {
  return <RecoilRoot>
    <PlaylistPage {...props} />
  </RecoilRoot>;
}

function PlaylistPage(props) {
  const [tracks, setTracks] = useState([]);
  const [access, setAccess] = useRecoilState(AccessToken);
  const [holding, setHolding] = useState(false);
  const [index, setIndex] = useState(false);
  const [clientY, setClientY] = useState(false);
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
  const patchItems = async e => {
    await axios.patch('/api/playlist', { items: localStorage.getItem('TrackList').split(',') },
      {
        headers: {
          'Authorization': localStorage.getItem('user_access')
        }
      }).then(e => {
        console.log(e.data)
      }).catch(e => {
        console.log(e)
      })
  }
  useEffect(e => {
    if (holding) {
      const boxs = document.querySelectorAll(`.box`)
      let max = index;
      let tempTrList = [...tracks];
      for (let i = 0; i < tempTrList.length; i++) {
        const target = boxs[i]
        const location = target.getBoundingClientRect().top + window.pageYOffset
        if (clientY > location) {
          max = i
        }
      }
      const t = tempTrList[index];
      tempTrList[index] = tempTrList[max]
      tempTrList[max] = t;
      setIndex(max)
      setTracks(tempTrList)

      let news = []
      tempTrList.forEach(items => {
        if (news.indexOf(items.id) === -1) {
          news.push(items.id);
        }
      });
      localStorage.setItem('TrackList', `${news}`);
      return;
    }
    if (clientY !== false) {
      return;
    }
    getPlaylistAtoms()
    document.addEventListener('mouseup', e => {
      setHolding(false);
    })
    document.addEventListener('mousemove', e => setClientY(e.pageY))
    document.addEventListener('touchend', e => {
      setHolding(false);
    })
    document.addEventListener('touchmove', e => {
      setClientY(e.changedTouches[0].pageY)
    })
  }, [clientY, props])
  useEffect(e => {
    if (holding) {
      return;
    }
    patchItems();
  }, [holding])
  return <S.Playlist>
    <Navi />
    <main style={holding ? { position: 'fixed' } : {}}>
      <h1>
        {props.params['id'][0]} - {props.searchParams['playlist']}
      </h1>
      {tracks?.length !== 0 && tracks?.map((i, n) => <div className={`box ${n}`} style={holding === i ? {
        visibility: 'hidden'
      } : {}} key={n}>
        <div className="hold" onMouseDown={e => {
          setHolding(i); setIndex(n);
        }}
          onTouchStart={e => {
            setHolding(i); setIndex(n);
          }}
        > </div>
        <PlaylistAtom style={holding === i ? {
          display: 'none'
        } : {}} index={n} preview={i?.preview_url} album={i?.album} playingtime={i?.duration_ms} key={n} img={i?.album.images[2].url} type={i?.type}
          id={i?.id} title={i?.name} artist={i?.artists} artistId={i?.artists[0].id} isInPlay={e => {
            let list = [];
            list = JSON.parse(localStorage.getItem('list'));
            if (list === null) {
              list = [];
            }
            return list.find(a => a === i?.id)
          }} />
      </div>)}
      {holding &&
        <div className={`box floating`} style={{
          position: 'absolute',
          top: clientY - 40
        }}>
          <div className="hold" > </div>
          <PlaylistAtom preview={holding?.preview_url} album={holding?.album} playingtime={holding?.duration_ms} img={holding?.album.images[2].url} type={holding?.type}
            id={holding?.id} title={holding?.name} artist={holding?.artists} artistId={holding?.artists[0].id} isInPlay={e => {
              let list = [];
              list = JSON.parse(localStorage.getItem('list'));
              if (list === null) {
                list = [];
              }
              return list.find(a => a === holding?.id)
            }} />
        </div>
      }
    </main>
    <S.PaddingBox />
  </S.Playlist>
}