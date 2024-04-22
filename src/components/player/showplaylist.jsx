import { NowPlayingId } from "@/app/recoilStates";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

export function ShowPlaylists() {
  const [id, _] = useRecoilState(NowPlayingId);
  const [input, setInput] = useState(false)
  const [allList, setAllList] = useState([{}]);

  const putPlaylist = playlist => {
    axios.put('/api/playlist/', { playlist: playlist, song_id: id },
      { headers: { 'Authorization': localStorage.getItem('user_access') } })
      .then(e => {
        console.log(e.data);
        getAllPlaylist();
      }).catch(e => {
        console.log(e)
      })
  }
  const deletePlaylist = playlist => {
    axios.delete('/api/playlist/', {
      headers: { 'Authorization': localStorage.getItem('user_access') },
      data: {
        playlist: playlist,
        song_id: id
      }
    }).then(e => {
      console.log(e.data);
      getAllPlaylist()
    }).catch(e => {
      console.log(e)
    })
  }
  const getAllPlaylist = () => {
    axios.get(`/api/playlist?id=${id}`, {
      headers: { 'Authorization': localStorage.getItem('user_access') }
    })
      .then(e => {
        setAllList(e.data.res);
      }).catch(e => {
        console.log(e);
      })
  }
  useEffect(e => {
    getAllPlaylist();
  }, [])
  return <div className='playlist_popup'>
    <div>
      <span onClick={e => {
        if (input === false) {
          setInput('')
        }
      }}>{input === false ? '+' : <>
        <input onChange={e => setInput(e.target.value)} value={input} autoFocus />
        <button onClick={e => {
          if (!input) {
            return;
          }
          putPlaylist(input);
          setInput(false);
        }}>+</button>
      </>}</span>
    </div>
    {allList?.map((i, n) => <div key={n}>
      <Link href={`/playlist/${localStorage.getItem('user_nickname')}?playlist=${i['playlist_id']}`}>{i['playlist_id']}</Link>
      <p onClick={e => {
        if (!i['exist']) {
          putPlaylist(i['playlist_id']);
        } else {
          deletePlaylist(i['playlist_id'])
        }
      }}>{!i['exist'] ? '+' : '-'}</p></div>)}
  </div>
}