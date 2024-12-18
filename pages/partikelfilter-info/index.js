import { useEffect } from 'react';
import { useRouter } from 'next/router';

const IndexPage = () => {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the desired submenu
        router.push('/partikelfilter-info/filter-lkw-infos');
    }, [router]);

    return null; // Optionally return a loading indicator or nothing
};

export default IndexPage;
