import { NextResponse } from "next/server";
import youtubesearchapi from 'youtube-search-api';
import axios from "axios";
import jwt from "jsonwebtoken";
import Connection from "@/app/createConnection";
import ytdl from "@distube/ytdl-core";

async function getInfo(id, access) {
  return await axios.get(`https://api.spotify.com/v1/tracks/${id}?market=KR`,
    { headers: { Authorization: `Bearer ${access}` } })
    .then(async e => {
      return e.data;
    }).catch(e => {
      console.log(e, 'error at getInfo in get_video');
    });
}

export async function GET(req, response) {
  const access = req.headers.get('Authorization')
  const user_access = req.headers.get('user_access') ? jwt.verify(req.headers.get('user_access'), process.env.NEXT_PUBLIC_AUTH_JWT_ACCESS_SECRET) : null;
  const q = new URLSearchParams(new URL(req?.url).search)
  let songId = q.get('songId');
  const user_id = user_access?.user_id || -1;
  try {
    const query = `insert into song_stat values('${songId}', ${user_id},1,false)`;
    await Connection.query(query).then(e => {
      console.log('working')
    }).catch(async e => {
      if (e?.errno === 1062) {
        const query = `update song_stat set counts = counts+1 where song_id = '${songId}' and user_id = ${user_id || -1}`;
        await Connection.query(query).catch(e => {
          console.log(e)
        });
      }
    });
  } catch (e) {
    console.log(e);
  } finally {
    const info = await getInfo(songId, access);
    const playingtime = info?.duration_ms
    let release = info?.album.release_date?.substr(0, 4);
    let album = info?.album?.name
    let artist = info?.artists[0].name;
    let length = info.album.total_tracks;
    let title = decodeURIComponent(info?.name);
    let titleList = title.split('');
    artist = artist.replace(/&/g, 'and').replace(/%20/g, " ").replace(/$/g, 's');
    artist = decodeURIComponent(artist)
    console.log(title, artist)
    //앨범 검색=> 트랙찾기
    let list = (await youtubesearchapi.GetListByKeyword(`${artist} ${album} album`, true, 30)).items;
    list = list.filter(item => item.type === "playlist" && item);
    let url;
    if (list.length != 0) {
      let playlist = await youtubesearchapi.GetPlaylistData(list[0].id, 100);
      let newTitle = title
        .replace(/\(/g, "")
        .replace(/\)/g, "")
        .replace(/-/g, "")
        .toLowerCase()
        .replace(/ /g, "")
      if (newTitle.indexOf('remastered') !== -1) {
        newTitle = newTitle.substr(0, newTitle.indexOf('remastered'))
      }
      //make list of cnt
      let cntList = [];
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
      console.log(title, artist)
      list = (await youtubesearchapi.GetListByKeyword(`${title} - ${artist} lyrics`, false, 30)).items;
      // console.log(list)
      list = list.filter(e => {
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
        const poToken = process.env.NEXT_PUBLIC_POTOKEN
        const visitorData = process.env.NEXT_PUBLIC_VISITOR_DATA

        const accessToken = process.env.NEXT_PUBLIC_YT_ACCESS
        const refreshToken = process.env.NEXT_PUBLIC_YT_REFRESH
        const expiryDate = process.env.NEXT_PUBLIC_YT_EXPIRE

        // const oauth2 = new YtdlCore.OAuth2({
        //   accessToken,
        //   refreshToken,
        //   expiryDate
        // })
        // const ytdl = new YtdlCore({
        //   poToken,
        //   visitorData,
        //   // oauth2
        // });
        // const info = await ytdl.getFullInfo(url);
        const stream = ytdl(url, {
          filter: 'audioonly',
          quality: 'highestaudio',
          format: 'mp3'
        }).on('error', e => {
          console.log(e, 'error at get_video')
          throw e;
        });
        const response = new Response(stream);
        response.headers.set('content-type', 'audio/mp3')
        response.headers.set('connection', 'keep-alive');
        console.log('complete to send datas')
        return response
      }
      throw "no datas"
    } catch (e) {
      console.log(e)
      return NextResponse.json({ err: e }, { status: e.status || 500 })
    }
  }
}