import { GoogleMap, Marker, InfoWindow, LoadScript } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import {JOOMLA_API_BASE} from "@/utils/config";
import {Modal, Button} from 'react-bootstrap';


const MapComponent = () => {
    const [shops, setShops] = useState([]);
    const [selectedShop, setSelectedShop] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");

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
    const handleInfoWindowClick = (e) => {
        e.preventDefault(); // Prevent default link navigation

        if (selectedShop && selectedShop.description) {
            // Parse the description HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(selectedShop.description, "text/html");

            // Find the <a> tag with the href attribute
            const anchor = doc.querySelector("a.gc-a-marker");
            if (anchor) {
                const urlParams = new URLSearchParams(new URL(anchor.href, window.location.origin).search);
                const standortId = urlParams.get("standort_id");

                if (standortId) {
                    // Store standort_id in sessionStorage
                    sessionStorage.setItem("standort_id", standortId);
                    console.log(`Stored standort_id: ${standortId}`);
                }
            }

            // Set modal content to the description
            setModalContent(selectedShop.description);
            setShowModal(true); // Show the modal
            setSelectedShop(null); // Close the InfoWindow
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalContent("");
    };

    return (
        <>
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
                                {/* Render the description */}
                                <div className={"gc-green"}
                                    onClick={handleInfoWindowClick}
                                    dangerouslySetInnerHTML={{ __html: selectedShop.description }}
                                />
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
            {/* Bootstrap Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    {/*  <Modal.Title>Shop Details</Modal.Title> */}
                </Modal.Header>
                <Modal.Body>
                    <div dangerouslySetInnerHTML={{ __html: modalContent }} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default MapComponent;
