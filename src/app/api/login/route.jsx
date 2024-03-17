// import { useQuery } from "@/app/useQuery";
import { NextResponse } from "next/server";
import mysql2 from 'mysql2/promise';
import jwt from 'jsonwebtoken';

const Connection = mysql2.createPool({
  host: process.env.NEXT_PUBLIC_SQL_HOST,
  port: '3306',
  user: process.env.NEXT_PUBLIC_SQL_USR,
  password: process.env.NEXT_PUBLIC_SQL_PWD,
  database: process.env.NEXT_PUBLIC_SQL_DATABASE
})


export async function POST(req, response) {
  const { email, pw } = await req.json();
  let query = `select * from user_info where email = '${email}' and password = '${pw}'`;
  let res, err = null;
  await Connection.query(query).then(e => {
    // console.log(e[0])
    res = e
  }).catch(e => {
    // console.log(e)
    err = e
  })

  if (err !== null) {
    return NextResponse.json({ msg: 'serverError' }, { status: 500 });
  }
  if (res.length <= 0) {
    return NextResponse.json({ msg: 'Failed to find your account. Check your information.' }, { status: 404 })
  }
  const exp = (Math.floor(Date.now() / 1000) + (60 * 30)) * 1000;
  const AccessToken = jwt.sign({
    user_id: res[0]['user_id'],
    pw: pw,
    exp: (Math.floor(Date.now() / 1000) + (60 * 30)) * 1000 //30분
  }, process.env.NEXT_PUBLIC_AUTH_JWT_ACCESS_SECRET)
  const RefreshToken = jwt.sign({
    user_id: res[0]['user_id'],
    pw: pw,
    exp: (Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 3)) * 1000, //3일
  }, process.env.NEXT_PUBLIC_AUTH_JWT_ACCESS_SECRET)
  return NextResponse.json({ AccessToken, RefreshToken, exp, nickname: res[0]['nickname'] })
}

export async function PATCH(req, res) {
  const Auth = jwt.verify(req.headers.get('Authorization'), process.env.NEXT_PUBLIC_AUTH_JWT_ACCESS_SECRET);
  if (Auth['exp'] < new Date().getTime()) {
    return NextResponse.json({ msg: 'Token is expired.' }, { status: 403 })
  }
  const AccessToken = jwt.sign({
    user_id: Auth['user_id'],
    pw: Auth['pw'],
    exp: (Math.floor(Date.now() / 1000) + (60 * 30)) * 1000, //30분
  }, process.env.NEXT_PUBLIC_AUTH_JWT_ACCESS_SECRET)
  const RefreshToken = jwt.sign({
    user_id: Auth['user_id'],
    pw: Auth['pw'],
    exp: (Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 3)) * 1000, //3일
  }, process.env.NEXT_PUBLIC_AUTH_JWT_ACCESS_SECRET)
  return NextResponse.json({ AccessToken, RefreshToken, exp: (Math.floor(Date.now() / 1000) + (60 * 30)) * 1000 })
}