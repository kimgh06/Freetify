"use client";
import Navi from "@/components/nav";
import * as S from './style';
import axios from "axios";
import { useEffect, useState } from "react";
import { RecoilRoot, useRecoilState } from "recoil";
import { AccessToken } from "../recoilStates";

export default function App() {
  return <RecoilRoot>
    <InnerComponent />
  </RecoilRoot>;
}

function InnerComponent() {
  const [infos, setinfos] = useState(null);
  const [access, setAccess] = useRecoilState(AccessToken);
  useEffect(e => {
    if (!localStorage.getItem('user_nickname')) {
      window.location.href = '/'
    }
  }, []);

  return <S.Profile>
    <Navi />
    <main>

    </main>
  </S.Profile>
}