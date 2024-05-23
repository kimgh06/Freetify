"use client"
import Navi from "@/components/nav";
import * as S from './style';
import { useEffect, useState } from "react";
import { RecoilRoot, useRecoilState } from "recoil";
import axios from "axios";
import { AccessToken } from "@/app/recoilStates";
import PlaylistAtom from "@/components/playlistAtom";
import { redirect } from "next/navigation";

export function PlaylistPage(props) {
  return <RecoilRoot>
    <PlaylistPages {...props} />
  </RecoilRoot>;
}

function PlaylistPages(props) {
  const [tracks, setTracks] = useState([]);
  const [originList, setOriginList] = useState([])
  const [access, setAccess] = useRecoilState(AccessToken);
  const [holding, setHolding] = useState(false);
  const [index, setIndex] = useState(false);
  const [clientY, setClientY] = useState(false);
  const [editName, setEditName] = useState(props.searchParams['playlist']);
  const [editMode, setEditMode] = useState(false);
  const getPlaylistAtoms = async e => {
    const nickname = props.params['id'][0], playlist = props.searchParams['playlist'];
    await axios.get(`/api/playlist/${nickname}/${playlist}`)
      .then(async e => {
        let ids = [];
        e.data.res.forEach(e => {
          ids.push(e.song_id)
        })
        ids = ids.join(',');
        let tr = await getTrackinfos(ids);
        if (!tr) {
          return;
        }
        setTracks(tr);
        setOriginList(tr)
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
    await axios.patch('/api/playlist', { items: localStorage.getItem('TrackList').split(','), playlist_id: props.searchParams['playlist'] },
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
  const EditPlaylistName = async (next) => {
    axios.post('/api/playlist', { previous: props.searchParams['playlist'], next }, {
      headers: {
        'Authorization': localStorage.getItem('user_access')
      }
    }).then(e => {
      console.log(e.data);
      const nickname = props.params['id'][0]
      window.location.href = `/playlist/${nickname}?playlist=${next}`;
    }).catch(e => {
      console.log(e)
    })
  }
  useEffect(e => {
    document.title = `${props.searchParams['playlist']} - ${props.params['id'][0]} }`;
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
  }, [clientY])
  useEffect(e => {
    //initialization
    getPlaylistAtoms()
    document.addEventListener('mouseup', e => {
      setHolding(false);
    })
    document.addEventListener('mousemove', e => setClientY(e.pageY))
    document.addEventListener('touchend', e => {
      setHolding(false);
    })
  }, [access, props])
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
    tracks.forEach(items => {
      if (news.indexOf(items.id) === -1) {
        news.push(items.id);
      }
    });
    localStorage.setItem('TrackList', `${news}`);
    patchItems();
    return e => document.removeEventListener('touchmove', func)
  }, [holding])
  return <S.Playlist>
    <Navi />
    <main>
      <h1>
        {
          !editMode ?
            <>
              {props.searchParams['playlist']} - {props.params['id'][0]}
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