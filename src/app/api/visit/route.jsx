import { NextResponse } from "next/server";
import mysql2, { format } from 'mysql2/promise';

const Connection = mysql2.createPool({
  host: process.env.NEXT_PUBLIC_SQL_HOST,
  port: '3306',
  user: process.env.NEXT_PUBLIC_SQL_USR,
  password: process.env.NEXT_PUBLIC_SQL_PWD,
  database: process.env.NEXT_PUBLIC_SQL_DATABASE,
  connectTimeout: 3000, // Connection timeout in milliseconds
})

export async function POST(req, response) {
  const query = `insert into visit values('${formatDateToMySQL(new Date())}')`;
  return await Connection.query(query).then(e => {
    return NextResponse.json({ 'msg': 'good' }, { status: 200 });
  }).catch(async e => {
    return NextResponse.json({ 'msg': e }, { status: 500 });
  });
}

export async function GET(req, response) {
  let { date } = new URLSearchParams(new URL(req?.url)?.date);
  if (!date) {
    date = formatDateToMySQL(new Date());
  }
  const query = `select count(*) as today, (select count(*) from visit) as total from visit where whens = '${date}'`;
  return await Connection.query(query).then(e => {
    return NextResponse.json({ 'cnt': e[0][0] }, { status: 200 });
  }).catch(async e => {
    return NextResponse.json({ 'msg': e }, { status: 500 });
  });
}

function formatDateToMySQL(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해줍니다.
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
