"use client";

import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from "@/app/firebase";
import { useRouter } from "next/navigation";
import { VscLoading, VscError } from "react-icons/vsc";
import { useEffect, useState } from "react";


export default function Page() {

    const router = useRouter();
    const provider = new GoogleAuthProvider();
    const [error, setError] = useState(null);
    const loginWithGoogle = async () => {
        try {
          await signInWithRedirect(auth, provider);
          router.push("/game");
        } catch (err) {
          console.error(err);
          setError("Fehler beim Anmelden mit Google");
        }
    };



    return (
        <div className="bg-[#212125] h-screen w-screen flex flex-col items-center justify-center">
          {!error ? <VscLoading className="animate-spin text-6xl text-green-600" /> : <VscError className="text-6xl text-red-600" />}
        </div>
    );
}