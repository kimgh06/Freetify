import { useQuery } from "@/app/useQuery";
import { NextResponse } from "next/server";

export async function PATCH(req, response) {
  const { email, pw } = await req.json();
  console.log(email, pw)
  const res = await useQuery(`update user_info set password = '${pw}' where email = '${email}'`)
  if (res.err) {
    return NextResponse.json({ msg: 'servererror' }, { status: 500 });
  }
  return NextResponse.json({ msg: 'Succeed to change' });
}