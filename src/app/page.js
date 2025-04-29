"use client";

import { Button } from "@/app/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { FaGithub, FaUserAlt } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from "@/app/components/ui/dropdown-menu";
import { DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../app/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

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


export default function Home() {

  const {user, loading} = useAuth();


  return (
    <div className="flex bg-neutral-900 items-center justify-center h-screen w-full">
      <Top user={user} />



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
        <DropdownMenu>
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