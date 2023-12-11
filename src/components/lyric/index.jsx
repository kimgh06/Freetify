"use client"
import axios from "axios"
import { useEffect } from "react"

export default function Lyric({ isrc }) {
  const getTrackId = async e => {
    await axios.post(`/api/get_lyrics/`, { isrc }).then(e => {
      console.log(e.data)
    }).catch(e => {
      console.log(e)
    })
  }
  useEffect(e => {
    console.log(isrc)
    getTrackId()
  }, [])
  return <>

  </>
}