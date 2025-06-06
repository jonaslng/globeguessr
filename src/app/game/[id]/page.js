"use client";

import React, { useCallback, useEffect, useState } from "react";
import Map from "../components/Map";
import StreetView from "../components/StreetView";
import Solution from "../components/Solution";
import {isMobile} from 'react-device-detect';
import MobileMap from "../components/MapMobile";
import { useParams, useSearchParams } from "next/navigation";

import { calculateStatistics, generateCoordsFromMap } from "../_utilities";
import { Skeleton } from "@/components/ui/skeleton";
import { GuessIsland, Toolbar } from "../components/low_level/game_ui";



export default function Game() {
    const [userCoords, setUserCoords] = useState(null);
    const [guessed, setGuessed] = useState(false);
    const [step, setStep] = useState(0);
    const [mapData, setMapData] = useState(null);
    const [mapNr, setMapNr] = useState(0);
    const [stepNr, setStepNr] = useState(1);
    const [error, setError] = useState(null);

    const params = useParams();
    const searchParams = useSearchParams();
    const [statistics,setStatistics] = useState({ steps: [], score: 0, accuracy: 0 });


    let gameData = {
        mapId: params.id,
        steps: (searchParams.get("steps") == null ? 3 : searchParams.get("steps")),
    }


    useEffect(() => {
        const fetchData = async () => {
            const data = await generateCoordsFromMap(gameData.mapId);
            if(data == "error"){
                setError(true);
                return;
            }
            setMapData(data);
        };
        fetchData();
    }, [gameData.mapId]);

    useEffect(() => {
        // Scrollen auf der Seite verhindern
        document.body.style.overflow = "hidden";
        return () => {
            // Scrollen wieder erlauben, wenn die Komponente unmontiert wird
            document.body.style.overflow = "auto";
        };
    }, []);

    // AKTIONEN WENN DER SPIELER GERATEN HAT
    useEffect(() => {
        if (guessed) {
            setStep(step + 1);
            setGuessed(false);
        }
    }, [guessed]);

    let handleGuessed = () => {
        if(stepNr == gameData.steps) {
          //SPIEL IST ZU ENDE
          setStatistics(calculateStatistics(userCoords, mapData[mapNr], statistics))
          console.log("Statistiken: ", statistics);
          setStep(999);
          setGuessed(false);
          console.log("Spiel ist zu Ende");
          setUserCoords(null);
          setMapNr(0);
          
        } else {
          setStatistics(calculateStatistics(userCoords, mapData[mapNr], statistics))
          console.log("Statistiken: ", statistics);
          setStep(0);
          setGuessed(false);
          console.log("neues Streetview-Bild wird geladen");
          setUserCoords(null);
          setMapNr((mapNr + 1) % mapData.length);
          setStepNr(stepNr + 1);
        }
    }


    if(error){

      return (
        <div className="flex flex-col items-center justify-center w-full h-screen">
          <p className="text-2xl font-bold text-red-500">Spiel wurde nicht geladen</p>
        </div>
      );
    }

    if (!mapData) {
        return (
          <div className="flex flex-col items-center justify-center w-full h-screen bg-neutral-900">
            <Skeleton className="bg-neutral-800 h-[30vh] w-[30vw] left-0 bottom-0 fixed mb-[20px] ml-[25px]" />
          </div>
        ) // oder ein schöner Spinner
    }
    
    return (
        <>
            {step === 0 ? (
                <Guessing setGuessed={(g) => setGuessed(g)} url={mapData[mapNr].url} setCoords={(c) => setUserCoords(c)} setMapData={setMapData} mapData={mapData} userCoords={userCoords} />
            ) : step === 999 ?(
                <EndScreen handleclick={() => handleGuessed()} statistics={statistics} />
            ) : (
                <Guessed setGuessed={(g) => setGuessed(g)} userCoords={userCoords} solutionCoords={mapData[mapNr]} handleGuessed={() => handleGuessed()} />
            )}
        </>
    )

}

const Guessing = ({ setGuessed, setCoords, url, setMapData, mapData, userCoords }) => {


    const cancelGame = () => {
        console.log("Spiel wird abgebrochen");
        window.location.href = "/";
    }
    const reloadLocation = () => {
        console.log("streetview wird neu geladen");
        let buffer = mapData;
        setMapData(null);
        setTimeout(() => setMapData(buffer), 500);
    }

    


    return (
        <div className="flex flex-col items-center w-full h-screen overflow-hidden">
            <div>
                <Toolbar reloadLocation={reloadLocation} cancelGame={cancelGame} />

                <StreetView url={url} mobile={isMobile} />

                <MapContainer setGuessed={setGuessed} setCoords={setCoords} mobile={isMobile} />

                {userCoords ? <GuessIsland onClick={() => setGuessed(true)} /> : null}

            </div>
        </div>
    )
}

const Guessed = ({ userCoords, solutionCoords, handleGuessed }) => {
    return (
        <>
            <Solution userCoords={userCoords} solutionCoords={solutionCoords} handleclick={() => handleGuessed()} />
        </>
    )
}

const MapContainer = ({ setGuessed, setCoords, mobile }) => {
    if(mobile) {
        return (
            <div className="left-0 bottom-0 fixed">
                <MobileMap setGuessed={(g) => setGuessed(g)} setUserCoords={(c) => setCoords(c)} />
            </div>
        )
    } else {
        return (
            <div className="right-0 bottom-0 fixed mb-[20px] mr-[25px]">
                <Map setGuessed={(g) => setGuessed(g)} setUserCoords={(c) => setCoords(c)} />
            </div>
        )
    }
}


const EndScreen = ({ statistics }) => {

  return (
    <div>
      Spiel beendet
    </div>
  )
}