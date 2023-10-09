import axios from "axios";
import { NextResponse } from "next/server"

const redirect_url = process.env.NEXT_PUBLIC_BACKEND_REDIRECT_URL;
const SpotifyClientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENTID;
const SpotifyClientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENTSECRET;

export async function POST(req) {
  const body = await req.json();
  const { code, state } = body;
  if (code && state) {
    // const options = {
    //   url: 'https://accounts.spotify.com/api/token',
    //   form: {
    //     code: code,
    //     redirect_uri: redirect_url,
    //     grant_type: 'authorization_code'
    //   },
    //   headers: {
    //     'Authorization': `Basic ${(new Buffer.from(SpotifyClientId + ":" + SpotifyClientSecret).toString('base64'))}`
    //   },
    //   json: true
    // };
    try {
      const response = await axios.post('https://accounts.spotify.com/api/token', {
        code: code,
        redirect_uri: redirect_url,
        grant_type: 'authorization_code'
      }, {
        headers: {
          'Authorization': `Basic ${(new Buffer.from(SpotifyClientId + ":" + SpotifyClientSecret).toString('base64'))}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
      console.error(error.response.data.error)
      return NextResponse.json({ message: "An error occurred while making the request." }, { status: error.response.status });
    }
  } else {
    return NextResponse.json({ message: "There are no code and state." }, { status: 400 });
  }
}