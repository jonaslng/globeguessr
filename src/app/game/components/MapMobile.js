"use client";  // 💡 Next.js: Code wird nur im Client ausgeführt

import { useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { TbMap, TbMapOff, TbMapPinPlus } from "react-icons/tb";


// ✅ Leaflet wird nur im Client geladen
const L = typeof window !== "undefined" ? require("leaflet") : null;


if (L) {
  require("leaflet.gridlayer.googlemutant"); // Importieren des Plugins
}

const loadGoogleMapsScript = (callback) => {
  const existingScript = document.getElementById('googleMaps');

  if (!existingScript) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
    script.id = 'googleMaps';
    document.body.appendChild(script);

    script.onload = () => {
      if (callback) callback();
    };
  }

  if (existingScript && callback) callback();
};

const MobileMap = ({ setGuessed, setUserCoords, pro = false }) => {
  const [map, setMap] = useState(null);
  const [coords, setCoords] = useState(null);
  const [mapOn, setMapOn] = useState(false); // Zustand für Hover/Interaktion
  const markerRef = useRef(null); // Verwenden Sie ein Ref für den Marker
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);

  const handleGuessed = () => {
    if (markerRef.current !== null) {
      map.removeLayer(markerRef.current);
      setUserCoords(coords);
      setGuessed(true);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && L) {  // ✅ Sicherstellen, dass window existiert
      loadGoogleMapsScript(() => {
        if (!leafletMapRef.current) {  // Überprüfen, ob die Karte bereits existiert
          const newMap = L.map(mapRef.current, {
            dragging: true,
            doubleClickZoom: true,
            keyboard: true,
            zoom: 2,
            attributionControl: false,
            zoomControl: false,
            worldCopyJump: true,
          }).setView([20, 0], 2);

          L.gridLayer.googleMutant({ type: "hybrid", disableDefaultUI: true, zoomControl: false }).addTo(newMap);

          setMap(newMap); // Speichere die Karte im Zustand
          leafletMapRef.current = newMap; // Speichere die Karte in der Referenz
        } else {
          let mapy = leafletMapRef.current;
            // Entferne alle bestehenden Marker und Linien
            mapy.eachLayer((layer) => {
             if (layer instanceof L.Marker || layer instanceof L.Polyline) {
                mapy.removeLayer(layer);
              }
        });
        }
      });
    }
  }, [map]);

  useEffect(() => {
    if (map) {
      map.on("click", (e) => {
        const { lat, lng } = e.latlng;

        // Entferne den alten Marker, falls er existiert
        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }

        // Setze einen neuen Marker an die angeklickte Stelle
        const markerIcon = new L.Icon({
          iconUrl: "/leaflet/marker_2.png",
          iconSize: (pro ? [30, 38] : [50, 60]),
          iconRetinaUrl: "/leaflet/marker_2.png",
          iconAnchor: [12, 41],
        });

        const newMarker = L.marker([lat, lng], { icon: markerIcon }).addTo(map);
        console.log(newMarker);

        // Speichere den neuen Marker im Ref
        markerRef.current = newMarker;

        // Aktualisiere die Koordinaten
        setCoords({ lat, lng });
      });

    }
  }, [map]);

  // Überwache die Größe des Containers und passe die Karte an
  useEffect(() => {
    const handleResize = () => {
      if (map) {
        map.invalidateSize(); // Aktualisiere die Kartengröße
      }
    };

    // Füge einen Resize-Observer hinzu
    const observer = new ResizeObserver(handleResize);
    if (mapRef.current) {
      observer.observe(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        observer.unobserve(mapRef.current);
      }
    };
  }, [map, mapOn]);

return (
    <div className="flex flex-col items-end justify-around group rounded-md">
        <MapBtn onClick={() => setMapOn(!mapOn)} mapOn={mapOn} />
        <div
            ref={mapRef}
            id="map"
            className={`transition-all duration-200 ease-in-out ${mapOn ? "h-[45vh] w-[55vw] opacity-100" : "h-0 w-0 opacity-0"} mb-[8vh] border-none focus:border-none overflow-hidden`}
        ></div>
        {markerRef.current !== null && mapOn ? <BTN onClick={() => handleGuessed()} /> : null}
    </div>
);
};

const BTN = ({ onClick }) => {
  return (
    <button onClick={onClick} className="bg-green-800 h-[7vh] text-white w-[8vw] font-bold py-2 px-4 rounded-xl flex items-center justify-center absolute bottom-0 left-[9vw]">
      <TbMapPinPlus size={40} />
    </button>
  );
};

const MapBtn = ({ onClick, mapOn }) => {
    return (
        <button onClick={onClick} className={`text-white ${mapOn ? `bg-cyan-800` : `bg-cyan-600`} h-[7vh] w-[8vw] font-bold py-2 px-4 rounded-xl flex items-center justify-center absolute bottom-0 left-0`}>
        {mapOn ? <TbMapOff size={40} /> : <TbMap size={40} />}
        </button>
    );
}

export default MobileMap;