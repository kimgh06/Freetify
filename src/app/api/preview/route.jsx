import { NextResponse } from "next/server";
import urlMetadata from "url-metadata";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get('url') || ''

    const result = await urlMetadata(url, {
      cache: 'force-cache',
    })
    // console.log(result)

    const ogData = {
      ogTitle: result['og:title'],
      ogUrl: result['og:url'],
      ogImage: result['og:image'] || result['image'],
      ogDescription: result['og:description'],
      ogSiteName: result['og:site_name']
    }

    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: "Interval Server Errors" }, { status: 500 })
  }
}