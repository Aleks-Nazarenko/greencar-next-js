import MapComponent from "@/components/MapComponent";


export default function KfzWerkstattFiltereinbauGreencar() {
    return (
        <>
            <div className={"row g-0 pb-4"}>
                <h1 className={"pb-0 mb-0"}>GREENCAR Standorte</h1>
            </div>
            <div className="row g-0">
                <MapComponent />
            </div>

        </>
    );
}
