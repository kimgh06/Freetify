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
            alert("Corrected!")
            setVerified(true)
            return;
          }
          if (verified) {
            return;
          }
        }
        if (!verified) {
          alert('Please verify your Email');
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
        {mode !== 'login' && <>
          {typeof verified === 'string' && <input onChange={e => setVerifyCode(e.target.value)} />}
          {verified !== true ? <button className='verifying'>VERIFYING EMAIL</button> : <div className='verified'>VERIFIED</div>}
        </>}
        <input onChange={e => setPw(e.target.value)} placeholder={`${mode === 'missing' ? 'NEW ' : ''}PASSWORD`} />
        {mode !== 'login' && <input placeholder='CHECK PASSWORD'
          onChange={e => setRepw(e.target.value)}
        />}
        <button>SUBMIT</button>
      </S.Form>
    </S.Back>
  </>;
}