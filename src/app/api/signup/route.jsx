import { useQuery } from "@/app/useQuery";
import { NextResponse } from "next/server";

export async function POST(req, response) {
  const { email, pw, nickname } = await req.json();
  const { err, res } = await useQuery(`insert into user_info values((select a.id from (select max(user_id)+1 id from user_info) a), '${email}', '${pw}','${nickname}',now())`)
  if (err !== null) {
    return NextResponse.json({ status: 500 });
  }
  return NextResponse.json({ msg: 'success to regist', status: 200 })
}