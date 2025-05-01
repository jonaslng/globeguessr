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
import { Badge, Code, DataList, Flex, IconButton, Link } from "@radix-ui/themes"
import { Edit } from "lucide-react"
import { useEffect, useState } from "react"
import { DialogHeader, Dialog, DialogTitle, DialogContent, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input"



const getUserData = async (userId) => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    const userData = userDoc.data();
    console.log("User data:", userData);
    return userData;
  }
  return null;
}

const editUserName = async (userId, newName) => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, { name: newName }, { merge: true });
  console.log("User name updated successfully");
}

export default function Account() {

      const {user, loading, logout} = useAuth();
      const [open, setOpen] = useState(false);
      const [userData, setUserData] = useState(null);
      const [appLoading, setAppLoading] = useState(true);

      const signIn = async () => {
            const provider = new GoogleAuthProvider();
              try {
                await signInWithPopup(auth, provider);
                await checkAndCreateUser(auth.currentUser);
              } catch (err) {
                console.error(err);
              }
          }
       
      useEffect(() => {
        const fetchUserData = async () => {
          if (user) {
            const data = await getUserData(user.uid);
            setUserData(data);
          }
        };

        fetchUserData();
      }, [user])
      useEffect(() => {
        if(userData !== null && userData !== undefined && !loading) {
          setAppLoading(false);
        }
      }, [loading, userData])
        



      if(!appLoading && !user) {

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

    if (appLoading) {
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
                    <CardTitle className="text-center flex flex-row justify-center items-center text-3xl text-white font-bold mt-[3vh]">
                        {userData.name} <Edit className="text-neutral-400 ml-[1vw] mt-[5px] cursor-pointer hover:text-neutral-300 transition-all" onClick={() => setOpen(true)} size={20} />
                    </CardTitle>
                    <CardDescription className="text-center text-lg text-neutral-400 font-light mt-1">
                        {user.email}
                    </CardDescription>
                    <Tabs className="w-[80vw] mt-[5vh] flex items-center" defaultValue="Konto">

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
                          <AccountContent user={user} logout={logout} />
                        </TabsContent>
                        <TabsContent
                            className="bg-neutral-800 text-white"
                            value="Statistiken"
                        >



                        </TabsContent>


                                    
                    </Tabs>
    
                                      
    
                    {open && (
                        <DialogNameChange setOpen={setOpen} userID={user.uid} />
                    )}
            
    
                                    
    
            </div>
        )
    }   


    
}

const DialogNameChange = ({setOpen, userID}) => {

  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  console.log("User ID: ", userID);

  const handleNameChange = () => {

    console.log("Name changing to: ", name);

    if (name.length < 3) {
      setError("Der Name muss mindestens 3 Zeichen lang sein.");
    } else if (name.length > 20) {
      setError("Der Name darf maximal 20 Zeichen lang sein.");
    } else {
      setError(null);
      editUserName(userID, name)
        .then(() => {
          setOpen(false);
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error updating name: ", error);
          setError("Ein Fehler ist aufgetreten. Bitte versuche es später erneut.");
        });
    }
  }



  return (
    <Dialog open={true} onOpenChange={() => setOpen(false)} className="bg-neutral-900 ">
      <DialogContent className="bg-neutral-900 border border-neutral-800 rounded-md text-white">
        <DialogHeader>
          <DialogTitle className="text-neutral-300">Namensänderung</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Ändere deinen Namen. Dieser ist unter Umständen in der Bestenliste öffentlich sichtbar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-neutral-300">
              Neuer Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3 border-none bg-neutral-800 text-neutral-400" />
          </div>
          {error && (
            <p className="text-red-500 text-sm col-span-4 text-center">
              {error}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            className="bg-neutral-300 text-neutral-900 hover:bg-neutral-400 hover:text-neutral-900 border-neutral-700 cursor-pointer"
            onClick={() => handleNameChange()}
          >
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
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

const AccountContent = ({user,logout}) => {

  const logUserOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out: ", error);
    }
    window.location.href = "/";
  }

  return (
    <div className="flex flex-col w-[40vw] h-[50vh] bg-neutral-900">
      <div className="flex flex-col w-full h-full bg-neutral-900 items-center rounded-md p-4 border-none mt-[3vh]">
        

      </div>
      <div className="flex flex-col w-full h-full bg-neutral-900 p-4 mt-[2vh]">
        <div className="flex flex-col">
          <Button
            variant="outline"
            className="bg-neutral-300 text-neutral-900 hover:bg-neutral-400 hover:text-neutral-900 border-neutral-700 cursor-pointer"
            onClick={() => logUserOut()}
          >
            Abmelden
          </Button>
        </div>
        </div>
    </div>
  )
}