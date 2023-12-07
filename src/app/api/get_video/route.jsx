import ytdl from "ytdl-core";
import { NextResponse } from "next/server";
import youtubesearchapi from 'youtube-search-api';
import axios from "axios";
import jwt from "jsonwebtoken";
import { useQuery } from "@/app/useQuery";

async function getInfo(id, access) {
  return await axios.get(`https://api.spotify.com/v1/tracks/${id}`,
    { headers: { Authorization: `Bearer ${access}` } })
    .then(async e => {
      return e.data;
    }).catch(e => {
      console.log(e);
    });
}

export async function GET(req, response) {
  const access = req.headers.get('Authorization')
  const user_access = req.headers.get('user_access') ? jwt.verify(req.headers.get('user_access'), process.env.NEXT_PUBLIC_AUTH_JWT_ACCESS_SECRET) : null;
  // if (Auth['exp'] < new Date().getTime()) {
  //   return NextResponse.json({ msg: 'Token is expired.' }, { status: 403 })
  // }
  const q = new URLSearchParams(new URL(req?.url).search)
  let songId = q.get('songId');
  const user_id = user_access?.user_id
  let { err, res } = await useQuery(`insert into song_stat values('${songId}', ${user_id || -1},0,false)`)
  if (err?.errno === 1062) {
    let { err, res } = await useQuery(`update song_stat set count = count+1 where song_id = '${songId}' and user_id = ${user_id || -1}`)
  }
  const info = await getInfo(songId, access);
  let album = info?.album?.name
  let artist = info?.artists[0].name;
  let length = info.album.total_tracks;
  let title = info?.name;
  title = title
    .replace(/\(/g, "")
    .replace(/\)/g, "")
    .replace(/-/g, "")
    .replace(/ /g, "")
    .toLowerCase()
  artist = artist.replace(/%20/g, " ");
  artist = decodeURIComponent(artist)
  console.log(title, artist)
  //앨범 검색=> 트랙찾기
  let list = (await youtubesearchapi.GetListByKeyword(`${album} album`, true, 20)).items;
  list = list.filter(item => item.type === "playlist" && item.length >= length && item)
  let url;
  if (list.length != 0) {
    let playlist = await youtubesearchapi.GetPlaylistData(list[0].id, 100);
    for (let i = 0; i < playlist.items.length; i++) {
      const item = playlist.items[i];
      let asdf = item.title
        .replace(/\(/g, "")
        .replace(/\)/g, "")
        .replace(/ft. /g, "feat. ")
        .replace(/-/g, "")
        .replace(/ /g, "")
        .toLowerCase()
      if (asdf.indexOf(title) !== -1 ||
        title.indexOf(asdf) !== -1 ||
        asdf.indexOf(title.replace(/8/g, '&')) !== -1) {
        console.log(title, "found")
        url = item.id;
        break;
      }
    }
  }
  if (!url) {
    //싱글 앨범일 경우거나 못 찾았거나
    list = (await youtubesearchapi.GetListByKeyword(`${artist} ${title} lyrics`)).items;
    console.log(list[0])
    url = list[0].id
  }

  try {
    if (url) {
      const stream = ytdl(`https://youtube.com/watch?v=${url}`, { filter: 'audioonly', quality: 'highestaudio', format: 'mp3' })
      const response = new Response(stream);
      response.headers.set('content-type', 'audio/mp3')
      response.headers.set('connection', 'keep-alive');
      return response
    }
    throw "no datas"
  } catch (e) {
    return NextResponse.json({ err: e }, { status: 500 })
  }
}