import { useEffect, useRef, useState } from 'react';
import { Header, Footer } from './components';
import PropTypes from 'prop-types';
import { ProductQuickView } from '../components';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';

const MainLayout = ({ children }) => {
    const scroll_to_top = useRef();
    const [prevLoc, setPrevLoc] = useState('');
    const location = useLocation();

    useEffect(() => {
        const scrollToTop = () => {
            var doc = document.documentElement;
            var top = (window.scrollY || doc.scrollTop) - (doc.clientTop || 0);
            if (top >= 200) {
                scroll_to_top.current.style = 'transform: translateX(0)';
            } else if (top == 0) {
                scroll_to_top.current.style = 'transform: translateX(100%)';
            }
        };
        window.addEventListener('scroll', scrollToTop);
        return () => {
            window.removeEventListener('scroll', scrollToTop);
        };
    }, []);

    useEffect(() => {
        setPrevLoc(location.pathname);
        NProgress.configure({
            showSpinner: false,
        });
        NProgress.start();
        if (location.pathname === prevLoc) {
            setPrevLoc('');
            NProgress.done();
        }
    }, [location]);

    useEffect(() => {
        NProgress.done();
    }, [prevLoc]);

    return (
        <div className="relative">
            {/* <Progress /> */}
            <Header />
            {children}
            <Footer />
            <div
                ref={scroll_to_top}
                className="fixed bottom-0 right-0 flex size-14 translate-x-full cursor-pointer items-center justify-center bg-black text-white transition-all duration-500"
                onClick={() => {
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                }}
            >
                <i className="fa-light fa-arrow-up"></i>
            </div>
            <ProductQuickView />
        </div>
    );
};

MainLayout.propTypes = {
    children: PropTypes.element,
};

export default MainLayout;
