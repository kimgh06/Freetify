import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import Connection from "@/app/createConnection";
const secret = process.env.NEXT_PUBLIC_AUTH_JWT_ACCESS_SECRET;


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
  return await Connection.query(query).then(e => {
    return NextResponse.json({ res: e[0] });
  }).catch(e => {
    return NextResponse.json({ err: e }, { status: 500 })
  });
}

export async function POST(req, response) { //플레이 리스트 이름 변경
  const Auth = jwt.verify(req.headers.get('Authorization'), secret);
  const { previous, next } = await req.json();
  const query = `update playlist set playlist_id = '${next}' where playlist_id = '${previous}'`;
  console.log(query)
  return await Connection.query(query).then(e => {
    return NextResponse.json({ name: next }, { status: 201 })
  }).catch(e => {
    return NextResponse.json({ error: e }, { status: 500 })
  });
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
  return await Connection.query(query).then(e => {
    if (new Date().getTime() > Auth['exp']) {
      return NextResponse.json({ msg: "Need to refresh" }, { status: 403 })
    }
    return NextResponse.json({ msg: 'deleted' });
  }).catch(e => {
    console.log(e, 'error at delete playlist')
    if (e !== null) {
      return NextResponse.json({ msg: 'serverError' }, { status: 500 })
    }
  });
}

export async function PATCH(req, response) {
  const Auth = jwt.verify(req.headers.get('Authorization'), secret);
  const { user_id, exp } = Auth;
  const { items, playlist_id } = await req.json()
  const query = `select count(playlist_id) as ex from playlist where user_id = ${user_id} and playlist_id = '${playlist_id}' group by playlist_id`;
  let err = null, res;
  await Connection.query(query).then(e => {
    res = e[0];
  }).catch(e => {
    err = e;
  });
  if (err !== null && res.length !== 1) {
    return NextResponse.json({ msg: 'err' }, { status: 500 })
  }
  return LoopUpdate(items, playlist_id);
}

async function LoopUpdate(items, playlist_id) {
  // CASE 문을 사용하여 song_id에 따라 play_index를 업데이트하는 쿼리 생성
  const updates = items.map((item, i) => `WHEN '${item}' THEN ${i}`).join(' ');
  const songIds = items.map(item => `'${item}'`).join(', ');

  const query = `
    UPDATE playlist
    SET play_index = CASE song_id ${updates} END
    WHERE song_id IN (${songIds}) AND playlist_id = '${playlist_id}'
  `;

  try {
    // 단일 쿼리 실행
    await ExcuteUpdate(query);
    return NextResponse.json({ msg: 'succeed' });
  } catch (err) {
    return NextResponse.json({ msg: err }, { status: 500 });
  }
}

async function ExcuteUpdate(query) {
  let err = null, res;
  await Connection.query(query).then(e => {
    res = e[0];
  }).catch(e => {
    err = e;
  });
  return { err, res }
}