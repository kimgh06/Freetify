import { useQuery } from "@/app/useQuery";
import { NextResponse } from "next/server";

export async function POST(req, response) {
  const { email, pw, nickname } = await req.json();
  const select = await useQuery(`select * from user_info where email = '${email}'`);
  if (select.err !== null) {
    return NextResponse.json({ msg: "serverError" }, { status: 500 });
  }
  if (select.res.length > 0) {
    return NextResponse.json({ msg: "Already Exists" }, { status: 400 })
  }

  const insert = await useQuery(`insert into user_info values((select a.id from (select max(user_id)+1 id from user_info) a), '${email}', '${pw}','${nickname}',now())`)
  if (insert.err !== null) {
    return NextResponse.json({ msg: "serverError" }, { status: 500 });
  }
  return NextResponse.json({ msg: 'success to regist' })
}