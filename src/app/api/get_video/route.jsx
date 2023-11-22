import ytdl from "ytdl-core";
import { NextResponse } from "next/server";
import youtubesearchapi from 'youtube-search-api';

export async function GET(req, res) {
  const params = req.url.split('?')[1].split('&');
  let paramlist = {};
  params.forEach((i, n) => {
    paramlist[i.split('=')[0]] = i.split('=')[1];
  })
  let { album, title, artist, length } = paramlist;
  album = album.replace(/%20/g, " ");
  title = title.replace(/%35/g, "#");
  title = decodeURIComponent(title);
  title = title.replace(/%20/g, " ")
    .replace(/%27/g, "'")
    .replace(/%38/g, "&")
    .replace(/\(/g, "")
    .replace(/\)/g, "")
    .replace(/-/g, "")
    .replace(/ /g, "")
    .toLowerCase()
  console.log(title)
  artist = artist.replace(/%20/g, " ");
  //고안중 앨범 검색=> 트랙찾기
  let list = await youtubesearchapi.GetListByKeyword(`${album} album`, true, 20);
  list = list.items.filter(item => item.type === "playlist" && item.length >= length && item)
  let url;
  if (list.length != 0) {
    let playlist = await youtubesearchapi.GetPlaylistData(list[0].id, 100);
    for (let i = 0; i < playlist.items.length; i++) {
      const item = playlist.items[i];
      let asdf = item.title
        .replace(/\(/g, "")
        .replace(/\)/g, "")
        .replace(/-/g, "")
        .replace(/ /g, "")
        .replace(/ft./g, "feat.")
        .toLowerCase()
      if (asdf.indexOf(title) !== -1 || title.indexOf(asdf) !== -1) {
        console.log(title + "found")
        url = item.id;
        break;
      }
    }
  } else {
    //싱글 앨범일 경우에는?
    list = (await youtubesearchapi.GetListByKeyword(`${title} ${artist}`)).items;
    // console.log(list[0].id)
    url = list[0].id
  }

  try {
    if (url) {
      const stream = ytdl(`https://youtube.com/watch?v=${url}`, { filter: 'audioonly', quality: 'highestaudio', format: 'mp3' })
      const response = new Response(stream);
      response.headers.set('content-type', 'audio/mp3')
      response.headers.set('connection', 'keep-alive');
      return response
    } else {
      throw "no datas"
    }
  } catch (e) {
    return NextResponse.json({ err: e }, { status: 500 })
  }
}