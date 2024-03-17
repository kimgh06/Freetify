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