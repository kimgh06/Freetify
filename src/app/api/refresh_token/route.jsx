import axios from "axios";
import { NextResponse } from "next/server";

const SpotifyClientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENTID;
const SpotifyClientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENTSECRET;

export async function PATCH(req) {
  const body = await req.json();
  const { refreshToken } = body;
  if (refreshToken) {
    try {
      const response = await axios.post('https://accounts.spotify.com/api/token', {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      }, {
        headers: {
          'Authorization': `Basic ${(new Buffer.from(SpotifyClientId + ":" + SpotifyClientSecret).toString('base64'))}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: error.response.data.error }, { status: error.response.status });
    }
  } else {
    return NextResponse.json({ message: "no refresh token" }, { status: 400 });
  }
}