"use client";  // 💡 Next.js: Code wird nur im Client ausgeführt

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useMapEvents } from "react-leaflet";
import { calculatePoints, getDistanceInKm } from "../_utilities";
import { useRouter } from "next/navigation";

// Dynamische Imports für Leaflet-Komponenten
const MapContainer = dynamic(() => import("react-leaflet").then((module) => module.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((module) => module.TileLayer),{ ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((module) => module.Marker),{ ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then((module) => module.Polyline),{ ssr: false });


// MAP COMPONENT FOR ADDITIONAL FUNCTIONALITY
const MapMeta = ({ bounds }) => {
  const map = useMapEvents({

  });

  // Loading the complete map
  useEffect(() => {
    map.invalidateSize();
    
    // Timer zum mehrfachen Nachladen der Karte (hilft bei langsamen Verbindungen)
    const timers = [100, 500, 1000, 2000].map(ms => 
      setTimeout(() => map.invalidateSize(), ms)
    );
    
    return () => timers.forEach(timer => clearTimeout(timer));
  }, [map]);
  return null;
}


// MAP COMPONENT
const Solution = ({ userCoords, solutionCoords, handleclick }) => {
  const mapRef = useRef(null);
  const [markerIcon, setMarkerIcon] = useState(null);
  const [bounds, setBounds] = useState(null);
  const distance = getDistanceInKm([userCoords.lat, userCoords.lng], [solutionCoords.lat, solutionCoords.lng]);
  const points = calculatePoints(distance);
  const router = useRouter();

  let handleclick2 = () => {
    setMarkerIcon(null);
    handleclick();
  }

  // Load the marker icon
  useEffect(() => {
    import('leaflet').then(L => {
      setMarkerIcon(L.icon({
        iconUrl: "/leaflet/marker_2.png",
        iconSize: [30, 41],
        iconAnchor: [12, 41],
      }));
      
    });
  }, []);

  let handleMapLoaded = () => {
    let bounds = L.latLngBounds([userCoords.lat, userCoords.lng], [solutionCoords.lat, solutionCoords.lng])
    
      const intervalId = setInterval(() => {
        if (mapRef.current) {
          console.log("Start animation");
          mapRef.current.flyToBounds(bounds, { padding: [25, 25] });
          mapRef.current.dragging.enable();
          clearInterval(intervalId); 
        }
      }, 300);

  }

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-center bg-neutral-900">

      <div className="w-[100vw] mb-[40px] flex items-center justify-center text-white text-2xl font-semibold">
        Entfernung: {distance.toFixed(2)} km | Punkte: {points}
      </div>

      <div
        className="flex flex-col items-center justify-center"
      >
        <MapContainer
          center={[userCoords.lat, userCoords.lng]}
          ref={mapRef}
          zoom={13}
          attributionControl={false}
          zoomControl={false}
          className="h-[60vh] w-[65vw] rounded-lg focus:border-none"
          whenReady={handleMapLoaded()}
        >
          <TileLayer
            noWrap={true}
            url="https://mt2.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&language=de"
          />

          {markerIcon && (
            <>
              <Marker position={[userCoords.lat, userCoords.lng]} icon={markerIcon} />
              <Marker position={[solutionCoords.lat, solutionCoords.lng]} icon={markerIcon} />
            </>
          )}

          {userCoords && solutionCoords && (
            <Polyline
              positions={[
                [userCoords.lat, userCoords.lng],
                [solutionCoords.lat, solutionCoords.lng],
              ]}
              color="red"
              weight={3}
              opacity={0.8}
            />
          )}

          <MapMeta bounds={bounds} />
        </MapContainer>


        <div className="mt-[40px] flex flex-col items-center justify-center">
          <div className="flex flex-row items-center justify-center">
            <button onClick={() => router.push("/")} className="bg-neutral-700 hover:bg-neutral-800 cursor-pointer w-[15vw] h-[7vh] font-semibold text-xl rounded-md text-white py-2 px-4 mt-4 mr-[10px]">
              End Game
            </button>
            <button onClick={() => handleclick2()} className="bg-neutral-700 hover:bg-neutral-800 cursor-pointer w-[15vw] h-[7vh] font-semibold text-xl rounded-md text-white py-2 px-4 mt-4 ml-[10px]">
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Solution;