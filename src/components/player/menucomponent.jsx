import { AddbuttonIndex } from "@/app/recoilStates";
import { useState } from "react";
import { useRecoilState } from "recoil";
import * as S from './style';
import { ShowPlaylists } from "./showplaylist";

export function MenuComponent({ albumId, title }) {
  const [mode, setMode] = useState('');
  const [_, setPopup] = useRecoilState(AddbuttonIndex);
  return <>
    {mode === '' && <S.MenuComponent>
      <div className='button' onClick={e => {
        let url = `https://freetify.vercel.app/album/`
        url += `${encodeURIComponent(`${albumId}`)}#${encodeURIComponent(`${title}`)}`
        navigator.clipboard.writeText(url);
        alert(title + ' Copied.')
        setPopup('')
      }}>Copy the Url!</div>
      <div className='button' onClick={e => setMode('playlist')}>Setting Playlists</div>
    </S.MenuComponent>}
    {mode === 'playlist' && <ShowPlaylists />}
  </>
}
