'use client'
import * as S from './style';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Player from '../player';
import { useRecoilState } from 'recoil';
import { AccessToken, NowPlayingId } from '@/app/recoilStates';

export default function Navi() {
  const [activating, setActivating] = useState(false);
  const [id, setId] = useRecoilState(NowPlayingId);
  const [access, setAccess] = useRecoilState(AccessToken);
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
  const refreshAll = e => {
    if (new Date().getTime() >= localStorage.getItem('expire') || !localStorage.getItem('access')) {
      refresh_token();
    }
    if (new Date().getTime() >= localStorage.getItem('user_exp') && localStorage.getItem('user_refresh')) {
      user_refresh();
    }
  }
  useEffect(e => {
    refreshAll();
    if (access !== '') {
      setId(localStorage.getItem('now_playing_id'));
    } else {
      setAccess(localStorage.getItem('access'));
    }
    const timer = setInterval(e => {
      refreshAll();
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
        {!localStorage.getItem('user_nickname') && <p><Link href={'/mytrack'}>My Tracks</Link></p>}
        {localStorage.getItem('user_nickname') ? <><p>
          <Link href={'/myprofile'}>{localStorage.getItem('user_nickname')}{localStorage.getItem('user_nickname').slice(-1) !== 's' ? "'s" : "'"} profile&tracks</Link>
        </p>
          <p onClick={e => {
            if (!confirm('Do you want to log out here?')) {
              return;
            }
            localStorage.clear();
            window.location.href = '/';
          }}><Link href='#'>Log out</Link></p>
        </> : <p><Link href={'/login'}>Login / Sign up</Link></p>}
        <p><Link href={'https://github.com/kimgh06/Freetify'}>View Sources</Link></p>
      </div>}
    </S.Nav >
    {id && <Player />}
  </>;
}