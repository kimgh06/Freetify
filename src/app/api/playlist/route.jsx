import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import { useQuery } from "@/app/useQuery";
const secret = process.env.NEXT_PUBLIC_AUTH_JWT_ACCESS_SECRET;

async function handleRequest(req, response, query) {
  const Auth = jwt.verify(req.headers.get('Authorization'), secret);
  if (new Date().getTime() > Auth['exp']) {
    return NextResponse.json({ msg: "Need to refresh" }, { status: 403 })
  }
  const { song_id } = await req.json();

  const { err, res } = await query(Auth['user_id'], song_id);

  if (err !== null) {
    if (err['errno'] === 1062) {
      return NextResponse.json({ msg: 'Already exists' }, { status: 400 })
    }
    return NextResponse.json({ msg: 'serverError' }, { status: 500 })
  }

  return NextResponse.json({ msg: 'Success' });
}

export async function POST(req, response) {
  return handleRequest(req, response, async (user_id, song_id) => {
    return await useQuery(`insert into playlist values(${user_id}, '${song_id}')`);
  });
}

export async function DELETE(req, response) {
  return handleRequest(req, response, async (user_id, song_id) => {
    return await useQuery(`delete from playlist where user_id = ${user_id} and song_id = '${song_id}'`);
  });
}
