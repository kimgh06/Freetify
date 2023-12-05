import { useQuery } from "@/app/useQuery";
import { NextResponse } from "next/server";

export async function POST(req, response) {
  const { email, pw, nickname } = await req.json();

  const insert = await useQuery(`insert into user_info values((select a.id from (select max(user_id)+1 id from user_info) a), '${email}', '${pw}','${nickname}',now())`)
  if (insert.err !== null) {
    console.log(insert.err.errno)
    if (insert.err.errno === 1062) {
      return NextResponse.json({ msg: "Already exists email." }, { status: 400 });
    }
    return;
  }
  return NextResponse.json({ msg: 'success to regist' })
}