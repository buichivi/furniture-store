import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
const ScrollToTop = () => {
    const { pathname, hash } = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pathname, hash]);
    return null;
};

export default ScrollToTop;
