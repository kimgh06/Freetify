// import { useQuery } from "@/app/useQuery";
import { NextResponse } from "next/server";
import Connection from "@/app/createConnection";

export async function POST(req, response) {
  const { email, pw, nickname } = await req.json();
  const query = `insert into user_info values((select a.id from (select max(user_id)+1 id from user_info) a), '${email}', '${pw}','${nickname}',now())`;
  let err = null, res;
  await Connection.query(query).then(e => {
    res = e[0];
  }).catch(e => {
    err = e;
  });
  // const insert = await useQuery()
  // await
  if (err !== null) {
    // console.log(insert.err.errno)
    if (err.errno === 1062) {
      return NextResponse.json({ msg: "Already exists email." }, { status: 400 });
    }
    console.log(err, 'error at post signup')
  }
  return NextResponse.json({ msg: 'success to regist' })
}