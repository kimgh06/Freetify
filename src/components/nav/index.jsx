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
  const [refreshToken, setRefreshToken] = useRecoilState(AccessToken);
  const refresh_token = async e => {
    await axios.patch(`/api/refresh_token`,
      { refreshToken: localStorage.getItem('refresh') }).then(e => {
        const info = e.data;
        if (!info?.error) {
          localStorage.setItem('access', info.access_token);
          localStorage.setItem('expire', new Date().getTime() + info.expires_in * 1000);
          setRefreshToken(info.access_token);
        }
      }).catch(e => {
        console.log(e);
      })
  }
  useEffect(e => {
    if (new Date().getTime() >= localStorage.getItem('expire')) {
      refresh_token();
    }
    else if (refreshToken !== '') {
      setId(localStorage.getItem('now_playing_id'));
    } else {
      setRefreshToken(localStorage.getItem('access'));
    }
  }, [refreshToken]);
  return <>
    <S.Nav>
      <div className={'menu ' + activating} onClick={e => setActivating(a => !a)}>三</div>
      {activating && <div className='nav'>
        <p><Link href={'/login'}>Spotify 로그인</Link></p>
        <p><Link href={'/myprofile'}>프로필</Link></p>
        <p><Link href={'/search'}>검색</Link></p>
        <p><Link href={'/'}>home</Link></p>
      </div>}
    </S.Nav>
    {id && <Player />}
  </>;
}