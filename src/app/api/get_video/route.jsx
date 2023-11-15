import ytdl from "ytdl-core";
import { NextResponse } from "next/server";
import youtubesearchapi from 'youtube-search-api';

export async function GET(req, res) {
  const params = req.url.split('?')[1].split('&');
  let paramlist = {};
  params.forEach((i, n) => {
    paramlist[i.split('=')[0]] = i.split('=')[1];
  })
  let { id, q } = paramlist;
  q = q.replace(/%20/g, ' ');
  const list = await youtubesearchapi.GetListByKeyword(q);

  try {
    const stream = ytdl(`https://youtube.com/watch?v=${list.items[0].id}`, { filter: 'audioonly', quality: 'highestaudio', format: 'mp3' })
    const response = new Response(stream);
    response.headers.set('content-type', 'audio/mp3')
    response.headers.set('connection', 'keep-alive');
    return response
  } catch (e) {
    return NextResponse.json({ err: e }, { status: 500 })
  }
}