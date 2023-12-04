"use client";
import axios from 'axios';
import * as S from './style';
import { useEffect, useState } from "react";

export default function App() {
  const [mode, setMode] = useState('login');
  const [verified, setVerified] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [repw, setRepw] = useState('');
  useEffect(e => {
    setVerified(false);
  }, [email]);
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
            await axios.post('/api/login', { email, pw })
              .then(e => {
                const data = e.data;
                console.log(data)
                localStorage.setItem('user_access', data['AccessToken'])
                localStorage.setItem('user_exp', data['exp'])
                localStorage.setItem('user_nickname', data['nickname'])
                window.location.href = '/';
              }).catch(e => {
                alert(e.response.data.msg);
                return;
              })
            break;
          case 'signup':
            if (!email || !pw || !repw || !nickname) {
              alert('Enter your information');
              return;
            }
            if (pw !== repw) {
              alert('Passwords are not correspond.');
              return;
            }
            await axios.post('/api/signup', { email, pw, nickname })
              .then(e => {
                setMode('login')
              })
              .catch(e => {
                alert(e.response.data.msg)
                return e
              })
            break;
          case 'missing':
            if (!email || !pw || !repw || !nickname) {
              alert('Enter your information');
              return;
            }
            if (pw !== repw) {
              alert('Passwords are not correspond.');
              return;
            }
            await axios.patch('/api/missingpw', { email, pw })
              .then(e => {
                console.log(e.data);
                setMode('login')
              }).catch(e => {
                console.log(e)
              })
            break;
        }
      }}>
        <S.Navigators>
          <div onClick={e => setMode('login')} className={mode === 'login' ? 'active' : ''}>Login</div>
          <div onClick={e => setMode('signup')} className={mode === 'signup' ? 'active' : ''}>Sign up</div>
          <div onClick={e => setMode('missing')} className={mode === 'missing' ? 'active' : ''}>Missing pw</div>
        </S.Navigators>
        <h1>Freetify</h1>
        {mode === 'signup' && <input onChange={e => setNickname(e.target.value)} value={nickname} placeholder='NICKNAME' />}
        <input onChange={e => setEmail(e.target.value)} value={email} placeholder='EMAIL' type='email' />
        {mode !== 'login' && <>
          {typeof verified === 'string' && <input onChange={e => setVerifyCode(e.target.value)} placeholder='CHECK YOUR EMAILBOX' value={verifyCode} />}
          {verified !== true ? <button className='verifying'>VERIFYING EMAIL</button> : <div className='verified'>VERIFIED</div>}
        </>}
        <input onChange={e => setPw(e.target.value)} value={pw}
          type='password'
          placeholder={`${mode === 'missing' ? 'NEW ' : ''}PASSWORD`} />
        {mode !== 'login' && <input placeholder='CHECK PASSWORD'
          onChange={e => setRepw(e.target.value)}
          value={repw} type='password'
        />}
        <button>SUBMIT</button>
      </S.Form>
    </S.Back>
  </>;
}