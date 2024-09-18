'use client'
import * as S from './style';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { RecoilRoot, useRecoilState } from 'recoil';
import { AccessToken, NowPlayingId } from '@/app/recoilStates';
import dynamic from 'next/dynamic';
import { PlaylistsStore } from '@/app/store';

const Player = dynamic(() => import('@/components/player'), { ssr: false });

export default function Navi() {
  const [activating, setActivating] = useState(false);
  const [id, setId] = useRecoilState(NowPlayingId);
  const [access, setAccess] = useRecoilState(AccessToken);
  const [todays, setToday] = useState(0);
  const [totals, setTotal] = useState(0);
  const { playlists, setPlaylists } = PlaylistsStore();
  const [username, setUsername] = useState('');

  const refresh_token = async e => {
    await axios.patch(`/api/refresh_token`,
      { refreshToken: process.env.NEXT_PUBLIC_REFRESH_TOKEN }).then(e => {
        const info = e.data;
        if (!info?.error) {
          localStorage.setItem('access', info.access_token);
          localStorage.setItem('expire', new Date().getTime() + info.expires_in * 1000);
          setAccess(info.access_token);
        }
      }).catch(e => {
        console.log(e);
      })
  }
  const visit = async e => {
    const { today, total } = await axios.get('/api/visit').then(e => {
      return e.data.cnt
    }).catch(e => {
      console.log(e)
      return 0;
    })
    setToday(today);
    setTotal(total);
  }
  const user_refresh = async e => {
    await axios.patch('/api/login', {}, { headers: { 'Authorization': localStorage.getItem('user_refresh') } })
      .then(e => {
        const data = e.data;
        localStorage.setItem('user_access', data['AccessToken'])
        localStorage.setItem('user_refresh', data['RefreshToken'])
        localStorage.setItem('user_exp', data['exp'])
      }).catch(e => {
        if (e.response.status === 403) {
          localStorage.removeItem('user_exp')
          localStorage.removeItem('user_access')
          localStorage.removeItem('user_nickname')
          localStorage.removeItem('user_refresh')
        }
      })
  }
  const refreshAll = timer => {
    if (new Date().getTime() >= localStorage.getItem('expire') || !localStorage.getItem('access')) {
      refresh_token();
      clearInterval(timer);
    }
    if (new Date().getTime() >= localStorage.getItem('user_exp') && localStorage.getItem('user_refresh')) {
      user_refresh();
    }
  }

  const getAllPlaylist = async () => {
    try {
      const response = await axios.get('/api/playlist', {
        headers: {
          'Authorization': localStorage.getItem('user_access')
        }
      });
      setPlaylists(response.data.res);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };
  useEffect(e => {
    visit();
    refreshAll();
    getAllPlaylist();
    const nickname = localStorage.getItem('user_nickname');
    if (nickname) {
      setUsername(nickname);
    }
    if (access !== '') {
      setId(localStorage.getItem('now_playing_id'));
    } else {
      setAccess(localStorage.getItem('access'));
    }
    const timer = setInterval(e => {
      refreshAll(timer);
    }, 2 * 1000);
    if (typeof window !== undefined) {
      setActivating(window.innerWidth >= 1200 ? true : false)
    }
  }, [access]);
  return <>
    <S.Nav>
      <div className={'menu ' + activating} onClick={e => setActivating(a => !a)}>
        <div className='bar' />
        <div className='bar' />
        <div className='bar' />
      </div>
      {activating && <div className='nav'>
        <p><Link href={'/'}>Recommendations</Link></p>
        <p><Link href={'/search'}>Search</Link></p>
        <p><Link href={'/recent'}>Recent Tracks</Link></p>
        {!username && <p><Link href={'/mytrack'}>My Tracks</Link></p>}
        {username ? <>
          <p>
            <Link href={'/myprofile'}>{username}{username.slice(-1) !== 's' ? "'s" : "'"} profile&tracks</Link>
          </p>
          <ul>
            My Playlists
            {playlists.length > 0
              ? playlists.map((i, n) => (
                <li key={i.playlist_id}>
                  <Link href={`/playlist/${username}?playlist=${i.playlist_id}`} key={n}>
                    {i.playlist_id}
                  </Link>
                </li>
              ))
              : <li>Loading</li>}
          </ul>
          <p onClick={e => {
            if (!confirm('Do you want to log out here?')) {
              return;
            }
            localStorage.clear();
            window.location.href = '/';
          }}>
            <Link href='#'>Log out</Link>
          </p>
        </> : <p><Link href={'/login'}>Login / Sign up</Link></p>}

        <p><Link href={'https://github.com/kimgh06/Freetify'}>View Sources</Link></p>
        <p>today:{todays}/total:{totals}</p>
      </div>}
    </S.Nav>
    {id && <Player />}</>;
}