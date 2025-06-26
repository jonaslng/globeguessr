"use client";

import { FaGithub } from "react-icons/fa";
import { useState } from "react";
import MapPicker from "./game/components/low_level/map_picker";
import { CircleFlag } from "react-circle-flags";

const mapsFeatured = [
      {
        "id": "germany_1",
        "name": "Germany",
        "description": "Deutschland ist ein Land in Mitteleuropa, das für seine reiche Geschichte, Kultur und Wirtschaft bekannt ist. Es ist das bevölkerungsreichste Land der Europäischen Union und hat eine Vielzahl von Landschaften, von den Alpen im Süden bis zu den Küsten im Norden.",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/2560px-Flag_of_Germany.svg.png",
        "difficulty": "medium",
        "icon": <CircleFlag countryCode="de" className="w-6 h-6" />
      },
      {
        "id": "france_1",
        "name": "France",
        "description": "Frankreich ist ein Land in Westeuropa, das für seine reiche Geschichte, Kultur und Gastronomie bekannt ist. Es ist das drittgrößte Land der Europäischen Union und hat eine Vielzahl von Landschaften, von den Alpen im Osten bis zu den Stränden an der Côte d'Azur im Süden.",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/2560px-Flag_of_France.svg.png",
        "difficulty": "medium",
        "icon": <CircleFlag countryCode="fr" className="w-6 h-6" />
      },
      {
        "id": "italy_1",
        "name": "Italy",
        "description": "Italien ist ein Land in Südeuropa, das für seine reiche Geschichte, Kultur und Gastronomie bekannt ist. Es ist das drittgrößte Land der Europäischen Union und hat eine Vielzahl von Landschaften, von den Alpen im Norden bis zu den Stränden an der Küste.",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/2560px-Flag_of_Italy.svg.png",
        "difficulty": "medium",
        "icon": <CircleFlag countryCode="it" className="w-6 h-6" />
      },
      {
        "id": "usa_1",
        "name": "United States",
        "description": "Die Vereinigten Staaten sind ein Land in Nordamerika, das für seine reiche Geschichte, Kultur und Wirtschaft bekannt ist. Es ist das drittgrößte Land der Welt und hat eine Vielzahl von Landschaften, von den Rocky Mountains im Westen bis zu den Stränden an der Ostküste.",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/2560px-Flag_of_the_United_States.svg.png",
        "difficulty": "hard",
        "icon": <CircleFlag countryCode="us" className="w-6 h-6" />
      },
      {
        "id": "world_1",
        "name": "World",
        "description": "Die Welt ist der Planet, auf dem wir leben, und umfasst eine Vielzahl von Ländern, Kulturen und Landschaften. Sie ist der einzige bekannte Planet, der Leben beherbergt, und hat eine reiche Geschichte, die von der Entwicklung der Menschheit geprägt ist.",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/3//3e/Flag_of_the_World.svg/2560px-Flag_of_the_World.svg.png",
        "difficulty": "hard",
        "icon": <CircleFlag countryCode="nato" className="w-6 h-6" />
      }
    ]



export default function Home() {


    return (
      <div className="flex bg-neutral-900 items-center justify-center h-screen w-full">
      

      <MapsFeatured />

      <Bottom />
      </div>
    );
}





  const Bottom = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
      <div className="absolute bottom-0 right-0 w-full h-[10vh] flex flex-row items-center p-[20px]">
      <FaGithub
        size={30}
        className="text-[rgba(255,255,255,0.5)] hover:text-[rgba(255,255,255,0.8)] cursor-pointer transition-all duration-250"
        onClick={() => window.open("https://github.com/jonaslng/globeguessr", "_blank")}
      />
      </div>
    );
  };


  const MapsFeatured = () => {

    const [selectedMap, setSelectedMap] = useState("germany_1");

    return (
      <div className="flex flex-col items-center justify-center w-full h-[80vh] mb-[35vh]"> 

        <div className="cursor-pointer hover:scale-105 transition-all duration-200"  >
          <img src="/logos/logo_blue.svg" alt="Logo" width={350} height={350} />
        </div>

        <div className="flex flex-row items-center justify-center h-[10vh]">
          <MapPicker mapOptions={mapsFeatured} setMap={setSelectedMap} />
          <button className="ml-[20px] w-[15vw] h-[9vh] font-bold bg-neutral-300 text-neutral-700 mb-[2px] p-4 rounded-lg hover:bg-neutral-400 cursor-pointer transition-colors duration-200" onClick={() => window.location.href = "/game/" + selectedMap}>
            Play
          </button>
        </div>

      </div>
    )
  }