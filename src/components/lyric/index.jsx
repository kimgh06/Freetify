"use client"
import axios from "axios"
import { useEffect, useState } from "react"

export default function Lyric({ isrc }) {
  const [lyrics, setLyrics] = useState('');
  const getTrackId = async e => {
    await axios.post(`/api/get_lyrics/`, { isrc }).then(e => {
      console.log(e.data)
      console.log(e.data.lyrics)
      setLyrics(e.data.lyrics);
    }).catch(e => {
      console.log(e)
    })
  }
  useEffect(e => {
    console.log(isrc)
    getTrackId()
  }, [])
  return <>
    {/* {lyrics} */}
  </>
}