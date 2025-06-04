"use client";

import React, { use, useEffect, useState } from "react";
import Map from "../components/Map";
import StreetView from "../components/StreetView";
import Solution from "../components/Solution";
import {BrowserView, isMobile, MobileView} from 'react-device-detect';
import MobileMap from "../components/MapMobile";
import { useAuth } from "../../context/AuthContext";
import { useParams, useRouter, useSearchParams } from "next/navigation"; // Korrigiere den Import von useRouter
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";

import { auth } from "@/app/firebase";
import { db } from "@/app/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { TbBrandGoogle, TbBrandGoogleFilled, TbCircleXFilled } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { CircleUserRound, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { calculatePoints, calculateStatistics, generateCoordsFromMap, getAccuracyLabel, getDistanceInKm } from "../_utilities";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { FaCloudUploadAlt, FaHockeyPuck, FaHome, FaUserAlt } from "react-icons/fa";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MdError } from "react-icons/md";
import { IoMdCloudDone } from "react-icons/io";
import { FaCirclePlay } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Badge } from "@/components/ui/badge";



const checkAndCreateUser = async (user) => {
    if (!user) return "error";
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
        if(!user.emailVerified) auth.currentUser.sendEmailVerification();

        await setDoc(userRef, {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            createdAt: new Date(),
            xp: 0,
            level: 1,
            statistics: {
              games: [],
            },
            settings: {
                theme: "dark",
                mapType: "normal",
            },
            achievements: [],
            friends: []
        });
        return "success";
    } else return "error"
};

const uploadUserStatistics = async (user, statistics) => {
    if (!user) return "error";
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      console.log("UPLOADING USER DATA "+" "+statistics.steps+" "+statistics.score+" "+statistics.accuracy+" "+statistics.distance);
        const userData = userSnap.data();
        const games = userData.statistics.games || [];
        games.push({
            steps: statistics.steps,
            score: statistics.score,
            accuracy: statistics.accuracy,
            date: new Date(),
        });
        await setDoc(userRef, {
            ...userData,
            xp: userData.xp + statistics.score,
            statistics: {
                games: games,
            },
        });
        return "success";
    } return "error";
}



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
    

    const { user, loading } = useAuth();

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
            <UI user={user} loading={loading}/>
            {step === 0 ? (
                <Guessing setGuessed={(g) => setGuessed(g)} url={mapData[mapNr].url} setCoords={(c) => setUserCoords(c)} />
            ) : step === 999 ?(
                <EndScreen handleclick={() => handleGuessed()} statistics={statistics} />
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
              <DropdownMenuContent className="w-56 bg-neutral-900 text-white border border-neutral-700 mr-[2vw]">
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


const EndScreen = ({ statistics }) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const uploadStatistics = async () => {
      setLoading(true);
      try {
        if(await uploadUserStatistics(auth.currentUser, statistics) == "error") {
          setError("Fehler beim Hochladen der Statistiken");
          setLoading(false);
          return;
        } else setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Fehler beim Hochladen der Statistiken");
        setLoading(false);
      }
    };

    if (auth.currentUser) {
      uploadStatistics();
    }
  }, []);

  return (
    <div className="flex flex-col items-center w-full h-screen bg-neutral-900">
      

      <div className="absolute top-0 left-0 w-full flex flex-row items-center justify-center mt-[4vh]">
        <div className="flex flex-row items-center">
          <h1 className="text-3xl font-bold text-white mr-[15px]">Spiel beendet</h1>
          {
            loading ? (
              <FaCloudUploadAlt size={30} className="text-neutral-400" />
            ) : error ? (
              <></>
            ) : (
              <IoMdCloudDone size={30} className="text-green-500" />
            )
          }
        </div>
      </div>


      <Card className="w-[94vw] h-[55vh] bg-neutral-900 border border-none shadow-none mt-[10vh]">
        <CardContent className="flex flex-col items-center justify-center">

            <Tabs className="w-[80vw] mt-[2vh] flex items-center" defaultValue="Übersicht">

              <TabsList className="bg-neutral-800 border-b border-neutral-800 w-[40vw] h-[6vh]">

                <TabsTrigger
                    className="bg-neutral-800 text-white data-[state=active]:bg-neutral-900 data-[state=active]:text-white"
                    value="Übersicht"
                >
                    Übersicht
                </TabsTrigger>
            </TabsList>
            <TabsContent
                className="bg-neutral-900 text-white"
                value="Übersicht"
            >
                <Overview statistics={statistics} />
            </TabsContent>
            <TabsContent
                className="bg-neutral-900 text-white"
                value="Punkte"
            >
                <Statistics statistics={statistics} />

            </TabsContent>


                
    </Tabs>
          

        </CardContent>
      </Card>
      <div className="flex flex-row items-center justify-center w-screen">
        <Button onClick={() => window.location.reload()} variant="primary" className="bg-neutral-300 text-neutral-900 hover:bg-neutral-400 border-neutral-700 text-sm cursor-pointer">
          <FaCirclePlay /> Nochmal Spielen
        </Button>
        <Button onClick={() => window.location.href = "/"} variant="primary" className="bg-neutral-300 text-neutral-900 hover:bg-neutral-400 border-neutral-700 text-sm ml-3 cursor-pointer">
          <FaHome /> Beenden
        </Button>
      </div>
    
    </div>
  )
}


const Statistics = ({ statistics }) => {

  let chartData = statistics.steps.map((step, index) => ({
    Bild: `Bild ${index + 1}`,
    distance: step.points,
  }));

  return (
    <div>

      
          <ChartContainer className="w-[50vw] h-[30vh] mt-4 bg-neutral-900" config={{ theme: "default", color: "#8884d8" }}>
            <AreaChart
              width={300}
              height={150}
              data={chartData}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              className="bg-neutral-900"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Bild" tick={{ fontSize: 10 }} />
              <Area type="monotone" dataKey="distance" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ChartContainer>
    </div>
  )
}

const Overview = ({ statistics }) => {

  return (
    <div className="flex flex-col items-center h-[30vh] w-[40vw] bg-neutral-900">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Badge 
          variant="outline" 
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 border-none text-white text-sm mb-2 flex flex-row items-center animate-gradient-x"
        >
          <NumberTicker value={statistics.score} className="text-white text-xl"/> <p className="mt-[2px]">XP verdient</p>
        </Badge>
      </div>
    </div>
  )
}