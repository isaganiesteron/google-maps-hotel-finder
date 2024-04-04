import { NextResponse } from "next/server"

export async function GET(request: Request, params: any) {
	const { nextpage, location } = params.params
	try {
		const parameter = nextpage !== "null" ? `pagetoken=${nextpage}` : `keyword=hotel&location=${location}&radius=1500&type=establishment`
		const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${parameter}&key=${process.env.API_KEY}`
		console.log("Fetching: " + url)
		const response = await fetch(url)
		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.log(error)
		return NextResponse.json({ error }, { status: 500 })
	}
}
