import { useState, useEffect, useRef } from 'react';
import { JOOMLA_API_BASE } from '@/utils/config';

// Chosen installation location ("Einbauort"), shared by the map (MapComponent) and the product pages for the current browser session
const STORAGE_KEY = 'standort_id';

export function saveStandortId(id) {
    try {
        if (id) sessionStorage.setItem(STORAGE_KEY, String(id));
        else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
        // sessionStorage unavailable: the choice is just not remembered
    }
}

function loadStandortId() {
    try {
        return sessionStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

// Bundesland/Ort selection for product pages: restores the saved Standort and saves every new choice
export function useStandort() {
    const [lands, setLands] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedLand, setSelectedLand] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const touched = useRef(false); // the customer chose something before the saved Standort was restored

    useEffect(() => {
        fetch(`${JOOMLA_API_BASE}&task=getLands&format=json`)
            .then((response) => response.json())
            .then((data) => setLands(Array.isArray(data) ? data : []))
            .catch((error) => console.error('Failed to fetch lands:', error));
    }, []);

    // Restore the saved Standort once the Bundesländer are known
    useEffect(() => {
        if (!lands.length) return;
        const storedId = loadStandortId();
        if (!storedId) return;
        fetch(`${JOOMLA_API_BASE}&task=getLocation&location_id=${encodeURIComponent(storedId)}&format=json`)
            .then((response) => response.json())
            .then((result) => {
                const location = result?.error ? null : result?.data;
                if (touched.current || !location) return;
                const landId = String(location.region_id);
                if (!lands.some((land) => String(land.id) === landId)) return;
                setSelectedLand(landId);
                setSelectedCity(String(location.id));
            })
            .catch((error) => console.error('Failed to restore Standort:', error));
    }, [lands]);

    // Load the Orte of the chosen Bundesland; drop a chosen Ort that is not among them
    useEffect(() => {
        if (!selectedLand) {
            setCities([]);
            return;
        }
        let cancelled = false;
        fetch(`${JOOMLA_API_BASE}&task=getCities&land_id=${selectedLand}&format=json`)
            .then((response) => response.json())
            .then((data) => {
                if (cancelled) return;
                const list = Array.isArray(data) ? data : [];
                setCities(list);
                setSelectedCity((city) => (list.some((c) => String(c.id) === String(city)) ? city : ''));
            })
            .catch((error) => console.error('Failed to fetch cities:', error));
        return () => {
            cancelled = true;
        };
    }, [selectedLand]);

    const handleLandChange = (e) => {
        touched.current = true;
        setSelectedLand(e.target.value);
        setSelectedCity('');
        saveStandortId(null);
    };

    const handleCityChange = (e) => {
        touched.current = true;
        setSelectedCity(e.target.value);
        saveStandortId(e.target.value);
    };

    return { lands, cities, selectedLand, selectedCity, handleLandChange, handleCityChange };
}
