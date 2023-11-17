import ytdl from "ytdl-core";
import { NextResponse } from "next/server";
import youtubesearchapi from 'youtube-search-api';

export async function GET(req, res) {
  const params = req.url.split('?')[1].split('&');
  let paramlist = {};
  params.forEach((i, n) => {
    paramlist[i.split('=')[0]] = i.split('=')[1];
  })
  let { id, album, title, artist } = paramlist;
  album = album.replace(/%20/g, " ");
  title = title.replace(/%20/g, " ").replace(/%27/g, "'");
  artist = artist.replace(/%20/g, " ");
  //고안중 앨범 검색=> 트랙찾기
  let list = await youtubesearchapi.GetListByKeyword(`${album} ${artist}`, true, 2);
  list = list.items.filter(item => item.type === "playlist" && list)[0]
  let playlist = await youtubesearchapi.GetPlaylistData(list.id);
  let url;
  playlist.items.forEach(item => {
    if (item.title === title) {
      url = item.id;
    }
  })

  try {
    const stream = ytdl(`https://youtube.com/watch?v=${url}`, { filter: 'audioonly', quality: 'highestaudio', format: 'mp3' })
    const response = new Response(stream);
    response.headers.set('content-type', 'audio/mp3')
    response.headers.set('connection', 'keep-alive');
    return response
  } catch (e) {
    return NextResponse.json({ err: e }, { status: 500 })
  }
}