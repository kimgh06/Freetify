import ytdl from "ytdl-core";
import { NextResponse } from "next/server";
import youtubesearchapi from 'youtube-search-api';

export async function GET(req, res) {
  const params = req.url.split('?')[1].split('&');
  let paramlist = {};
  params.forEach((i, n) => {
    paramlist[i.split('=')[0]] = i.split('=')[1];
  })
  const { id, q } = paramlist;
  const list = await youtubesearchapi.GetListByKeyword(q);

  const stream = ytdl(`https://youtube.com/watch?v=${list.items[0].id}`, { filter: 'audioonly', quality: 'highestaudio' })
  try {
    return new Response(stream)
  } catch (e) {
    return NextResponse.json({ err: e }, { status: 500 })
  }
}