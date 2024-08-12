import ytdl from "@distube/ytdl-core";
import { NextResponse } from "next/server";
import youtubesearchapi from 'youtube-search-api';
import axios from "axios";
import jwt from "jsonwebtoken";
import mysql2 from 'mysql2/promise';

const Connection = mysql2.createPool({
  host: process.env.NEXT_PUBLIC_SQL_HOST,
  port: '3306',
  user: process.env.NEXT_PUBLIC_SQL_USR,
  password: process.env.NEXT_PUBLIC_SQL_PWD,
  database: process.env.NEXT_PUBLIC_SQL_DATABASE,
  connectTimeout: 3000, // Connection timeout in milliseconds
})

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

        // const itemList = item.title.split('');
        // let cnt = 0;
        // for (let j = 0; j < itemList.length; j++) {
        //   for (let k = 0; k < titleList.length; k++) {
        //     if (titleList[k] === itemList[j]) {
        //       cnt++;
        //       break;
        //     }
        //   }
        // }
        // cntList.push(cnt);
      }
    }
    if (!url) {
      //싱글 앨범일 경우거나 못 찾았거나
      console.log(title, artist)
      list = (await youtubesearchapi.GetListByKeyword(`official ${artist} ${title} `, false, 20)).items;
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
        const cookies = [
          {
            "domain": ".youtube.com",
            "expirationDate": 1756442831.220878,
            "hostOnly": false,
            "httpOnly": false,
            "name": "__Secure-1PAPISID",
            "path": "/",
            "sameSite": "unspecified",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "i5SYpA8dadR_JlqQ/AV0oBmWi53FFKCQfZ",
            "id": 1
          },
          {
            "domain": ".youtube.com",
            "expirationDate": 1756442831.220501,
            "hostOnly": false,
            "httpOnly": true,
            "name": "__Secure-1PSID",
            "path": "/",
            "sameSite": "unspecified",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "g.a000mAgEOqoSd3RlbdBjNWAGnCWmcFtdOYwMaAYNJhfnnAyqaONtGaKgncRerL0dDxPwwp8sGQACgYKAZcSARUSFQHGX2MiaMV9LPBojznMJKAJiJcXyBoVAUF8yKqTxm8uenq1M5aIWXtBZrX00076",
            "id": 2
          },
          {
            "domain": ".youtube.com",
            "expirationDate": 1754639380.372062,
            "hostOnly": false,
            "httpOnly": true,
            "name": "__Secure-1PSIDCC",
            "path": "/",
            "sameSite": "unspecified",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "AKEyXzWUAQSwssWoT_Unc3D5bYH-_1sWicYIuipoNpyXOYWDAKqchj3z6WPRsoM6_asiFWCfaZg",
            "id": 3
          },
          {
            "domain": ".youtube.com",
            "expirationDate": 1753418831.220443,
            "hostOnly": false,
            "httpOnly": true,
            "name": "__Secure-1PSIDTS",
            "path": "/",
            "sameSite": "unspecified",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "sidts-CjIB4E2dkZrVDGNLFGoKlof4eZjOf9Tgh6dTs_Z9zwCe-EqeO24N_4uKD4AE5DJZQ3vO-RAA",
            "id": 4
          },
          {
            "domain": ".youtube.com",
            "expirationDate": 1756442831.220906,
            "hostOnly": false,
            "httpOnly": false,
            "name": "__Secure-3PAPISID",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "i5SYpA8dadR_JlqQ/AV0oBmWi53FFKCQfZ",
            "id": 5
          },
          {
            "domain": ".youtube.com",
            "expirationDate": 1756442831.220526,
            "hostOnly": false,
            "httpOnly": true,
            "name": "__Secure-3PSID",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "g.a000mAgEOqoSd3RlbdBjNWAGnCWmcFtdOYwMaAYNJhfnnAyqaONtWS_DNUxbvH7r1k9-kXyz2QACgYKAekSARUSFQHGX2MiAfGtgs41mc4IT6fp462KpxoVAUF8yKp00UzvwtJVoQCzipKms6TA0076",
            "id": 6
          },
          {
            "domain": ".youtube.com",
            "expirationDate": 1754639380.372107,
            "hostOnly": false,
            "httpOnly": true,
            "name": "__Secure-3PSIDCC",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "AKEyXzUTcqf74KICZF9YqjOU6PS52SuECt-2WDFlfeM1Ym3CH_OgAg0BHILPdbTjuQt3rEOpL9o",
            "id": 7
          },
          {
            "domain": ".youtube.com",
            "expirationDate": 1753418831.220471,
            "hostOnly": false,
            "httpOnly": true,
            "name": "__Secure-3PSIDTS",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "sidts-CjIB4E2dkZrVDGNLFGoKlof4eZjOf9Tgh6dTs_Z9zwCe-EqeO24N_4uKD4AE5DJZQ3vO-RAA",
            "id": 8
          },
          {
            "domain": ".youtube.com",
            "expirationDate": 1756442831.220831,
            "hostOnly": false,
            "httpOnly": false,
            "name": "APISID",
            "path": "/",
            "sameSite": "unspecified",
            "secure": false,
            "session": false,
            "storeId": "0",
            "value": "VxCtYtnxF3R8cT59/Ae8BL059YDQIu-L4X",
            "id": 9
          },
          {
            "domain": ".youtube.com",
            "expirationDate": 1756442831.220623,
            "hostOnly": false,
            "httpOnly": true,
            "name": "HSID",
            "path": "/",
            "sameSite": "unspecified",
            "secure": false,
            "session": false,
            "storeId": "0",
            "value": "AmqI1ifiVJRjNjGv4",
            "id": 10
          },
          {
            "domain": ".youtube.com",
            "expirationDate": 1757663371.843933,
            "hostOnly": false,
            "httpOnly": true,
            "name": "LOGIN_INFO",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "AFmmF2swRQIgRnvM5VuVSuFuetK2JCn2LNtmV6OUpRE8ovxZpG5gMrUCIQDDBwBuFHuKS3VjE4Y9Cm3YVzUkjA2Pds8n83OWRffzvw:QUQ3MjNmejI3bzFSTVJ3b0xWdXlQT1FuVmpiVHlLa2t5cmFhczA2Q3RmUE1kSVBkbV8wb3ZLZ29QLWVfMmFLcXlmOVhoZXNYWF9WaW1kLWtDZGpJbk5iS291NkswS3BlaFctQi1BS2NmaGxzSVA4U0Vwdnk2bFFhNEdYU2V6RERHR1I0NzZOaGVNVEg5dzRNV1BlVXE3ckh5MzlkWDliTEtB",
            "id": 11
          },
          {
            "domain": ".youtube.com",
            "expirationDate": 1757663379.130101,
            "hostOnly": false,
            "httpOnly": false,
            "name": "PREF",
            "path": "/",
            "sameSite": "unspecified",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "f6=40000000&f7=4100&tz=Asia.Seoul&f5=30000",
            "id": 12
          },
          {
            "domain": ".youtube.com",
            "expirationDate": 1756442831.220855,
            "hostOnly": false,
            "httpOnly": false,
            "name": "SAPISID",
            "path": "/",
            "sameSite": "unspecified",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "i5SYpA8dadR_JlqQ/AV0oBmWi53FFKCQfZ",
            "id": 13
          },
          {
            "domain": ".youtube.com",
            "expirationDate": 1756442831.220357,
            "hostOnly": false,
            "httpOnly": false,
            "name": "SID",
            "path": "/",
            "sameSite": "unspecified",
            "secure": false,
            "session": false,
            "storeId": "0",
            "value": "g.a000mAgEOqoSd3RlbdBjNWAGnCWmcFtdOYwMaAYNJhfnnAyqaONtxYk7YJHIWZJBUl7dn8a-ywACgYKAU4SARUSFQHGX2MiZ5u4Oj5-v-PVxNjHLvH6jBoVAUF8yKp4t-OCVkOU4zwI_r43K2wL0076",
            "id": 14
          },
          {
            "domain": ".youtube.com",
            "expirationDate": 1754639380.371935,
            "hostOnly": false,
            "httpOnly": false,
            "name": "SIDCC",
            "path": "/",
            "sameSite": "unspecified",
            "secure": false,
            "session": false,
            "storeId": "0",
            "value": "AKEyXzVYzBLjdUpLT-ejgd8QFLwbIIK-F1FXJf6U-B8qggQe0Ko2WK_jSqzBU4lqE9Cy6xLpfAOh",
            "id": 15
          },
          {
            "domain": ".youtube.com",
            "expirationDate": 1756442831.220776,
            "hostOnly": false,
            "httpOnly": true,
            "name": "SSID",
            "path": "/",
            "sameSite": "unspecified",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "AM9_l0r7OAoX5qoam",
            "id": 16
          },
          {
            "domain": ".youtube.com",
            "expirationDate": 1728457372.666471,
            "hostOnly": false,
            "httpOnly": true,
            "name": "VISITOR_PRIVACY_METADATA",
            "path": "/",
            "sameSite": "no_restriction",
            "secure": true,
            "session": false,
            "storeId": "0",
            "value": "CgJLUhIEGgAgaQ%3D%3D",
            "id": 17
          }
        ]
        const agent = ytdl.createAgent({ cookies: cookies });
        const stream = ytdl(`https://youtube.com/watch?v=${url}`, { agent: agent, filter: 'audioonly', quality: 'highestaudio', format: 'mp3' }).on('error', e => {
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
      return NextResponse.json({ err: e }, { status: e.status || 500 })
    }
  }
}