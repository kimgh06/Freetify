"use client";
import axios from 'axios';
import * as S from './style';
import { useState } from "react";

export default function App() {
  const [mode, setMode] = useState('login');
  const [verified, setVerified] = useState(false);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [repw, setRepw] = useState('');
  return <>
    <S.Back>
      <S.Form onSubmit={async e => {
        e.preventDefault()
        if (e.nativeEvent.submitter === document.querySelector('.verifying')) {
          await axios.post('/api/verifyingemail', { email }).then(e => {
            console.log(e.data);
          }).catch(e => {
            console.log(e)
          })
          return;
        }
        if (!verified) {
          alert('이메일 인증을 해주세요')
          return;
        }
        switch (mode) {
          case 'login':
            const { data } = await axios.post('/api/login', { nickname: email, pw })
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
        <input onChange={e => setEmail(e.target.value)} placeholder='EMAIL' />
        {mode !== 'login' && <button className='verifying'>VERIFYING EMAIL</button>}
        <input onChange={e => setPw(e.target.value)} placeholder={`${mode === 'missing' ? 'NEW ' : ''}PASSWORD`} />
        {mode !== 'login' && <input placeholder='CHECK PASSWORD'
          onChange={e => setRepw(e.target.value)}
        />}
        <button>SUBMIT</button>
      </S.Form>
    </S.Back>
  </>;
}