import { NextResponse } from "next/server";
import { useQuery } from "@/app/useQuery";
import jwt from 'jsonwebtoken'
const secret = process.env.NEXT_PUBLIC_AUTH_JWT_ACCESS_SECRET;

export async function GET(req, response) { //전체 플레이리스트 조회
  const Auth = jwt.verify(req.headers.get('Authorization'), secret);
  const q = new URLSearchParams(new URL(req?.url).search)
  const id = q.get('id');
  const { user_id } = Auth
  if (id) {
    const { err, res } = await useQuery(`select distinct playlist_id, case when (select count(*) from playlist p2 where song_id='${id}' and p1.playlist_id = p2.playlist_id)>0 then 1 else 0 end as exist from playlist p1 where user_id = ${user_id}`);
    if (err !== null) {
      return NextResponse.json({ err: err }, { status: 500 });
    }
    return NextResponse.json({ res });
  } else {
    const { err, res } = await useQuery(`select distinct playlist_id from playlist`)
    if (err !== null) {
      return NextResponse.json({ err: err }, { status: 500 })
    }
    return NextResponse.json({ res });
  }
}

export async function POST(req, response) { //특정 플레이리스트 목록 조회
  const Auth = jwt.verify(req.headers.get('Authorization'), secret);
  const { nickname, playlist } = await req.json();
  const { err, res } = await useQuery(`select song_id from playlist where user_id = ${Auth['user_id']} and playlist_id = '${playlist}'`)
  if (err !== null) {
    return NextResponse.json({ msg: err }, { status: 500 });
  }
  return NextResponse.json({ res });
}

export async function PUT(req, response) {
  const Auth = jwt.verify(req.headers.get('Authorization'), secret);
  const { song_id, playlist } = await req.json();
  const { err, res } = await useQuery(`insert into playlist values('${playlist}', ${Auth['user_id']}, '${song_id}')`)
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
  const { err, res } = await useQuery(`delete from playlist where playlist_id = '${playlist}' and user_id = ${Auth['user_id']} and song_id = '${song_id}'`)
  console.log(err)
  if (new Date().getTime() > Auth['exp']) {
    return NextResponse.json({ msg: "Need to refresh" }, { status: 403 })
  }
  if (err !== null) {
    return NextResponse.json({ msg: 'serverError' }, { status: 500 })
  }
  return NextResponse.json({ msg: 'deleted' });
}