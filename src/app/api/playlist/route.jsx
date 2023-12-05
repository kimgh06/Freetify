import { NextResponse } from "next/server";
import { useQuery } from "@/app/useQuery";
import jwt from 'jsonwebtoken'
const secret = process.env.NEXT_PUBLIC_AUTH_JWT_ACCESS_SECRET;

export async function POST(req, response) {
  const Auth = jwt.verify(req.headers.get('Authorization'), secret);
  const { song_id, playlist } = await req.json();
  const { err, res } = await useQuery(`insert into playlist values(${playlist}, ${Auth['user_id']}, '${song_id}')`)
  if (new Date().getTime() > Auth['exp']) {
    return NextResponse.json({ msg: "Need to refresh" }, { status: 403 })
  }
  if (err !== null) {
    if (err['errno'] === 1062) {
      return NextResponse.json({ msg: 'Already exists' }, { status: 400 })
    }
    return NextResponse.json({ msg: 'serverError' }, { status: 500 })
  }
  return NextResponse.json({ msg: 'inserted' });
}

export async function DELETE(req, response) {
  const Auth = jwt.verify(req.headers.get('Authorization'), secret);
  const { song_id, playlist } = await req.json();
  const { err, res } = await useQuery(`delete from playlist where playlist_id = ${playlist} and user_id = ${Auth['user_id']} and song_id = '${song_id}'`)
  if (new Date().getTime() > Auth['exp']) {
    return NextResponse.json({ msg: "Need to refresh" }, { status: 403 })
  }
  if (err !== null) {
    return NextResponse.json({ msg: 'serverError' }, { status: 500 })
  }
  return NextResponse.json({ msg: 'deleted' });
}