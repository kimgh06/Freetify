"use client"
import Navi from "@/components/nav";
import * as S from './style';
import { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";
import axios from "axios";
import PlaylistAtom from "@/components/playlistAtom";

export function PlaylistPage({ trackss, ...props }) {
  return <RecoilRoot>
    <PlaylistPages {...props} trackss={trackss} />
  </RecoilRoot>;
}

function PlaylistPages({ trackss, ...props }) {
  const playlistName = props.searchParams['playlist'];
  const nickname = props.params['id'][0];
  const [tracks, setTracks] = useState([]);
  const [originList, setOriginList] = useState([])
  const [holding, setHolding] = useState(false);
  const [index, setIndex] = useState(false);
  const [clientY, setClientY] = useState(false);
  const [editName, setEditName] = useState(playlistName);
  const [editMode, setEditMode] = useState(false);
  const patchItems = async e => {
    await axios.patch('/api/playlist',
      { items: localStorage.getItem('TrackList').split(','), playlist_id: playlistName },
      { headers: { 'Authorization': localStorage.getItem('user_access') } }
    ).catch(e => {
      console.log(e)
    })
  }
  const EditPlaylistName = async (next) => {
    axios.post('/api/playlist', { previous: playlistName, next }, {
      headers: {
        'Authorization': localStorage.getItem('user_access')
      }
    }).then(e => {
      window.location.href = `/playlist/${nickname}?playlist=${next}`;
    }).catch(e => {
      console.log(e)
    })
  }
  useEffect(e => {
    if (holding) {
      const boxs = document.querySelectorAll(`.box`)
      let max = index;
      let tempTrList = [...tracks];
      if (!tempTrList) {
        return;
      }
      for (let i = 0; i < tempTrList.length; i++) {
        const location = boxs[i].getBoundingClientRect().top + window.pageYOffset
        if (clientY > location) {
          max = i
        }
      }
      const t = tempTrList[index];
      tempTrList[index] = tempTrList[max]
      tempTrList[max] = t;
      setIndex(max)
      setTracks(tempTrList)
      return;
    }
    if (clientY !== false) {
      return;
    }
  }, [clientY]);

  useEffect(e => {
    //initialization
    document.title = `${playlistName} - ${nickname} }`;
    document.addEventListener('mouseup', e => {
      setHolding(false);
    })
    document.addEventListener('mousemove', e => setClientY(e.pageY))
    document.addEventListener('touchend', e => {
      setHolding(false);
    })

    const tr = trackss;
    let TrackList = [];
    console.log(tr)
    if (tr.length === 0) {
      document.location.reload();
    }
    tr.forEach(items => {
      if (TrackList.indexOf(items.id) === -1) {
        TrackList.push(items.id);
      }
    });
    localStorage.setItem('TrackList', `${TrackList}`);
    setTracks(tr);
    setOriginList(tr)
  }, [playlistName, nickname]);

  useEffect(e => {
    const func = e => {
      holding && e.preventDefault()
      setClientY(e.changedTouches[0].pageY)
    }
    document.addEventListener('touchmove', func, { passive: false })
    if (holding || !clientY) {
      return e => document.removeEventListener('touchmove', func);
    }
    if (JSON.stringify(tracks) === JSON.stringify(originList)) { //nothing change
      console.log('nothing change')
      return e => document.removeEventListener('touchmove', func);
    }
    setOriginList(tracks);
    let news = []
    if (tracks.length) {
      tracks.forEach(items => {
        if (news.indexOf(items.id) === -1) {
          news.push(items.id);
        }
      });
    }
    localStorage.setItem('TrackList', `${news}`);
    patchItems();
    return e => document.removeEventListener('touchmove', func)
  }, [holding]);

  return <S.Playlist>
    <Navi />
    <main>
      <h1>
        {
          !editMode ?
            <>
              {playlistName} - {nickname}
              <button onClick={e => setEditMode(true)}>Change Playlist Name</button>
            </> :
            <>
              <input value={editName} onChange={e => setEditName(e.target.value)} />
              <button onClick={e => EditPlaylistName(editName)}>
                Set Playlist
              </button>
              <button onClick={e => setEditMode(false)}>
                Cancel
              </button>
            </>
        }
      </h1>
      {tracks?.length !== 0 && tracks?.map((i, n) => <div className={`box ${n}`} style={holding === i ? {
        visibility: 'hidden'
      } : {}} key={n}>
        <div className="hold" onMouseDown={e => {
          setHolding(i); setIndex(n);
        }}
          onTouchStart={e => {
            setHolding(i); setIndex(n); setClientY(e.changedTouches[0].pageY)
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