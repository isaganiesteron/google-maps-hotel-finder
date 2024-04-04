import { NextResponse } from "next/server"

export async function GET(request: Request, params: any) {
	const { searchtext, nextpage } = params.params
	try {
		const parameter = nextpage !== "null" ? `pagetoken=${nextpage}` : `query=${searchtext}`
		const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?${parameter}&key=${process.env.API_KEY}`
		const response = await fetch(url)
		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.log(error)
		return NextResponse.json({ error }, { status: 500 })
	}
}
