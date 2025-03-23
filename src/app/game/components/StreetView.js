"use client";

import { useEffect, useState } from "react";

export default function StreetView({ url, mobile }) {
    const [isClient, setIsClient] = useState(false);


    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="flex flex-col items-center w-full h-screen overflow-hidden">
            {isClient && (
                <div className="w-full h-screen">
                    <iframe
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        src={url}
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                        style={{
                            width: "100vw",
                            height: (mobile ? "calc(100vh + 260px)" : "calc(100vh + 300px)"),
                            zIndex: 100,
                            transform: "translateY(-280px)",
                            overflow: "hidden",
                            border: "none",
                            outline: "none"
                        }}
                        allowFullScreen
                    ></iframe>
                </div>
            )}
        </div>
    );
}