"use client"

import { useState } from "react"
import { ChevronDown, Globe, MapPin, Mountain } from "lucide-react"

const mapOptions = [
	{
		id: "world",
		name: "Welt",
		icon: <Globe className="w-4 h-4" />,
	},
	{
		id: "usa",
		name: "United States",
		icon: <MapPin className="w-4 h-4" />,
	},
	{
		id: "europe",
		name: "Europe",
		icon: <Mountain className="w-4 h-4" />,
	},
	{
		id: "asia",
		name: "Asia",
		icon: <Mountain className="w-4 h-4" />,
	},
]

export default function MapPicker({mapOptions = mapOptions, setMap}) {
	const [selectedMap, setSelectedMap] = useState("germany_1")
	const [isOpen, setIsOpen] = useState(false)

	const selectedOption = mapOptions.find((map) => map.id === selectedMap)

	return (
		<div className="relative w-64">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`w-full bg-neutral-300 h-[9vh] border border-neutral-900 px-4 py-3 flex items-center justify-between ${isOpen ? "rounded-t-lg" : "rounded-lg"} hover:bg-neutral-400 cursor-pointer transition-all duration-200`}
			>
				<div className="flex items-center gap-3">
					{selectedOption?.icon}
					<span className="font-medium">{selectedOption?.name}</span>
				</div>
				<ChevronDown
					className={`w-4 h-4 transition-transform ${
						isOpen ? "rotate-180" : ""
					}`}
				/>
			</button>

			{isOpen && (
				<div className="absolute top-full rounded-lg left-0 right-0 bg-neutral-300 border border-neutral-900 border-t-0 z-10">
					{mapOptions.map((map) => (
						<button
							key={map.id}
							onClick={() => {
								setSelectedMap(map.id)
								setIsOpen(false)
								setMap(map.id)
							}}
							className={`w-full px-4 py-3 flex items-center justify-between hover:bg-neutral-400 transition-colors ${
								selectedMap === map.id ? "bg-neutral-700 text-white hover:bg-neutral-800" : ""
							}`}
						>
							<div className="flex items-center gap-3">
								{map.icon}
								<span className="font-medium">{map.name}</span>
							</div>
						</button>
					))}
				</div>
			)}
		</div>
	)
}
