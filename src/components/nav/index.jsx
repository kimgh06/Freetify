'use client'
import Link from 'next/link';
import * as S from './style';
import { useEffect, useState } from 'react';

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Navi() {
  const [activating, setActivating] = useState(false);
  const refresh_token = async e => {
    await axios.patch(`${url}/refresh_token`,
      { refreshToken: localStorage.getItem('refresh') }).then(e => {
        const info = e.data;
        if (!info?.error) {
          localStorage.setItem('access', info.access_token);
          localStorage.setItem('expire', new Date().getTime() + info.expires_in * 1000);
        }
      }).catch(e => {
        console.log(e);
      })
  }
  useEffect(e => {
    if (new Date().getTime() >= localStorage.getItem('expire')) {
      refresh_token();
    }
  }, [])
  return <S.Nav>
    <button className='menu' onClick={e => setActivating(a => !a)}>三</button>
    {activating && <div className='nav'>
      <p><Link href={'/login'}>Spotify 로그인</Link></p>
      <p><Link href={'/myprofile'}>프로필</Link></p>
      <p><Link href={'/search'}>검색</Link></p>
      <p><Link href={'/login'}>Spotify 로그인</Link></p>
    </div>
    }
  </S.Nav>;
}