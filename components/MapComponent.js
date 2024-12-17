import { GoogleMap, Marker, InfoWindow, LoadScript } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import {JOOMLA_API_BASE} from "@/utils/config";


const MapComponent = () => {
    const [shops, setShops] = useState([]);
    const [selectedShop, setSelectedShop] = useState(null);

    // Fetch shop data from Joomla API
    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await fetch(`${JOOMLA_API_BASE}&task=getLocations&format=json`);
                const locations = await response.json();
                setShops(locations.data);
            } catch (error) {
                console.error("Failed to fetch shops:", error);
            }
        };
        fetchShops();
    }, []);

    // Google Maps container styles
    const containerStyle = {
        width: "100%",
        height: "600px",
    };

    // Default center position
    const center = {
        lat: 51.165691,
        lng: 10.45152600000006,
    };

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GC_MAPS_API_KEY} >
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={8}>
                {shops.map((shop) => (
                    <Marker
                        key={shop.id}
                        position={{ lat: parseFloat(shop.latitude), lng: parseFloat(shop.longitude) }}
                        onClick={() => setSelectedShop(shop)}
                    />
                ))}

                {selectedShop && (
                    <InfoWindow
                        position={{
                            lat: parseFloat(selectedShop.latitude),
                            lng: parseFloat(selectedShop.longitude),
                        }}
                        onCloseClick={() => setSelectedShop(null)}
                    >
                        <div>
                            <h2>{selectedShop.title}</h2>
                            <p>{selectedShop.description}</p>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapComponent;
