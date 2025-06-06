import { IoRefreshCircleSharp } from "react-icons/io5";
import { MdCancel } from "react-icons/md";



function Toolbar({cancelGame, reloadLocation}) {


    return (
        <div className="fixed top-0 left-0 w-[9vw] h-[7vh] bg-[rgba(0,0,0,0.9)] rounded-full flex flex-row items-center justify-evenly z-10 m-[10px] cursor-pointer">
            <MdCancel className="text-[rgba(250,250,250,0.8)] hover:scale-105 hover:text-white transition-all" size={30} onClick={() => cancelGame()} />
            <div className="w-[1px] h-[50%] bg-[rgba(90,90,90,0.8)] rounded-full"></div>
            <IoRefreshCircleSharp className="text-[rgba(250,250,250,0.8)] hover:scale-105 hover:text-white transition-all" size={30} onClick={() => reloadLocation()} />
        </div>
    )
}

function GuessIsland({onClick}) {


    return (
        <div className="fixed bottom-0 left-0 w-screen flex items-center justify-center">
            <div
                className="bg-[rgba(0,0,0,0.9)] rounded-full w-[40vh] h-[10vh] flex items-center mb-[15px] justify-center cursor-pointer animate-slide-up hover:scale-105 active:scale-95 transition-all"
                onClick={onClick}
            >
                <span className="text-[rgba(250,250,250,0.9)] text-[3vh] font-bold">Raten</span>
            </div>
            <style jsx>{`
                .animate-slide-up {
                    animation: slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1);
                }
                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    )
}




export { Toolbar, GuessIsland };