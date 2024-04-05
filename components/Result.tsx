import React, { useEffect, useState } from "react"
import Image from "next/image"
import Spinner from "@/components/Spinner"

const Result = ({ result, index }: { result: object; index: number }) => {
	const [photoUrls, setPhotoUrls] = useState<string[]>([])
	const [photosLoading, setPhotosLoading] = useState<boolean>(false)

	const _getImageUrl = async (id: string) => {
		const response = await fetch(`/api/image/${encodeURIComponent(id)}`)
		const imageUrl = await response.json()
		return imageUrl
	}

	const _handleGetPhotos = async (photos: object[]) => {
		setPhotosLoading(true)
		let photoUrls: string[] = []
		let counter = 0
		while (counter < photos.length) {
			const current = photos[counter]
			const photoUrl = await _getImageUrl(current["name" as keyof typeof current])
			photoUrls.push(photoUrl)
			counter++
		}
		setPhotoUrls(photoUrls)
		setPhotosLoading(false)
	}
	const businessName = result["name" as keyof typeof result]
	const photos = result["photos" as keyof typeof result] as object[] // Update the type of photos array
	const types = result["types" as keyof typeof result] as string[] // Update the type of types array

	return (
		<div className="p-2 m-1 flex flex-col border border-black rounded-md gap-5">
			<div>
				<p className="text-[30px] font-bold">{`${index + 1}) ${businessName}`}</p>
				<p>{`Rating: ${result["rating" as keyof typeof result]} (${result["user_ratings_total" as keyof typeof result]} ratings)`}</p>
				<p>Types: {types.join(", ")}</p>
			</div>
			<div>
				<div className="flex flex-row gap-3  items-center">
					<p className="text-[20px] font-bold">Photos:</p>
					<button className="text-xs border border-black rounded-md p-1 bg-green-100 hover:bg-green-300" onClick={() => _handleGetPhotos(photos)}>
						Get all Photos
					</button>
				</div>
				{photosLoading && (
					<div className="flex justify-center items-center min-h-20 align-middle transition-opacity ease-in-out duration-500">
						<Spinner />
					</div>
				)}
				{photoUrls.length > 0 && (
					<div className="flex flex-row flex-wrap gap-3 justify-center my-5">
						{photoUrls.map((x, i) => {
							return (
								<div key={i}>
									<Image className="border border-black rounded-md" src={x} width="220" height="220" alt={`alt text`} />
								</div>
							)
						})}
					</div>
				)}
			</div>
		</div>
	)
}

export default Result
