import ytdl from "ytdl-core";
import { NextResponse } from "next/server";
import BlobStream from 'blob-stream';

export async function GET(req, res) {
  const id = req.url.split('id=')[1];

  ytdl(`https://youtube.com/watch?v=${id}`, { filter: 'audioonly', quality: 'highestaudio' })
    .pipe(res)
  // return NextResponse.json({ msg: "ok" }, { status: 200 })
}