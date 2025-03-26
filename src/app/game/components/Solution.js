"use client";  // 💡 Next.js: Code wird nur im Client ausgeführt

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useMapEvents } from "react-leaflet";
import { getDistanceInKm } from "../_utilities";

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
    console.log("Start animation")
    let bounds = L.latLngBounds([userCoords.lat, userCoords.lng], [solutionCoords.lat, solutionCoords.lng])
    
      setInterval(() => {
        if(mapRef.current){
        mapRef.current.flyToBounds(bounds, {padding: [25, 25]})
        }
      }, 300);

  }

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-center bg-[rgba(20,20,20,0.9)]">
      <div
        className="flex flex-col items-center justify-center"
      >
        <MapContainer
          center={[userCoords.lat, userCoords.lng]}
          ref={mapRef}
          zoom={13}
          attributionControl={false}
          zoomControl={false}
          className="h-[100vh] w-[100vw] focus:border-none"
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

        <div className="absolute bottom-0 bg-[rgba(160,160,160,0.5)] backdrop-blur-md w-[60vw] h-[20vh] mb-[20px] rounded-md flex flex-col items-center justify-center">
          <p className="text-white font-bold text-2xl">Distance: {Math.floor(distance)} km</p>
          <button onClick={() => handleclick2()} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mt-4">
            Weiter
          </button>
        </div>

      </div>
    </div>
  );
};

export default Solution;