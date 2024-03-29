import { NextResponse } from "next/server";
// import { useQuery } from "@/app/useQuery";
import jwt from 'jsonwebtoken'
const secret = process.env.NEXT_PUBLIC_AUTH_JWT_ACCESS_SECRET;

import mysql2 from 'mysql2/promise';
const Connection = mysql2.createPool({
  host: process.env.NEXT_PUBLIC_SQL_HOST,
  port: '3306',
  user: process.env.NEXT_PUBLIC_SQL_USR,
  password: process.env.NEXT_PUBLIC_SQL_PWD,
  database: process.env.NEXT_PUBLIC_SQL_DATABASE
})

export async function GET(req, response) { //전체 플레이리스트 조회
  const Auth = jwt.verify(req.headers.get('Authorization'), secret);
  const q = new URLSearchParams(new URL(req?.url).search)
  const id = q.get('id');
  const { user_id } = Auth
  if (id) {
    return SearchId(id, user_id);
  } else {
    return SearchAll(user_id);
  }
}
async function SearchId(id, user_id) {
  const query = `select distinct playlist_id, case when (select count(*) from playlist p2 where song_id='${id}' and p1.playlist_id = p2.playlist_id)>0 then 1 else 0 end as exist from playlist p1 where user_id = ${user_id}`;
  let err = null, res;
  await Connection.query(query).then(e => {
    res = e[0];
  }).catch(e => {
    err = e;
  });
  if (err !== null) {
    return NextResponse.json({ err: err }, { status: 500 });
  }
  return NextResponse.json({ res });
}

async function SearchAll(user_id) {
  const query = `select distinct playlist_id from playlist where user_id = ${user_id}`;
  let err = null, res;
  await Connection.query(query).then(e => {
    res = e[0];
  }).catch(e => {
    err = e;
  });
  if (err !== null) {
    return NextResponse.json({ err: err }, { status: 500 })
  }
  return NextResponse.json({ res });
}

export async function POST(req, response) { //특정 플레이리스트 목록 조회
  const { nickname, playlist } = await req.json();
  const query = `select song_id from playlist where user_id = (select user_id from user_info where nickname = '${nickname}') and playlist_id = '${playlist}' order by play_index`;
  let err = null, res;
  await Connection.query(query).then(e => {
    // console.log(e)
    res = e[0];
  }).catch(e => {
    err = e;
  });
  // const { err, res } = await useQuery(`select song_id from playlist where user_id = (select user_id from user_info where nickname = '${nickname}') and playlist_id = '${playlist}' order by play_index`)
  if (err !== null) {
    return NextResponse.json({ msg: err }, { status: 500 });
  }
  return NextResponse.json({ res });
}

export async function PUT(req, response) {
  const Auth = jwt.verify(req.headers.get('Authorization'), secret);
  const { song_id, playlist } = await req.json();
  const query = `insert into playlist values('${playlist}', ${Auth['user_id']}, '${song_id}', (select mx + 1 from (select max(play_index) mx from playlist where playlist_id = '${playlist}' and user_id = ${Auth['user_id']}) sub))`;
  let err = null, res;
  await Connection.query(query).then(e => {
    res = e[0];
  }).catch(e => {
    err = e;
  });
  // con
  // const { err, res } = await useQuery(`insert into playlist values('${playlist}', ${Auth['user_id']}, '${song_id}', (select mx + 1 from (select max(play_index) mx from playlist where playlist_id = '${playlist}' and user_id = ${Auth['user_id']}) sub))`)
  if (new Date().getTime() > Auth['exp']) {
    return NextResponse.json({ msg: "Need to refresh" }, { status: 403 })
  }
  if (err !== null) {
    console.log(err, 'error at put playlist')
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
  const query = `delete from playlist where playlist_id = '${playlist}' and user_id = ${Auth['user_id']} and song_id = '${song_id}'`;
  let err = null, res;
  await Connection.query(query).then(e => {
    res = e[0];
  }).catch(e => {
    err = e;
  });
  // con
  // const { err, res } = await useQuery(`delete from playlist where playlist_id = '${playlist}' and user_id = ${Auth['user_id']} and song_id = '${song_id}'`)
  console.log(err, 'error at delete playlist')
  if (new Date().getTime() > Auth['exp']) {
    return NextResponse.json({ msg: "Need to refresh" }, { status: 403 })
  }
  if (err !== null) {
    return NextResponse.json({ msg: 'serverError' }, { status: 500 })
  }
  return NextResponse.json({ msg: 'deleted' });
}

export async function PATCH(req, response) {
  const Auth = jwt.verify(req.headers.get('Authorization'), secret);
  const { user_id, exp } = Auth;
  const { items, playlist_id } = await req.json()
  console.log("refresh user token", user_id, new Date().getTime() > exp, items.length, playlist_id)
  const query = `select count(playlist_id) as ex from playlist where user_id = ${user_id} and playlist_id = '${playlist_id}' group by playlist_id`;
  let err = null, res;
  await Connection.query(query).then(e => {
    res = e[0];
  }).catch(e => {
    err = e;
  });
  // con
  // let { err, res } = await useQuery(`select count(playlist_id) as ex from playlist where user_id = ${user_id} and playlist_id = '${playlist_id}' group by playlist_id`);
  if (err !== null && res.length !== 1) {
    return NextResponse.json({ msg: 'err' }, { status: 500 })
  }
  return LoopUpdate(items, playlist_id);
}

async function LoopUpdate(items, playlist_id) {
  let err, res;
  for (let i = 0; i < items.length; i++) {
    await ExcuteUpdate(`update playlist set play_index = ${i} where song_id = '${items[i]}' and playlist_id = '${playlist_id}'`).catch(e => {
      err = e;
    })
  }
  if (err) {
    return NextResponse.json({ msg: err }, { status: 500 })
  }
  return NextResponse.json({ msg: 'succeed' });
}

async function ExcuteUpdate(query) {
  // const query = query
  let err = null, res;
  await Connection.query(query).then(e => {
    res = e[0];
  }).catch(e => {
    err = e;
  });
  return { err, res }
}