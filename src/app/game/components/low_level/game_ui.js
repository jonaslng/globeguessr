import { useState } from "react";
import { FaPauseCircle, FaPlay, FaTimesCircle } from "react-icons/fa";
import { IoRefreshCircleSharp } from "react-icons/io5";
import { RiTimerFill } from "react-icons/ri";

function Toolbar({cancelGame, reloadLocation,time,setPaused}) {

    const [paused, setPause] = useState(false);

    const pauseGame = () => {
        setPaused(!paused);
        setPause(!paused);
    }

    return (
        <>
            <div className="fixed top-0 left-0 w-[9vw] h-[7vh] bg-[rgba(0,0,0,0.9)] rounded-full flex flex-row items-center justify-evenly z-10 m-[10px] cursor-pointer">
                <IoRefreshCircleSharp className="text-[rgba(250,250,250,0.8)] hover:scale-105 hover:text-white transition-all" size={33} onClick={() => reloadLocation()} />
                <div className="w-[1px] h-[50%] bg-[rgba(90,90,90,0.8)] rounded-full"></div>
                <FaPauseCircle className="text-[rgba(250,250,250,0.8)] hover:scale-105 hover:text-white transition-all" size={30} onClick={() => pauseGame()} />
            </div>
            <div className="fixed top-0 h-[7vh] w-[8vw] right-0 bg-[rgba(0,0,0,0.9)] rounded-full flex flex-row items-center justify-center z-10 m-[10px] cursor-pointer text-white">
              <RiTimerFill size={24} className="mr-[7px]" />
              {time ? (`${Math.floor(time / 60)}:${time % 60 < 10 ? `0${time % 60}` : time % 60}`) : "0:00"}  
            </div>
            <div className={`fixed top-0 left-0 w-full h-full bg-[rgba(15,15,15,0.8)] z-20 flex items-center justify-center transition-all duration-200 ease-in-out ${paused ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="w-[20vw] h-[50vh] border-white flex flex-col items-center justify-center">
                    <div className="w-[25vw] h-[12vh] bg-neutral-900 rounded-full flex flex-row items-center justify-center text-white mb-[20px] cursor-pointer hover:scale-105 transition-all font-bold text-lg" onClick={() => pauseGame()}>
                        <FaPlay className="mr-4" size={25} />
                        Resume Game
                    </div>
                    <div className="w-[25vw] h-[12vh] bg-neutral-900 rounded-full flex flex-row items-center justify-center text-white mb-[20px] cursor-pointer hover:scale-105 transition-all font-bold text-lg" >

                    </div>
                    <div className="w-[25vw] h-[12vh] bg-neutral-900 rounded-full flex flex-row items-center justify-center text-white mb-[20px] cursor-pointer hover:scale-105 transition-all font-bold text-lg" onClick={() => cancelGame()}>
                        <FaTimesCircle className="mr-4" size={30} />
                        Quit Game
                    </div>
                </div>
            </div>
        </>
    )
}

export { Toolbar };