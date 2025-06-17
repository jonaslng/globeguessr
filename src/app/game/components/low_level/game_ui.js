import { Progress } from "@/components/ui/progress";
import { IoRefreshCircleSharp } from "react-icons/io5";
import { MdCancel } from "react-icons/md";



function Toolbar({cancelGame, reloadLocation,progress}) {


    return (
        <>
            <div className="fixed top-0 left-0 w-[9vw] h-[7vh] bg-[rgba(0,0,0,0.9)] rounded-full flex flex-row items-center justify-evenly z-10 m-[10px] cursor-pointer">
                <MdCancel className="text-[rgba(250,250,250,0.8)] hover:scale-105 hover:text-white transition-all" size={30} onClick={() => cancelGame()} />
                <div className="w-[1px] h-[50%] bg-[rgba(90,90,90,0.8)] rounded-full"></div>
                <IoRefreshCircleSharp className="text-[rgba(250,250,250,0.8)] hover:scale-105 hover:text-white transition-all" size={30} onClick={() => reloadLocation()} />
            </div>
            <div className="hidden fixed top-0 h-[7vh] w-[7vh] right-0 bg-[rgba(0,0,0,0.9)] rounded-full flex items-center justify-center z-10 m-[10px] cursor-pointer">
                
            </div>
        </>
    )
}


export { Toolbar };