"use client";  // 💡 Next.js: Code wird nur im Client ausgeführt

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

// ✅ Leaflet wird nur im Client geladen
const L = typeof window !== "undefined" ? require("leaflet") : null;

const MapWithStreetView = () => {
  const [map, setMap] = useState(null);
  const [coords, setCoords] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && L) {  // ✅ Sicherstellen, dass window existiert
      if (!map) {
        const newMap = L.map("map").setView([52.5, 13.4], 5);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(newMap);

        newMap.on("click", (e) => {
          setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });

          // Entferne den alten Marker, falls er existiert
          if (marker) {
            marker.remove();
          }

          // Setze einen neuen Marker an die angeklickte Stelle
          const markerIcon = new L.Icon({
            iconUrl: "/leaflet/marker_2.png",
            iconSize: [32, 40],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          });
          const newMarker = L.marker([e.latlng.lat, e.latlng.lng], {icon: markerIcon}).addTo(newMap);
          setMarker(newMarker); // Setze den neuen Marker
        });

        setMap(newMap);
      }
    }
  }, [map, marker]);

  return (
    <div>
      <div id="map" className="h-[30vh] w-[30vw] rounded-lg shadow-md transition-all hover:scale-125 border-none focus:border-none"></div>
    </div>
  );
};

export default MapWithStreetView;