"use client";
import Script from "next/script";
import { useEffect } from "react";

export default function asdf() {
  let player;
  useEffect(e => {
    window.onSpotifyWebPlaybackSDKReady = e => {
      const token = '267348cebe4641798a27705a51f66395';
      player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
      });
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });
      player.addListener('initialization_error', ({ message }) => {
        console.error(message);
      });

      player.addListener('authentication_error', ({ message }) => {
        console.error(message);
      });

      player.addListener('account_error', ({ message }) => {
        console.error(message);
      });
      player.connect();
    };
  }, []);
  return <>
    <Script src="https://sdk.scdn.co/spotify-player.js" />
    <button id="togglePlay" onClick={e => {
      player.togglePlay();
    }}>Toggle Play</button>
  </>;
}