"use client"
import { useState } from "react"
import { v4 as uuidv4 } from "uuid"

import Result from "@/components/Result"
// import Spinner from "@/components/Spinner"

export default function Home() {
	const [data, setData] = useState<object[]>([])
	const [userInput, setUserInput] = useState<string>("")
	// const [status, setstatus] = useState<string>("")
	// const [isLoading, setIsLoading] = useState<boolean>(false)

	const fetchAllHotels = async (neighborhood: string) => {
		if (neighborhood === "") return
		let fetchedHotels: any[] = []
		let nextPageToken = null
		let fetchingDone = false

		while (!fetchingDone) {
			const response: any = await fetch(nextPageToken ? `/api/hotels/${nextPageToken}/null` : `/api/hotels/null/${neighborhood}`)
			const data = await response.json()

			if (data) {
				if (data.next_page_token) {
					nextPageToken = data.next_page_token
					console.log("Pausing for 2 seconds") // Without a pause the next fetch will return INVALID_REQUEST
					await new Promise((resolve) => setTimeout(resolve, 2000))
				} else {
					fetchingDone = true
				}
				fetchedHotels = [...fetchedHotels, ...data.results]
			} else {
				console.log("ERROR: no places found")
				console.log(data)
				fetchingDone = true
			}
			// sort fetchedHotels by name field
			fetchedHotels.sort((a, b) => a.name.localeCompare(b.name))
			setData(fetchedHotels)
		}
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify">
			<h1 className="text-2xl p-4">Google Hotels by Neighborhood</h1>
			<div className="flex flex-row gap-1 w-full justify-center">
				<input type="text" placeholder="Enter a location to search for hotels" value={userInput} className="w-1/2 border border-black rounded-md p-[5.5px]" onChange={(event) => setUserInput(event.target.value)} />
				<button className="border border-black rounded-md p-2 hover:bg-gray-200" onClick={() => fetchAllHotels(userInput)}>
					Search Hotels
				</button>
			</div>

			<div className="w-full">
				{data.map((x, i) => (
					<Result key={i} result={x} index={i} />
				))}
			</div>
		</main>
	)
}
