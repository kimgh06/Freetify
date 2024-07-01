import { NextResponse } from "next/server";
import mysql2 from 'mysql2/promise';

const Connection = mysql2.createPool({
  host: process.env.NEXT_PUBLIC_SQL_HOST,
  port: '3306',
  user: process.env.NEXT_PUBLIC_SQL_USR,
  password: process.env.NEXT_PUBLIC_SQL_PWD,
  database: process.env.NEXT_PUBLIC_SQL_DATABASE,
  connectTimeout: 3000, // Connection timeout in milliseconds
})

export async function GET(req, response) {
  const query = `insert into visit values('${formatDateToMySQL(new Date())}',1)`;
  await Connection.query(query).then(e => {
    return NextResponse.json({ 'msg': 'good' }, { status: 200 });
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

const jsDate = new Date();
const mySQLDate = formatDateToMySQL(jsDate);
console.log(mySQLDate); // YYYY-MM-DD 형식의 문자열 출력
