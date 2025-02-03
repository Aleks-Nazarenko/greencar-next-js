import { useRouter } from 'next/router';

export default function VehicleSwitcher () {
    const router = useRouter();

    // Determine the background image based on the current route
    const containerBackground = (() => {
        if (router.pathname.startsWith('/pkw-partikelfilter')) {
            return "container-background-pkw";
        } else if (router.pathname.startsWith('/lkw-partikelfilter')) {
            return "container-background-lkw";
        } else if (router.pathname.startsWith('/bus-partikelfilter')) {
        return "container-background-lkw";
        }  else if (router.pathname.startsWith('/baumaschinen-partikelfilter')) {
            return "container-background-bm";
        } else {
            return "container-background-pkw";
        }
    })();

    return (
        <div className={containerBackground}>

        </div>
    );
}
