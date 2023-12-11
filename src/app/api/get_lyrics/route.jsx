import axios from "axios";
import { NextResponse } from "next/server";
const api = process.env.NEXT_PUBLIC_MUSIXMATCH_TOKEN
const baseURL = 'https://api.musixmatch.com/ws/1.1'

export async function POST(req, res) {
  const { isrc } = await req.json()
  const id = await getTrackCommonId(isrc)
  const lyrics = await getLyrics(id)
  const sync = await getSync(id)
  return NextResponse.json({ lyrics, sync });
}

const getTrackCommonId = async isrc => {
  return await axios.get(`${baseURL}/track.get?track_isrc=${isrc}&apikey=${api}`).then(e => {
    // console.log(e.data)
    return e.data.message.body.track.track_id;
  }).catch(e => {
    return e
  })
}
const getLyrics = async id => {
  return await axios.get(`${baseURL}/track.lyrics.get?track_id=${id}&apikey=${api}`).then(e => {
    return e.data
  }).catch(e => {
    return e;
  })
}

const getSync = async id => {
  return await axios.get(`${baseURL}/track.richsync.get?track_id=${id}&apikey=${api}`).then(e => {
    return e.data
  }).catch(e => {
    return e;
  })
}