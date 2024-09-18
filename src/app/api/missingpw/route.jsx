// import { useQuery } from "@/app/useQuery";
import { NextResponse } from "next/server";
import Connection from "@/app/createConnection";

export async function PATCH(req, response) {
  const { email, pw } = await req.json();
  console.log(email, pw)
  const query = `update user_info set password = '${pw}' where email = '${email}'`;
  let res, err = null;
  await Connection.query(query).then(e => {
    res = e[0]
  }).catch(e => {
    err = e;
  })
  if (err) {
    return NextResponse.json({ msg: 'servererror' }, { status: 500 });
  }
  return NextResponse.json({ msg: 'Succeed to change' });
}