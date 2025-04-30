"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useAuth } from "../context/AuthContext"
import { cn } from "../lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { FiLogIn } from "react-icons/fi"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { checkAndCreateUser } from "../page"

import { auth, db } from "../firebase";



export default function Account() {

      const {user, loading, logout} = useAuth();

      const signIn = async () => {
            const provider = new GoogleAuthProvider();
              try {
                await signInWithPopup(auth, provider);
                await checkAndCreateUser(auth.currentUser);
              } catch (err) {
                console.error(err);
              }
          }


      if(!loading && !user) {

        return (
          <div className="w-screen h-screen flex items-center justify-center bg-neutral-900">
            <Button
          variant="outline"
          className="bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white border-neutral-700 cursor-pointer"
          onClick={() => signIn()}
        >
          <FiLogIn />
          Anmelden
        </Button>
          </div>
        )
      }

    if (loading) {
        return <Loading />
    } else {
        return (
            <div className="flex flex-col bg-neutral-900 items-center h-screen w-full">
                
                    <Avatar className="w-30 h-30 bg-neutral-800 border border-neutral-800 mt-[5vh]">
                        <AvatarImage
                            src={user.photoURL}
                            alt="Benutzer Avatar"
                            className="rounded-full"
                        />
                        <AvatarFallback className="bg-neutral-800 text-white">
                            {user.displayName.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-center text-3xl text-white font-bold mt-[3vh]">
                        {user.displayName}
                    </CardTitle>
                    <CardDescription className="text-center text-lg text-neutral-400 font-light mt-1">
                        {user.email}
                    </CardDescription>
                    <Tabs className="w-[80vw] mt-[2vh] flex items-center" defaultValue="Konto">

                        <TabsList className="bg-neutral-800 border-b border-neutral-800 w-[40vw] h-[6vh]">

                            <TabsTrigger
                                className="bg-neutral-800 text-white data-[state=active]:bg-neutral-900 data-[state=active]:text-white"
                                value="Konto"
                            >
                                Konto
                            </TabsTrigger>
                            <TabsTrigger
                                className="bg-neutral-800 text-white data-[state=active]:bg-neutral-900 data-[state=active]:text-white"
                                value="Statistiken"
                            >
                                Statistiken
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent
                            className="bg-neutral-800 text-white"
                            value="Konto"
                        >
                        
                        </TabsContent>
                        <TabsContent
                            className="bg-neutral-800 text-white"
                            value="Statistiken"
                        >



                        </TabsContent>


                                    
                    </Tabs>
    
                                        
    
    
    
                                    
    
            </div>
        )
    }   


    
}


const Loading = () => {

    return (
      <div className="flex flex-col bg-neutral-900 items-center h-screen w-full">
        <Skeleton className="w-30 h-30 bg-neutral-800 rounded-full mt-[5vh]" />
        <div className="w-screen flex flex-col justify-center items-center mt-[3vh]">
          <Skeleton className="w-[20vw] h-[15px] bg-neutral-800 rounded-md" />
          <Skeleton className="w-[16vw] h-[10px] bg-neutral-800 rounded-md mt-3" />
        </div>

        <Skeleton className="w-[40vw] h-[50vh] bg-neutral-800 rounded-md mt-[5vh]" />

      </div>
    )
}

