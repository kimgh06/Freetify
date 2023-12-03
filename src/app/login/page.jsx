"use client";
import axios from 'axios';
import * as S from './style';
import { useState } from "react";

export default function App() {
  const [mode, setMode] = useState('login');
  const [nickname, setNickname] = useState('');
  const [pw, setPw] = useState('');
  const [repw, setRepw] = useState('');
  return <>
    <S.Back>
      <S.Form onSubmit={async e => {
        e.preventDefault()
        switch (mode) {
          case 'login':
            const { data } = await axios.post('/api/login', { nickname, pw })
            console.log(data)
            break;
          case 'signup':
            break;
          case 'missing':
            break;
        }
      }}>
        <S.Navigators>
          <div onClick={e => setMode('login')} className={mode === 'login' ? 'active' : ''}>Login</div>
          <div onClick={e => setMode('signup')} className={mode === 'signup' ? 'active' : ''}>Sign up</div>
          <div onClick={e => setMode('missing')} className={mode === 'missing' ? 'active' : ''}>Missing pw</div>
        </S.Navigators>
        <h1>Freetify</h1>
        <input onChange={e => setNickname(e.target.value)} placeholder='NiCKNAME' />
        <input onChange={e => setPw(e.target.value)} placeholder={`${mode === 'missing' ? 'NEW ' : ''}PASSWORD`} />
        {mode !== 'login' && <input placeholder='CHECK PASSWORD'
          onChange={e => setRepw(e.target.value)}
        />}
        <button>SUBMIT</button>
      </S.Form>
    </S.Back>
  </>;
}