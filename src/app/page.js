"use client";


export default function Home() {


  return (
    <div className="flex bg-[rgb(30,30,30)] items-center justify-center h-screen w-full">
      <div className="flex flex-col items-center w-screen h-[30%]">
        <h1 className="text-white font-bold text-5xl">GlobeGuessr 🌎</h1>

        <button className="mt-[5%] text-white w-[20%] h-[7vh] bg-green-400 rounded-full shadow-lg cursor-pointer text-2xl font-bold hover:scale-110" onClick={() => window.location.href = "/game"}>Spielen</button>
      </div>
    </div>
  );
}