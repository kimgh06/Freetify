import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
const secret = process.env.NEXT_PUBLIC_AUTH_JWT_ACCESS_SECRET;
import Connection from "@/app/createConnection";

export async function GET(req) { //좋아하는 곡 가져오기
  try {
    const Auth = jwt.verify(req.headers.get('Authorization'), secret);
    const song_ids = new URL(req.url).searchParams.get('song_id').split(',');
    let results = {}
    const queries = song_ids.map(song_id => {
      const query = `select song_id from hearts where user_id = ${Auth['user_id']} and song_id = '${song_id}'`;
      return Connection.query(query).then(result =>
        result[0].length > 0 ? results[song_id] = true : results[song_id] = false
      ).catch(e =>
        results[song_id] = false
      );
    });
    await Promise.all(queries);
    return NextResponse.json({ res: results });
  } catch (e) {
    return NextResponse.json({ msg: e }, { status: 500 });
  }
}

export async function PATCH(req) {
  const Auth = jwt.verify(req.headers.get('Authorization'), secret);
  let query = `select song_id from hearts where user_id = ${Auth['user_id']}`;
  return await Connection.query(query).then(e => {
    return NextResponse.json({ res: e[0] });
  }).catch(e => {
    return NextResponse.json({ msg: e }, { status: 500 });
  });
}

export async function POST(req) { //좋아하는 곡 등록
  const Auth = jwt.verify(req.headers.get('Authorization'), secret);
  const { song_id } = await req.json();
  const query = `insert into hearts values('${song_id}', ${Auth['user_id']})`;
  return await Connection.query(query).then(e => {
    return NextResponse.json({ res: e[0] });
  }).catch(e => {
    return NextResponse.json({ msg: e }, { status: 500 });
  });
}
export async function DELETE(req) { //좋아하는 곡 삭제
  const Auth = jwt.verify(req.headers.get('Authorization'), secret);
  const { song_id } = await req.json();
  const query = `delete from hearts where song_id = '${song_id}' and user_id = ${Auth['user_id']}`;
  return await Connection.query(query).then(e => {
    return NextResponse.json({ res: e[0] });
  }).catch(e => {
    return NextResponse.json({ msg: e }, { status: 500 });
  });
}