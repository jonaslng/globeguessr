"use client";  // 💡 Next.js: Code wird nur im Client ausgeführt

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useMapEvents } from "react-leaflet";
import { TbMapOff, TbMap, TbMapPinPlus } from "react-icons/tb"

// Dynamische Imports für Leaflet-Komponenten
const MapContainer = dynamic(() => import("react-leaflet").then((module) => module.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((module) => module.TileLayer),{ ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((module) => module.Marker),{ ssr: false });


// MAP COMPONENT FOR ADDITIONAL FUNCTIONALITY
const MapMeta = ({ setGuessed, setUserCoords, mapRef, setMarker, setCoords }) => {
  const map = useMapEvents({
    click(e) {
      // SET MARKER ON MAP WHEN CLICKED
      const { lat, lng } = e.latlng;
      setMarker([lat, lng]);
      setCoords({lat, lng});
    }
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
const MobileMap = ({ setGuessed, setUserCoords}) => {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const markerRef = useRef(null);
  const [marker, setMarker] = useState(null);
  const [coords, setCoords] = useState(null);
  const [markerIcon, setMarkerIcon] = useState(null);
  const [on, setOn] = useState(false);

  console.log(coords)

  // Handling the actions if user guesses
  let handleGuessed = () => {
    if(marker) {
      mapRef.current.removeLayer(markerRef.current);
      setUserCoords(coords);
      setGuessed(true);
    }
  } 

  // Handling the transition of the map container
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      map.invalidateSize();
      setTimeout(() => map.invalidateSize(), 200);
    }
  },[on]);

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

  return (
    <div
      ref={containerRef}
      className="flex flex-col"
    >

      <div className="flex flex-row">
        <button className={`text-white ${!on ? `bg-[#44444C]` : `bg-[#54545e]`} mb-[15px] ml-[15px] h-[8vh] w-[9vw] font-bold py-2 px-4 rounded-xl flex items-center justify-center`} onClick={() => setOn(!on)}>
          {on ? <TbMapOff size={50} /> : <TbMap size={50} />}
        </button>
        {marker ? <button className={`text-white ${on ? `bg-[#873F49]` : `bg-[#b3626d]`} mb-[15px] ml-[15px] h-[8vh] w-[9vw] font-bold py-2 px-4 rounded-xl flex items-center justify-center`} onClick={handleGuessed}>
          <TbMapPinPlus size={50} />
        </button> : null}
      </div>

      {on ? <MapContainer
        center={[0, 0]}
        ref={mapRef}
        zoom={2}
        attributionControl={false}
        className="h-[45vh] w-[100vw] opacity-100 transition-all duration-200 border-none focus:border-none hover-container rounded-md"
      >
        <TileLayer
          noWrap={true}
          url="https://mt2.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&language=de"
        />
        <MapMeta setGuessed={setGuessed} setUserCoords={setUserCoords} setMarker={setMarker} mapRef={mapRef} setCoords={setCoords} />
        {marker && markerIcon && <Marker position={marker} icon={markerIcon} ref={markerRef} />}
        </MapContainer> : null}

    </div>
  );
};

export default MobileMap;