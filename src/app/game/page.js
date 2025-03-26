"use client";

import { useEffect, useState } from "react";
import { createMapURL } from "./_utilities";
import Map from "./components/Map";
import StreetView from "./components/StreetView";
import Solution from "./components/Solution";
import {BrowserView, isMobile, MobileView} from 'react-device-detect';
import MobileMap from "./components/MapMobile";


export default function Game() {
    const [data, setData] = useState(createMapURL());
    const [userCoords, setUserCoords] = useState(null);
    const [guessed, setGuessed] = useState(false);
    const [step, setStep] = useState(0);

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
        setStep(0);
        setGuessed(false);
        console.log("neues Streetview-Bild wird geladen");
        setUserCoords(null);
        setData(createMapURL());
    }

    return (
        <>
            {step == 0 ? <Guessing setGuessed={(g) => setGuessed(g)} url={data.url} setCoords={(c) => setUserCoords(c)} /> : <Guessed setGuessed={(g) => setGuessed(g)} userCoords={userCoords} solutionCoords={data} handleGuessed={() => handleGuessed()} />}
        </>
    )

}

const Guessing = ({ setGuessed, setCoords, url }) => {
    return (
        <div className="flex flex-col items-center w-full h-screen overflow-hidden">
            <div>
                <StreetView url={url} mobile={isMobile} />

                <MapContainer setGuessed={setGuessed} setCoords={setCoords} mobile={isMobile} />

            </div>
        </div>
    )
}

const Guessed = ({ setGuessed, userCoords, solutionCoords, handleGuessed }) => {
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
            <div className="left-0 bottom-0 fixed mb-[20px] ml-[25px]">
                <Map setGuessed={(g) => setGuessed(g)} setUserCoords={(c) => setCoords(c)} />
            </div>
        )
    }
}