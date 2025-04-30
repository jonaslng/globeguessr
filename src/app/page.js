"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FaGithub, FaUserAlt } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../app/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import { Badge } from "@/components/ui/badge"

export const checkAndCreateUser = async (user) => {
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


export default function Home() {

  const {user, loading} = useAuth();


  return (
    <div className="flex bg-neutral-900 items-center justify-center h-screen w-full">
      <Top user={user} />

      <MapsFeatured />

      <Bottom />
    </div>
  );
}





  const Bottom = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
      <div className="absolute bottom-0 right-0 w-full h-[10vh] flex flex-row items-center p-[20px]">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white border-neutral-700 cursor-pointer"
            >
              <FaGear />

            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px] bg-neutral-900 text-white border-neutral-700">
            <DialogHeader>
              <DialogTitle>Einstellungen</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                type="submit"
                className="bg-neutral-800 text-white hover:bg-neutral-700 border-neutral-700"
                onClick={() => setIsDialogOpen(false)}
              >
                Speichern
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          className="bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white border-neutral-700 ml-[15px] cursor-pointer"
          onClick={() => window.open("https://github.com/jonaslng/globeguessr", "_blank")}
        >
          <FaGithub />
        </Button>
      </div>
    );
  };
  const Top = ({user}) => {

    const AvatarX = () => {
      const { logout } = useAuth();

      return (
        <DropdownMenu className="mr-[20px]">
          <DropdownMenuTrigger asChild>
        <Avatar className="absolute right-0 top-0 m-[20px] cursor-pointer">
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
          <DropdownMenuContent className="w-56 bg-neutral-900 text-white border border-neutral-700 mr-[20px] mt-[10px]">
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
      <Carousel
      opts={{
      align: "start",
      }}
      className="w-full max-w-sm"
    >
      <CarouselContent>
        {mapsFeatured.map((map) => (
          <CarouselItem key={map.id} className="w-full h-[80vh] flex flex-col items-center justify-center">
            <Card className="w-full h-full bg-neutral-800 text-white border border-neutral-700">
              <CardContent className="flex flex-col items-center justify-center">
                <img src={map.image} alt={map.name} className="w-full h-[50%] object-cover" />
                <h2 className="text-xl font-bold mt-4">{map.name}</h2>
                <Badge
                  className={" text-white mt-2 "+ (map.difficulty === "easy" ? "bg-green-600" : map.difficulty === "medium" ? "bg-yellow-600" : "bg-red-600")}
                  size="default"
                  
                >
                  {map.difficulty.charAt(0).toUpperCase() + map.difficulty.slice(1)}
                </Badge>
                <p className="text-sm text-neutral-400 mt-2">{map.description}</p>
                
                <Button
                  variant="outline"
                  className="bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white border-neutral-700 mt-4 cursor-pointer"
                  onClick={() => window.open(`/game/${map.id}`, "_self")}
                >
                  Spielen
                </Button>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-neutral-300 border-none" />
      <CarouselNext className="bg-neutral-300 border-none" />
    </Carousel>
      </div>
    )
  }