"use client";

import React, { use, useEffect, useState } from "react";
import Map from "../components/Map";
import StreetView from "../components/StreetView";
import Solution from "../components/Solution";
import {BrowserView, isMobile, MobileView} from 'react-device-detect';
import MobileMap from "../components/MapMobile";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation"; // Korrigiere den Import von useRouter
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";

import { auth } from "@/app/firebase";
import { db } from "@/app/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { TbBrandGoogle, TbBrandGoogleFilled, TbCircleXFilled } from "react-icons/tb";
import { Button } from "@/app/components/ui/button";
import { CircleUserRound, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "@/app/components/ui/dialog";
import { generateCoordsFromMap } from "../_utilities";




const checkAndCreateUser = async (user) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
        if(!user.emailVerified) auth.currentUser.sendEmailVerification();

        await setDoc(userRef, {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            createdAt: new Date(),
            statistics: {
                gamesPlayed: 0,
                gamesWon: 0,
                bestScore: 0,
                accuracy: 0,
            },
            settings: {
                theme: "dark",
                mapType: "normal",
            },
            achievements: [],
            friends: []
        });
    }
};


export default function Game({ params }) {
    const unwrappedParams = use(params);
    const [userCoords, setUserCoords] = useState(null);
    const [guessed, setGuessed] = useState(false);
    const [step, setStep] = useState(0);
    const [modal, setModal] = useState(false);
    const [mapData, setMapData] = useState(null);
    const [mapNr, setMapNr] = useState(0);

    const { user, loading } = useAuth();
    const mapId = unwrappedParams.id;

    useEffect(() => {
        const fetchData = async () => {
            const data = await generateCoordsFromMap(mapId);
            setMapData(data);
        };
        fetchData();
    }, [mapId]);

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
        setMapNr((mapNr + 1) % mapData.length);
    }

    if (!mapData) {
        return <div>Loading...</div>; // oder ein schöner Spinner
    }
    
    return (
        <>
            <UI user={user} loading={loading} setModal={setModal} />
            {step === 0 ? (
                <Guessing setGuessed={(g) => setGuessed(g)} url={mapData[mapNr].url} setCoords={(c) => setUserCoords(c)} />
            ) : (
                <Guessed setGuessed={(g) => setGuessed(g)} userCoords={userCoords} solutionCoords={mapData[mapNr]} handleGuessed={() => handleGuessed()} />
            )}
            {modal && <UserModal user={user} setModal={setModal} />}
        </>
    )

}

const UI = ({user, loading, setModal }) => {
    const router = useRouter(); // Verwende den korrekten Router-Hook


    const handleClick = async () => {
        if (user) {
            setModal(true);
        } else {
            const provider = new GoogleAuthProvider();
            try {
                await signInWithPopup(auth, provider);
                await checkAndCreateUser(auth.currentUser);
            } catch (err) {
                console.error(err);
            }
        }
    }


    return (
        <Button disabled={loading ? true : false} onClick={() => handleClick()} className="absolute top-0 right-0 mt-[10px] mr-[10px] z-50">
            {loading ? <Loader2 className="animate-spin" /> : user ? <CircleUserRound size={25} /> : <TbBrandGoogleFilled size={25} />}
            {loading ? "Lade..." : user ? user.displayName : "Anmelden"}
        </Button>   
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

const UserModal = ({ user, setModal }) => {



    return (
        <Dialog open={true} onOpenChange={setModal}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-center">Willkommen {user.displayName}</DialogTitle>
                    <DialogDescription className="text-center">Hier kannst du deine Statistiken und Einstellungen einsehen.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center mt-5">
                    <Button onClick={() => signOut(auth)} variant="outline" className="w-full">
                        Abmelden
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}