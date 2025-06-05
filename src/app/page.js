"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FaGithub, FaUserAlt } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { useState } from "react";
import FeaturedMaps from "./game/components/FeaturedMaps";

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

    const mapsFeatured = [
      {
        "id": "germany_1",
        "name": "Deutschland",
        "description": "Deutschland ist ein Land in Mitteleuropa, das für seine reiche Geschichte, Kultur und Wirtschaft bekannt ist. Es ist das bevölkerungsreichste Land der Europäischen Union und hat eine Vielzahl von Landschaften, von den Alpen im Süden bis zu den Küsten im Norden.",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/2560px-Flag_of_Germany.svg.png",
        "difficulty": "medium",
      },
      {
        "id": "france_1",
        "name": "Frankreich",
        "description": "Frankreich ist ein Land in Westeuropa, das für seine reiche Geschichte, Kultur und Gastronomie bekannt ist. Es ist das drittgrößte Land der Europäischen Union und hat eine Vielzahl von Landschaften, von den Alpen im Osten bis zu den Stränden an der Côte d'Azur im Süden.",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/2560px-Flag_of_France.svg.png",
        "difficulty": "medium",
      },
      {
        "id": "italy_1",
        "name": "Italien",
        "description": "Italien ist ein Land in Südeuropa, das für seine reiche Geschichte, Kultur und Gastronomie bekannt ist. Es ist das drittgrößte Land der Europäischen Union und hat eine Vielzahl von Landschaften, von den Alpen im Norden bis zu den Stränden an der Küste.",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/2560px-Flag_of_Italy.svg.png",
        "difficulty": "medium",
      },
      {
        "id": "usa_1",
        "name": "Vereinigte Staaten",
        "description": "Die Vereinigten Staaten sind ein Land in Nordamerika, das für seine reiche Geschichte, Kultur und Wirtschaft bekannt ist. Es ist das drittgrößte Land der Welt und hat eine Vielzahl von Landschaften, von den Rocky Mountains im Westen bis zu den Stränden an der Ostküste.",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/2560px-Flag_of_the_United_States.svg.png",
        "difficulty": "hard",
      }
    ]


    return (
      <div>
        <button className="w-[15vw] h-[9vh] font-bold bg-neutral-300 text-neutral-700 p-4 rounded-lg mb-4 hover:bg-neutral-400 cursor-pointer transition-colors duration-200" onClick={() => window.location.href = "/game/usa_1"}>
          Spielen
        </button>
      </div>
    )
  }