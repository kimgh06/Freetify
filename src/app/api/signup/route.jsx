// import { useQuery } from "@/app/useQuery";
import { NextResponse } from "next/server";

import mysql2 from 'mysql2/promise';
const Connection = mysql2.createPool({
  host: process.env.NEXT_PUBLIC_SQL_HOST,
  port: '3306',
  user: process.env.NEXT_PUBLIC_SQL_USR,
  password: process.env.NEXT_PUBLIC_SQL_PWD,
  database: process.env.NEXT_PUBLIC_SQL_DATABASE
})

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