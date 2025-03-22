"use client";

import { useEffect, useState } from "react";
import { createMapURL } from "./_utilities";
import Map from "./components/Map";
import StreetView from "./components/StreetView";
import Solution from "./components/Solution";

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

    return (
        <>
            {step === 0 ? <Guessing setGuessed={(g) => setGuessed(g)} url={data.url} setCoords={(c) => setUserCoords(c)} /> : <Guessed setGuessed={(g) => setGuessed(g)} userCoords={userCoords} solutionCoords={data} />}
        </>
    )

}

const Guessing = ({ setGuessed, setCoords, url }) => {
    return (
        <div className="flex flex-col items-center w-full h-screen overflow-hidden">
            <div>
                <StreetView url={url} />
                <div className="left-0 bottom-0 fixed mb-[20px] ml-[25px]">
                    <Map setGuessed={(g) => setGuessed(g)} setUserCoords={(c) => setCoords(c)} />
                </div>
            </div>
        </div>
    )
}

const Guessed = ({ setGuessed, userCoords, solutionCoords }) => {
    return (
        <>
            <Solution userCoords={userCoords} solutionCoords={solutionCoords} />
        </>
    )
}