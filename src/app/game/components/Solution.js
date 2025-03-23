"use client";  // 💡 Next.js: Code wird nur im Client ausgeführt

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { getDistanceInKm } from "../_utilities";

// ✅ Leaflet wird nur im Client geladen
const L = typeof window !== "undefined" ? require("leaflet") : null;

if (L) {
  require("leaflet.gridlayer.googlemutant"); // Importieren des Plugins
}

const Solution = ({ pro = false, userCoords, solutionCoords, handleclick }) => {
  const mapRef = useRef(null); // Referenz für den Container
  const leafletMapRef = useRef(null); // Referenz für die Leaflet-Karte
  const distance = getDistanceInKm([userCoords.lat, userCoords.lng], [solutionCoords.lat, solutionCoords.lng]);

  console.log(distance);

  useEffect(() => {
    if (typeof window !== "undefined" && L) {
      if (!leafletMapRef.current) {
        // Initialisiere die Karte nur, wenn sie noch nicht existiert
        const newMap = L.map(mapRef.current, {
          dragging: true,
          doubleClickZoom: true,
          keyboard: true,
          zoom: 2,
          attributionControl: false,
          zoomControl: false,
          worldCopyJump: true,
        });
        setMapView(distance, newMap, userCoords, solutionCoords);

        L.gridLayer.googleMutant({ type: "hybrid", disableDefaultUI: true, zoomControl: false }).addTo(newMap);

        leafletMapRef.current = newMap; // Speichere die Karte in der Referenz
        
      } else {
        const map = leafletMapRef.current;

        // Entferne alle bestehenden Marker und Linien
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            map.removeLayer(layer);
          }
        });

        // Marker für die Benutzerkoordinaten hinzufügen
        if (userCoords) {
          const userMarkerIcon = new L.Icon({
            iconUrl: "/leaflet/marker_2.png",
            iconSize: (pro ? [30, 38] : [35, 41]),
            iconAnchor: [18, 41],
          });

          L.marker([userCoords.lat, userCoords.lng], { icon: userMarkerIcon }).addTo(map);
        }

        // Marker für die Lösung hinzufügen
        if (solutionCoords) {
          const solutionMarkerIcon = new L.Icon({
            iconUrl: "/leaflet/marker_2.png",
            iconSize: (pro ? [30, 38] : [35, 41]),
            iconAnchor: [18, 41],
          });

          L.marker([solutionCoords.lat, solutionCoords.lng], { icon: solutionMarkerIcon }).addTo(map);
        }

        // Linie zwischen den beiden Markern hinzufügen
        if (userCoords && solutionCoords) {
          const line = L.polyline(
            [[userCoords.lat, userCoords.lng], [solutionCoords.lat, solutionCoords.lng]],
            { color: "red", weight: 3, opacity: 0.8 }
          );
          line.addTo(map);
        }

        setMapView(distance, map, userCoords, solutionCoords);
      }
    }
  }, [userCoords, solutionCoords, pro]);

  return (
    <div className="flex h-[100vh] flex-col w-full items-center justify-center bg-[rgba(20,20,20,0.9)]">
      <p className="mb-[20px] font-bold text-white text-2xl">Dein Tipp war {Math.floor(distance).toString()}km entfernt</p>
      <div
        ref={mapRef}
        id="map"
        className={`w-[80vw] h-[70vh] border-none focus:border-none`}
      ></div>
      <button
        className="cursor-pointer mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        onClick={() => handleclick()}
      >
        Weiter
      </button>
    </div>
  );
};

function setMapView(distance, map, userCoords, solutionCoords) {

  map.setView([userCoords.lat, userCoords.lng], 12);

  let bounds = new L.LatLngBounds([userCoords.lat, userCoords.lng], [solutionCoords.lat, solutionCoords.lng]);
  map.flyToBounds(bounds, { padding: [30, 30]});

}

export default Solution;