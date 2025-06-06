"use client";  // 💡 Next.js: Code wird nur im Client ausgeführt

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useMapEvents } from "react-leaflet";

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
      setUserCoords({ lat, lng });
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
const MapWithStreetView = ({ setGuessed, setUserCoords}) => {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const markerRef = useRef(null);
  const [marker, setMarker] = useState(null);
  const [markerIcon, setMarkerIcon] = useState(null);
  const [coords, setCoords] = useState(null);



  // Handling the transition of the map container
  const handleMouseEnter = () => {
    // Mehrfach invalidateSize aufrufen, um sicherzustellen, dass die Karte während der Transition aktualisiert wird
    if (mapRef.current) {
      const map = mapRef.current;
      map.invalidateSize();
      setTimeout(() => map.invalidateSize(), 200);
    }
  };
  const handleMouseLeave = () => {
    if (mapRef.current) {
      const map = mapRef.current;
      map.invalidateSize();
      setTimeout(() => map.invalidateSize(), 201); // Nach der Transition
    }
  };

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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group flex flex-col"
    >
      <MapContainer
        center={[0, 0]}
        ref={mapRef}
        zoom={2}
        attributionControl={false}
        className="h-[30vh] w-[25vw] opacity-50 transition-all duration-200 group-hover:h-[60vh] group-hover:w-[60vw] group-hover:opacity-100 border-none focus:border-none"
      >
        <TileLayer
          noWrap={true}
          url="https://mt2.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&language=en&client=universal"
        />
        <MapMeta setGuessed={setGuessed} setUserCoords={setUserCoords} setMarker={setMarker} mapRef={mapRef} setCoords={setCoords} />
        {marker && markerIcon && <Marker position={marker} icon={markerIcon} ref={markerRef} />}
      </MapContainer>

    </div>
  );
};

export default MapWithStreetView;