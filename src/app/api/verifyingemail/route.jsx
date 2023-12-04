import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NEXT_PUBLIC_AUTH_EMAIL,
    pass: process.env.NEXT_PUBLIC_AUTH_PASS,
  }
})

export async function POST(req, response) {
  const { email } = await req.json();
  const randNUM = Math.floor(Math.random() * 100000)
  const mailOption = {
    from: process.env.NEXT_PUBLIC_AUTH_EMAIL,
    to: email,
    subject: "VERIFY EMAIL FROM FREETIFY",
    html: `<div>
      VERIFY NUMBER: ${randNUM}
    </div>`
  }
  await transporter.sendMail(mailOption, (err, info) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(info)
  })
  return NextResponse.json({ msg: 200, status: 200 })
}