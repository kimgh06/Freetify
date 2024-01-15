import ytdl from "ytdl-core";
import { NextResponse } from "next/server";
import youtubesearchapi from 'youtube-search-api';
import axios from "axios";
import jwt from "jsonwebtoken";
import { useQuery } from "@/app/useQuery";

async function getInfo(id, access) {
  return await axios.get(`https://api.spotify.com/v1/tracks/${id}?market=KR`,
    { headers: { Authorization: `Bearer ${access}` } })
    .then(async e => {
      return e.data;
    }).catch(e => {
      console.log(e, 'error at getInfo in get_video');
    });
}

async function AddsongStat(songId, user_id) {
  return await useQuery(`update song_stat set count = count+1 where song_id = '${songId}' and user_id = ${user_id || -1}`)
}

export async function GET(req, response) {
  const access = req.headers.get('Authorization')
  const user_access = req.headers.get('user_access') ? jwt.verify(req.headers.get('user_access'), process.env.NEXT_PUBLIC_AUTH_JWT_ACCESS_SECRET) : null;
  const q = new URLSearchParams(new URL(req?.url).search)
  let songId = q.get('songId');
  const user_id = user_access?.user_id
  let { err, res } = await useQuery(`insert into song_stat values('${songId}', ${user_id || -1},1,false)`)
  if (err?.errno === 1062) {
    const { err, res } = await AddsongStat(songId, user_id);
  }
  const info = await getInfo(songId, access);
  const playingtime = info?.duration_ms
  let release = info?.album.release_date?.substr(0, 4);
  let album = info?.album?.name
  let artist = info?.artists[0].name;
  let length = info.album.total_tracks;
  let title = info?.name;
  artist = artist.replace(/&/g, 'and').replace(/%20/g, " ").replace(/$/g, 's');
  artist = decodeURIComponent(artist)
  console.log(title, artist)
  //앨범 검색=> 트랙찾기
  let list = (await youtubesearchapi.GetListByKeyword(`${artist} ${album} album`, true, 20)).items;
  list = list.filter(item => item.type === "playlist" && item.length >= length && item.length <= 2 * length && item)
  let url;
  if (list.length != 0) {
    let playlist = await youtubesearchapi.GetPlaylistData(list[0].id, 100);
    let newTitle = title
      .replace(/\(/g, "")
      .replace(/\)/g, "")
      .replace(/-/g, "")
      .replace(/ /g, "")
      .toLowerCase()
    if (newTitle.indexOf('remastered') !== -1) {
      newTitle = newTitle.substr(0, newTitle.indexOf('remastered'))
    }
    for (let i = 0; i < playlist.items.length; i++) {
      const item = playlist.items[i];
      let asdf = item.title
        .replace(/\(/g, "")
        .replace(/\)/g, "")
        .replace(/ft. /g, "feat. ")
        .replace(/-/g, "")
        .replace(/ /g, "")
        .toLowerCase()
      if (asdf.indexOf(newTitle) !== -1 ||
        newTitle.indexOf(asdf) !== -1 ||
        asdf.indexOf(newTitle.replace(/8/g, '&')) !== -1) {
        console.log("found", item.title)
        url = item.id;
        break;
      }
    }
  }
  if (!url) {
    //싱글 앨범일 경우거나 못 찾았거나
    list = (await youtubesearchapi.GetListByKeyword(`${artist} ${title} lyrics`))
      .items.filter(e => {
        let duration
        if (e?.length?.simpleText) {
          duration = (parseInt(e.length.simpleText.split(':')[0]) * 60000 + parseInt(e.length.simpleText.split(':')[1] * 1000))
        }
        return e.type !== 'channel' && (duration ? duration < playingtime + 1000 : '')
      });
    console.log("can't found on playlists", list[0].title)
    url = list[0].id
  }

  try {
    if (url) {
      const stream = ytdl(`https://youtube.com/watch?v=${url}`, { filter: 'audioonly', quality: 'highestaudio', format: 'mp3' })
      const response = new Response(stream);
      response.headers.set('content-type', 'audio/mp3')
      response.headers.set('connection', 'keep-alive');
      console.log('complete to send datas')
      return response
    }
    throw "no datas"
  } catch (e) {
    return NextResponse.json({ err: e }, { status: 500 })
  }
}