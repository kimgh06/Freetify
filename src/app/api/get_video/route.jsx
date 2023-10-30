import ytdl from "ytdl-core";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  const id = req.url.split('id=')[1];
  const stream = ytdl(`https://youtube.com/watch?v=${id}`, { filter: 'audioonly', quality: 'highestaudio' })
  try {
    return new Response(stream)
  } catch (e) {
    return NextResponse.json({ err: e }, { status: 500 })
  }
}