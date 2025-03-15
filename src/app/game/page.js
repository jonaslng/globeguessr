"use client";

import { useEffect, useState } from "react";
import { createMapURL } from "./_utilities";
import Map from "./components/Map";
import StreetView from "./components/StreetView";

export default function Game() {
    let url = createMapURL();

    useEffect(() => {
        // Scrollen auf der Seite verhindern
        document.body.style.overflow = "hidden";
        return () => {
            // Scrollen wieder erlauben, wenn die Komponente unmontiert wird
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <>
            <div className="flex flex-col items-center w-full h-screen overflow-hidden">
                <div>
                    <StreetView />
                    <div className="left-0 bottom-0 fixed mb-[40px] ml-[55px]">
                        <Map />
                    </div>
                </div>
            </div>
        </>
    );
}