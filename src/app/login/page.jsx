"use client";
import { useEffect } from "react";

export default function asdf() {
  const generateRandomString = (num) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }
  useEffect(e => {
    const SpotifyClientId = "267348cebe4641798a27705a51f66395";
    const redirectUrl = 'http://localhost:3003';
    const state = generateRandomString(16);
    const scope = '';
    window.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${SpotifyClientId}&scope=${scope}&redirect_uri=${redirectUrl}&state=${state}`;
  }, []);
  return <></>;
}