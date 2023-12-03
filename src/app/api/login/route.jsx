import { useQuery } from "@/app/useQuery";
import { NextResponse } from "next/server";

export async function POST(req, response) {
  const { nickname, pw } = await req.json();
  const { res } = await useQuery(`select * from user_info where nickname = '${nickname}' and password = '${pw}'`)
  console.log(res[0])
  return NextResponse.json({ nickname, pw }, { status: 200 })
}