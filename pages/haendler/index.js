import { useEffect } from 'react';
import { useRouter } from 'next/router';

const HaendlerPage = () => {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the desired submenu
        router.push('/haendler/login');
    }, [router]);

    return null; // Optionally return a loading indicator or nothing
};

export default HaendlerPage;
