import ytdl from "ytdl-core";
import { NextResponse } from "next/server";
import youtubesearchapi from 'youtube-search-api';

export async function GET(req, res) {
  // const Auth = jwt.verify(req.headers.get('Authorization'), process.env.NEXT_PUBLIC_AUTH_JWT_ACCESS_SECRET);
  // if (Auth['exp'] < new Date().getTime()) {
  //   return NextResponse.json({ msg: 'Token is expired.' }, { status: 403 })
  // }
  const params = req.url.split('?')[1].split('&');
  let paramlist = {};
  params.forEach((i, n) => {
    paramlist[i.split('=')[0]] = i.split('=')[1];
  })
  let { album, title, artist, length, songId } = paramlist;
  album = decodeURIComponent(album);
  title = decodeURIComponent(title);
  artist = decodeURIComponent(artist)
  title = decodeURIComponent(title).replace(/%20/g, " ")
    .replace(/%27/g, "'")
    .replace(/%38/g, "&")
    .replace(/\(/g, "")
    .replace(/\)/g, "")
    .replace(/-/g, "")
    .replace(/ /g, "")
    .toLowerCase()
  console.log(title, artist)
  artist = artist.replace(/%20/g, " ");
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