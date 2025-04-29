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
import { Button } from "@/components/ui/button";
import { CircleUserRound, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { generateCoordsFromMap } from "../_utilities";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { FaUserAlt } from "react-icons/fa";
import { FiLogIn, FiLogOut } from "react-icons/fi";




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
            <UI user={user} loading={loading}/>
            {step === 0 ? (
                <Guessing setGuessed={(g) => setGuessed(g)} url={mapData[mapNr].url} setCoords={(c) => setUserCoords(c)} />
            ) : (
                <Guessed setGuessed={(g) => setGuessed(g)} userCoords={userCoords} solutionCoords={mapData[mapNr]} handleGuessed={() => handleGuessed()} />
            )}
        </>
    )

}

const UI = ({user, loading }) => {
    const router = useRouter(); // Verwende den korrekten Router-Hook

    const Top = ({user}) => {

        const AvatarX = () => {
          const { logout } = useAuth();
    
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
            <Avatar className="absolute right-0 top-0 m-[15px] cursor-pointer">
              <AvatarImage
                src={user.photoURL}
                alt="Benutzer Avatar"
                className="w-8 h-8 rounded-full"
              />
              <AvatarFallback className="bg-neutral-800 text-white">
                {user.displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-neutral-900 text-white border border-neutral-700">
            <DropdownMenuLabel className="text-neutral-400">{user.displayName}</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-neutral-700" />
            <DropdownMenuItem
              className="cursor-pointer group border-none outline-none"
              onSelect={() => window.open("/account")}
            >
              <DropdownMenuLabel className="text-neutral-300 group-hover:text-neutral-300 cursor-pointer flex flex-row items-center">
                <FaUserAlt className="mr-3" />
                Profil
              </DropdownMenuLabel>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => logout()}
              className="cursor-pointer group border-none outline-none"
            >
              <DropdownMenuLabel className="text-red-400 group-hover:text-red-500 flex flex-row items-center">
                <FiLogOut className="mr-2" />
                Ausloggen
              </DropdownMenuLabel>
            </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }
        const Login = () => {
          return (
            <Button
              variant="outline"
              className="bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white border-neutral-700 absolute right-0 top-0 m-[20px] cursor-pointer"
              onClick={() => signIn()}
            >
              <FiLogIn />
              Anmelden
            </Button>
          );
        }
        const signIn = async () => {
          const provider = new GoogleAuthProvider();
            try {
              await signInWithPopup(auth, provider);
              await checkAndCreateUser(auth.currentUser);
            } catch (err) {
              console.error(err);
            }
        }
    
    
        return (
          <div className="absolute top-0 left-0 w-full h-[10vh] flex flex-row items-center p-[20px]">
            {user ? <AvatarX />  : <Login />}
          </div>
        )
      }


    return (
        <div className="z-50 fixed top-0 left-0 w-full">
            <Top user={user} />
        </div>
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