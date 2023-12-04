import { useQuery } from "@/app/useQuery";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function POST(req, response) {
  const { email, pw } = await req.json();
  const { err, res } = await useQuery(`select * from user_info where email = '${email}' and password = '${pw}'`)

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
  return NextResponse.json({ AccessToken, RefreshToken, exp, nickname: res[0]['nickname'] })
}