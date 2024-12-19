import { useState, useEffect } from 'react';
import Link from 'next/link';

const FloatingMenu = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) { // Show the menu after scrolling down 100px
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: '200px',
            left: isVisible ? '20px' : '100px', // Slide in/out effect
            transition: 'left 0.3s ease-in-out',
            zIndex: 1000,
            backgroundColor: '#fff',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        }}>
            <ul>
                <li><Link href="#section1">Section 1</Link></li>
                <li><Link href="#section2">Section 2</Link></li>
                <li><Link href="#section3">Section 3</Link></li>
            </ul>
        </div>
    );
};

export default FloatingMenu;
