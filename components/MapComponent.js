import { GoogleMap, Marker, InfoWindow, LoadScript } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import {JOOMLA_API_BASE} from "@/utils/config";
import {Modal, Button} from 'react-bootstrap';
import Link from "next/link";
import Image from "next/image";
import {GOOGLE_MAPS_API_KEY} from "@/utils/config";
import {saveStandortId} from "@/utils/useStandort";


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
            // Use the location's own id: the standort_id in the description link is missing or wrong for some locations
            saveStandortId(selectedShop.id);

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
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} >
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={7}
                    options={{
                        streetViewControl: false, // Hides Street View
                        mapTypeControl: false,    // Hides the Satellite button (Map Type Control)
                        zoomControl: true,        // Shows the Zoom Control
                        cameraControl: false,
                    }}
                >
                    {shops.map((shop) => (
                        <Marker
                            key={shop.id}
                            position={{ lat: parseFloat(shop.latitude), lng: parseFloat(shop.longitude) }}
                            onClick={() => setSelectedShop(shop)}
                            icon={{
                                url: "/images/marker/pointer4.png", // Path to your custom marker image
                                anchor: new window.google.maps.Point(13, 50), // Positioning anchor
                            }}
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
                                <div className={"gc-green gc-bold-2"}
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
                <Modal.Body>
                    <div className={"row g-0"}>
                        <div className={"col"}>
                            Ihr gewünschter Einbauort wurde in unserem Anfrageformular hinterlegt! Die genaue Adresse und den Ansprechpartner Ihrer gewünschten Werkstatt erhalten Sie bei Bestellung. An welchem Produkt sind Sie interessiert?
                        </div>
                    </div>
                    <div className="w-100 pb-3"></div>
                    <div className="row g-0 p-3 product-detail-view rounded-4 align-items-center justify-content-evenly">
                        <div className={"col-auto text-center p-2"} >
                            <Link className={"d-block"} href="/pkw-partikelfilter">
                                <h6>PKW</h6>
                                <Image className={"picto-50"} src={"/images/icons/pkw-partikelfilter.png"} alt={"PKW Partikelfilter"} width={50} height={50} layout="responsive"/>
                            </Link>
                        </div>
                        <div className={"col-auto text-center p-2"} >
                            <Link className={"d-block"} href="/lkw-partikelfilter" >
                                <h6>LKW</h6>
                                <Image className={"picto-50"} src={"/images/icons/lkw-partikelfilter.png"} alt={"LKW Partikelfilter"} width={50} height={50} layout="responsive"/>
                            </Link>
                        </div>
                        <div className={"col-auto text-center p-2"} >
                            <Link className={"d-block"} href="/bus-partikelfilter" >
                                <h6>BUS</h6>
                                <Image className={"picto-50"} src={"/images/icons/bus-partikelfilter.png"} alt={"BUS Partikelfilter"} width={50} height={50} layout="responsive"/>
                            </Link>
                        </div>
                        <div className={"col-auto text-center p-2"} >
                            <Link className={"d-block"} href="/baumaschinen-partikelfilter" >
                                <h6>BAU</h6>
                                <Image className={"picto-50"} src={"/images/icons/bau-partikelfilter.png"} alt={"BAU Partikelfiltr"} width={50} height={50} layout="responsive"/>
                            </Link>
                        </div>
                        <div className={"col-auto text-center p-2"} >
                            <Link className={"d-block"} href="/partikelfilter-reinigen" >
                                <h6>Filterreinigung</h6>
                                <Image className={"picto-50"} src={"/images/icons/filterreinigung-partikelfilter.png"} alt={"Filterreinigung"} width={50} height={50} layout="responsive"/>
                            </Link>
                        </div>
                    </div>
                    <div className="w-100 pb-3"></div>
                    <Button className="btn btn-primary btn-green btn-100" type="button" onClick={handleCloseModal}>schließen</Button>
                </Modal.Body>

            </Modal>
        </>
    );
};

export default MapComponent;
