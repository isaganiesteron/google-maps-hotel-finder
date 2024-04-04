import { NextResponse } from "next/server"
import cities from "../../../../../mockdata/cities"

export async function GET(request: Request, params: any) {
	const { type, input, token } = params.params
	try {
		// console.log("token", token)
		// return NextResponse.json(cities) // ***Mock data

		const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=${type}&sessiontoken=${token}&key=${process.env.API_KEY}`
		const response = await fetch(url)
		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.log(error)
		return NextResponse.json({ error }, { status: 500 })
	}
}
