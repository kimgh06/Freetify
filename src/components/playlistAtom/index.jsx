"use client"
import axios from 'axios';
import * as S from './style';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRecoilState } from 'recoil';
import { AddbuttonIndex, NowPlayingId } from '@/app/recoilStates';

const url = 'https://api.spotify.com/v1';

export default function PlaylistAtom({ index, img, title, artist, id, type, playingtime, artistId, isInPlay, album, paramId }) {
  const [toggle, setToggle] = useState(isInPlay);
  const [clicked, setClicked] = useRecoilState(AddbuttonIndex);
  const [input, setInput] = useState(false);
  const [allList, setAllList] = useState([{}]);
  const [now_playing_id, setNow_playing_id] = useRecoilState(NowPlayingId);
  const getMusicAnalsisData = async e => {
    await axios.get(`${url}/audio-analysis/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } }).then(e => {
      console.log(e.data);
    }).catch(e => {
      console.log(e);
    });
  }
  const putPlaylist = async playlist => {
    await axios.put('/api/playlist/', { playlist: playlist, song_id: id },
      { headers: { 'Authorization': localStorage.getItem('user_access') } })
      .then(e => {
        console.log(e.data);
        getAllPlaylist();
      }).catch(e => {
        console.log(e)
      })
  }
  const deletePlaylist = async playlist => {
    await axios.delete('/api/playlist/', {
      headers: { 'Authorization': localStorage.getItem('user_access') },
      data: {
        playlist: playlist,
        song_id: id
      }
    })
      .then(e => {
        console.log(e.data);
        getAllPlaylist()
      }).catch(e => {
        console.log(e)
      })
  }
  const listcontrol = async e => {
    if (type === 'track') {
      let list = JSON.parse(localStorage.getItem('list'));
      if (list === null) {
        list = [];
      }
      if (!toggle) {
        list.push(id);
      } else if (toggle) {
        list = list.filter(track => track !== id);
      }
      localStorage.setItem('list', JSON.stringify(list));
      setToggle(a => !a);
    }
  }
  const getAllPlaylist = async e => {
    await axios.get(`/api/playlist?id=${id}`, { headers: { 'Authorization': localStorage.getItem('user_access') } })
      .then(e => {
        setAllList(e.data.res);
      }).catch(e => {
        console.log(e);
      })
  }
  useEffect(e => {
    if (clicked === index) {
      getAllPlaylist();
    }
    setInput(false)
  }, [clicked])
  return <S.PlayAtom>
    <img src={img} alt="" onClick={e => {
      getMusicAnalsisData();
    }} />
    <div>
      <div className='hea'>
        <Link id={title} className={`title ${paramId && 'orange'}`} href={album ? `/album/${album?.id}#${title}` : (type === 'playlist' ? `/playlist/${artist}?playlist=${id}` : `#${title}`)} >{title}</Link>&nbsp;
        {playingtime && <div className="playingtime">{`${(playingtime - playingtime % 60000) / 60000}:${((playingtime % 60000 - (playingtime % 60000) % 1000) / 1000).toString().padStart(2, '0')}`}</div>}
      </div>
      <div className='foo'>
        <Link className="artist" href={type === 'playlist' ? '#' : `/artist/${artistId}`}>{type === 'playlist' ? artist : artist[0].name}{type === 'track' && artist.length > 1 && `+${artist.length - 1}`}</Link>
        <button onClick={e => {
          navigator.clipboard.writeText(`https://freetify.vercel.app/album/${album?.id}#${title}`);
          alert(title + ' Copied');
        }}>C</button>
      </div>
    </div>
    {type === 'track' && <div className='audio'>
      <button onClick={e => {
        setNow_playing_id(id);
        const path = window.location.pathname;
        if (path === '/search') {
          localStorage.setItem('now_index_in_tracks', 0);
          return;
        }
        localStorage.setItem('now_index_in_tracks', index);
      }}>{now_playing_id === id ? '⏸' : '▶'}</button>
      {type === "track" && <div className='isInPlay'>
        <span onClick={e => {
          if (!localStorage.getItem('user_access')) {
            listcontrol()
            return;
          }
          if (clicked === index) {
            setClicked(false);
            return;
          }
          setClicked(index);
        }}>{toggle ? '-' : '+'}</span>
        {clicked === index && <div className='floating'>
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
        </div>}
      </div>}
    </div>}
  </S.PlayAtom>;
}
