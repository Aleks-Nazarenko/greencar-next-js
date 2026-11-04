import {PKW_NACHRUESTFILTER_ENABLED} from "@/utils/config";

// Categories for the "Kategorie" select on /anfrage-partikelfilter/.
// Product pages link there with ?kategorie=<value> to pre-select one.
// Categories with `redirect` have their own form: choosing one sends the visitor there
// (with ?kategorie=<value>, so that form can tell the shop which vehicle type it is).
export const ANFRAGE_KATEGORIEN = [
    {value: "pkw-austauschfilter", label: "PKW Austauschfilter"},
    ...(PKW_NACHRUESTFILTER_ENABLED ? [{value: "pkw-nachruestfilter", label: "PKW Nachrüstfilter"}] : []),
    {value: "pkw-filterreinigung", label: "PKW Filterreinigung", redirect: "/anfrage-filterreinigung/"},
    {value: "lkw-dpf-euro-vi", label: "LKW DPF Euro VI"},
    {value: "lkw-schalldaempfer-euro-vi", label: "LKW Schalldämpfer Euro VI"},
    {value: "lkw-filterreinigung", label: "LKW Filterreinigung", redirect: "/anfrage-filterreinigung/"},
    {value: "bus-dpf-euro-vi", label: "Bus DPF Euro VI"},
    {value: "bus-filterreinigung", label: "Bus Filterreinigung", redirect: "/anfrage-filterreinigung/"},
    {value: "baumaschinen-nachruestfilter", label: "Baumaschinen Nachrüstfilter"},
    {value: "baumaschinen-filterreinigung", label: "Baumaschinen Filterreinigung", redirect: "/anfrage-filterreinigung-bau/"},
    {value: "sonstiges", label: "Sonstiges"},
];

export function findAnfrageKategorie(value) {
    return ANFRAGE_KATEGORIEN.find((k) => k.value === value) || null;
}

// Link to the general inquiry form with the category pre-selected
export function anfrageHref(kategorie) {
    return `/anfrage-partikelfilter/?${new URLSearchParams({kategorie}).toString()}`;
}
