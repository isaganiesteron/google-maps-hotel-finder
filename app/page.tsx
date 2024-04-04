"use client"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import Result from "@/components/Result"
import Spinner from "@/components/Spinner"

export default function Home() {
	const [data, setData] = useState<object[]>([])
	const [userInput, setUserInput] = useState<string>("")
	const [autoSuggestToken, setAutoSuggestToken] = useState<string>("")
	const [status, setstatus] = useState<string>("")
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [suggestedCities, setSuggestedCities] = useState<object[]>([])

	const getPlaces = async (textQuery: string) => {
		if (textQuery === "") return
		setData([])
		setIsLoading(true)
		setstatus(`Attempting to search for places with input of "${textQuery}"`)

		let fetchedPlaces: any[] = []
		let nextPageToken = null
		let fetchingDone = false

		while (!fetchingDone) {
			const response: any = await fetch(nextPageToken ? `/api/places/${nextPageToken}/${textQuery}` : `/api/places/null/${textQuery}`)
			const data = await response.json()

			console.log(data)

			if (data) {
				if (data.next_page_token) {
					console.log("TOKEN EXISTS!!")
					nextPageToken = data.next_page_token
				} else fetchingDone = true

				fetchedPlaces = [...fetchedPlaces, ...data.results]
			} else {
				console.log("ERROR: no places found")
				console.log(data)
				fetchingDone = true
			}
		}

		setstatus(`Found ${fetchedPlaces.length} places for "${textQuery}"`)
		setIsLoading(false)
		setData(fetchedPlaces)
	}

	const getCitySuggestions = async (textQuery: string) => {
		if (textQuery === "") return

		const response: any = await fetch(`/api/autocomplete/(cities)/${textQuery}/${autoSuggestToken}`)
		const data = await response.json()

		if (data.predictions)
			setSuggestedCities(
				data.predictions.map((x: any) => {
					return { label: x.description, place_id: x.place_id }
				})
			)
		else setSuggestedCities([])
	}

	const getHotelsInCity = async (place_id: string) => {
		console.log("Getting hotels in city with place_id: " + place_id)
		const response: any = await fetch(`/api/detail/${place_id}`)
		const data = await response.json()

		console.log("Place Detail Found")
		console.log(data)

		const hotelLocation = data.location || null

		if (hotelLocation) {
			const longLat = `${hotelLocation.latitude},${hotelLocation.longitude}`
			console.log("Hotel location: ", longLat)

			let fetchedHotels: any[] = []
			let nextPageToken = null
			let fetchingDone = false
			let counter = 0

			while (!fetchingDone) {
				counter++
				const response: any = await fetch(nextPageToken ? `/api/nearby/${nextPageToken}/null` : `/api/nearby/null/${longLat}`)
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
				console.log(counter + " Single Fetch Done")
				console.log(data)
				setData(fetchedHotels)
			}
			setData(fetchedHotels)
			// now get all hotels within this location with a radius of
		} else {
			console.log("ERROR: no location found")
		}
	}

	useEffect(() => {
		console.log(suggestedCities)
	}, [suggestedCities])

	return (
		<main className="flex min-h-screen flex-col items-center justify">
			<h1 className="text-2xl p-4">Google Hotel Finder</h1>
			<div className="flex flex-row gap-1 w-full justify-center">
				<input
					type="text"
					placeholder="Enter a location to search for hotels"
					value={userInput}
					className="w-1/2 border border-black rounded-md p-[5.5px]"
					onFocus={() => {
						if (autoSuggestToken === "") setAutoSuggestToken(uuidv4())
					}}
					onBlur={() => {
						setAutoSuggestToken("")
						setTimeout(() => setSuggestedCities([]), 500)
					}}
					onChange={(event) => {
						setUserInput(event.target.value)
						if (event.target.value.length > 3) getCitySuggestions(userInput)
					}}
				/>
			</div>
			{suggestedCities.length > 0 && (
				<div className="w-1/2 border border-black rounded-md flex flex-col">
					{suggestedCities.map((x, i) => {
						return (
							<div key={i} className="flex p-1 hover:bg-slate-200 rounded-md">
								<button
									className="flex flex-col justify-start w-full m-1"
									onClick={() => {
										getHotelsInCity(x["place_id" as keyof typeof x])
										setUserInput(x["label" as keyof typeof x])
										setSuggestedCities([])
									}}
								>
									<h1 className="font-bold">{x["label" as keyof typeof x]}</h1>
								</button>
							</div>
						)
					})}
				</div>
			)}

			<div className="flex flex-row items-center p-4">
				{isLoading && <Spinner />}
				<h1 className="text-xl">{status}</h1>
			</div>

			<div className="w-full">
				{data.map((x, i) => (
					<Result key={i} result={x} />
				))}
			</div>
		</main>
	)
}
