"use client";
import { useEffect } from "react";

export default function App() {
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
    const SpotifyClientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENTID;
    const redirectUrl = process.env.NEXT_PUBLIC_BACKEND_REDIRECT_URL;
    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email user-top-read user-follow-read streaming app-remote-control user-read-playback-state';
    window.location.href = '/'
    // window.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${SpotifyClientId}&scope=${scope}&redirect_uri=${redirectUrl}&state=${state}`;
  }, []);
  return <></>;
}