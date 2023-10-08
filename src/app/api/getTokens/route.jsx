import { response } from "express";
import { NextResponse } from "next/server"
import request from "request";

const redirect_url = process.env.NEXT_PUBLIC_BACKEND_REDIRECT_URL;
const SpotifyClientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENTID;
const SpotifyClientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENTSECRET;

export async function POST(req) {
  const body = await req.json();
  const { code, state } = body;
  try {
    if (code && state) {
      const options = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_url,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': `Basic ${(new Buffer.from(SpotifyClientId + ":" + SpotifyClientSecret).toString('base64'))}`
        },
        json: true
      };
      let response = NextResponse.json({ message: "There are no code and state." }, { status: 400 });
      response = request.post(options, (err, res, body) => {
        const bod = JSON.stringify(body);
        if (!err) {
          return NextResponse.json(bod, { status: 200 });
        }
        return NextResponse.json(bod, { status: 500 });
      });
    }
    console.log(response)
    return response;
  } catch {
    return NextResponse.json({ message: "There are something Error." }, { status: 500 });
  }
}