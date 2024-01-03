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
  const verfifycode = Math.floor(Math.random() * 1000000).toString().padStart(6, "0")
  const mailOption = {
    from: process.env.NEXT_PUBLIC_AUTH_EMAIL,
    to: email,
    subject: "VERIFY EMAIL FROM FREETIFY",
    html: `<div>
      VERIFY CODE: ${verfifycode}
      if you did not request the code, you can ignore this.
    </div>`
  }
  await transporter.sendMail(mailOption, (err, info) => {
    if (err) {
      console.log(err);
    }
  })
  return NextResponse.json({ code: verfifycode })
}