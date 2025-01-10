import {useRouter} from "next/router";
import {useEffect} from "react";

const LoginPage = () => {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the desired submenu
        router.push('/haendler/login');
    }, [router]);

    return null; // Optionally return a loading indicator or nothing
};

export default LoginPage;
