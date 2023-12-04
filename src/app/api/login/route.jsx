import { useQuery } from "@/app/useQuery";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function POST(req, response) {
  const { email, pw } = await req.json();
  const { err, res } = await useQuery(`select * from user_info where email = '${email}' and password = '${pw}'`)

  if (err !== null) {
    return NextResponse.json({ status: 500 });
  }
  if (res.length <= 0) {
    return NextResponse.json({ status: 404 })
  }
  const exp = (Math.floor(Date.now() / 1000) + (60 * 30)) * 1000;
  const AccessToken = jwt.sign({
    user_id: res[0]['user_id'],
    pw: pw,
    exp: (Math.floor(Date.now() / 1000) + (60 * 30)) * 1000 //30분
  }, process.env.NEXT_PUBLIC_AUTH_JWT_ACCESS_SECRET)
  return NextResponse.json({ AccessToken, exp, nickname: res[0]['nickname'], status: 200 })
} 