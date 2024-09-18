import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
const secret = process.env.NEXT_PUBLIC_AUTH_JWT_ACCESS_SECRET;
import Connection from "@/app/createConnection";

export async function GET(req, { params }) { //특정 플레이리스트 목록 조회
  const [nickname, playlist] = params.id;
  const query = `select song_id from playlist where user_id = (select user_id from user_info where nickname = '${nickname}') and playlist_id = '${playlist}' order by play_index`;
  return await Connection.query(query).then(e => {
    return NextResponse.json({ res: e[0] });
  }).catch(e => {
    return NextResponse.json({ msg: e }, { status: 500 });
  });
}