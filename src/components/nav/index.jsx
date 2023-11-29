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
  useEffect(e => {
    if (new Date().getTime() >= localStorage.getItem('expire') || !localStorage.getItem('access')) {
      refresh_token();
    }
    else if (access !== '') {
      setId(localStorage.getItem('now_playing_id'));
    } else {
      setAccess(localStorage.getItem('access'));
    }
    const timer = setInterval(e => {
      if (new Date().getTime() >= localStorage.getItem('expire')) {
        refresh_token();
      }
    }, 20 * 1000);
  }, [access]);
  return <>
    <S.Nav>
      <div className={'menu ' + activating} onClick={e => setActivating(a => !a)}>
        <div className='bar' />
        <div className='bar' />
        <div className='bar' />
      </div>
      {activating && <div className='nav'>
        {/* <p><Link href={'/login'}>Spotify 로그인</Link></p> */}
        {/* <p><Link href={'/myprofile'}>프로필</Link></p> */}
        <p><Link href={'/search'}>Search</Link></p>
        <p><Link href={'/'}>Recommendations</Link></p>
        <p><Link href={'/mytrack'}>My Tracks</Link></p>
        <p><Link href={'/recent'}>Recent Tracks</Link></p>
      </div>}
    </S.Nav>
    {id && <Player />}
  </>;
}