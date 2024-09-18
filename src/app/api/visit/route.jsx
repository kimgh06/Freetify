import { NextResponse } from "next/server";
import Connection from "@/app/createConnection";

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
  //push
  let query = `insert into visit values('${formatDateToMySQL(new Date())}')`;
  Connection.query(query);

  //get
  query = `
  SELECT 
    SUM(CASE WHEN whens = '${date}' THEN 1 ELSE 0 END) AS today,
    COUNT(*) AS total
  FROM visit;
  `;
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
