"use client";
import axios from 'axios';
import * as S from './style';
import { useState } from "react";

export default function App() {
  const [mode, setMode] = useState('login');
  const [verified, setVerified] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [repw, setRepw] = useState('');
  return <>
    <S.Back>
      <S.Form onSubmit={async e => {
        e.preventDefault()
        if (e.nativeEvent.submitter === document.querySelector('.verifying')) {
          if (!verified) {
            if (!email) {
              alert('Enter your email');
              return;
            }
            await axios.post('/api/verifyingemail', { email }).then(e => {
              console.log(e.data);
              setVerified(e.data.code)
            }).catch(e => {
              console.log(e)
            })
            return;
          }
          if (typeof verified === 'string') {
            if (verified !== verifyCode) {
              alert("Your answer is not corrected")
              return;
            }
            alert("Corrected!");
            setVerified(true);
            return;
          }
        }
        switch (mode) {
          case 'login':
            if (!email || !pw) {
              alert('Enter your information');
              return;
            }
            const { data } = await axios.post('/api/login', { email, pw });
            if (data['status'] === 200) {
              console.log(data)
              localStorage.setItem('user_access', data['AccessToken'])
              localStorage.setItem('user_exp', data['exp'])
              localStorage.setItem('user_nickname', data['nickname'])
              // window.location.href = '/';
              return;
            }
            if (data['status'] === 404) {
              alert('Failed to find your account. Check your information.');
              return;
            }
            if (data['status'] === 500) {
              alert('Server Error. Try again later.')
              return;
            }
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
        <input onChange={e => setEmail(e.target.value)} value={email} placeholder='EMAIL' />
        {mode !== 'login' && <>
          {typeof verified === 'string' && <input onChange={e => setVerifyCode(e.target.value)} value={verifyCode} />}
          {verified !== true ? <button className='verifying'>VERIFYING EMAIL</button> : <div className='verified'>VERIFIED</div>}
        </>}
        <input onChange={e => setPw(e.target.value)} placeholder={`${mode === 'missing' ? 'NEW ' : ''}PASSWORD`} />
        {mode !== 'login' && <input placeholder='CHECK PASSWORD'
          onChange={e => setRepw(e.target.value)}
          value={repw}
        />}
        <button>SUBMIT</button>
      </S.Form>
    </S.Back>
  </>;
}