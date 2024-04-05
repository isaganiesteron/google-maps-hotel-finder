import { NextResponse } from "next/server"

export async function GET(request: Request, params: any) {
	const { nextpage, location } = params.params
	try {
		const parameter = nextpage !== "null" ? `pagetoken=${nextpage}` : `location=${location}&radius=100000&type=lodging`
		const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${parameter}&key=${process.env.API_KEY}`
		console.log("Fetching: " + url)
		const response = await fetch(url)
		const data = await response.json()

		// /** FOR DEV PURPOSES */
		// const mappedData = {
		// 	next_page_token: data.next_page_token,
		// 	next_page_token_link: `http://localhost:3000/api/nearby/${data.next_page_token}/null`,
		// 	count: data.results.length,
		// 	results: data.results.map((result: any) => {
		// 		return {
		// 			name: result.name,
		// 			types: result.types,
		// 		}
		// 	}),
		// }
		// return NextResponse.json(mappedData)
		// /** FOR DEV PURPOSES */

		return NextResponse.json(data)
	} catch (error) {
		console.log(error)
		return NextResponse.json({ error }, { status: 500 })
	}
}
