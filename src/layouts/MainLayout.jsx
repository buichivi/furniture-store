import { useEffect, useRef } from 'react';
import { Header, Footer } from './components';
import PropTypes from 'prop-types';
import ScrollToTop from '../components/ScrollToTop';
import ProductQuickView from '../components/ProductQuickView';
import CompareProduct from '../components/CompareProduct';
import { useLocation, Outlet } from 'react-router-dom';

const getPageTitle = (name) => {
    let title = '';
    if (name.length == 1 && name[0] == '') return 'Fixtures';
    for (let i of name) {
        title += i.charAt(0).toUpperCase() + i.slice(1) + ' ';
    }
    return title;
};

const MainLayout = ({ children }) => {
    const scroll_to_top = useRef();
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
        if (location.pathname.split('/').at(-2) == 'search')
            document.title = decodeURI(`Search results for "${location.pathname.split('/').at(-1).split('-')}"`);
        else document.title = decodeURI(getPageTitle(location.pathname.split('/').at(-1).split('-')));
    }, [location.pathname]);

    return (
        <div className="relative">
            <Header />
            <Outlet />
            {children}
            <Footer />
            <div
                ref={scroll_to_top}
                className="fixed bottom-0 right-0 flex size-12 translate-x-full cursor-pointer items-center justify-center bg-black text-white transition-all duration-500"
                onClick={() => {
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                }}
            >
                <i className="fa-light fa-arrow-up"></i>
            </div>
            <ProductQuickView />
            <CompareProduct />
            <ScrollToTop />
        </div>
    );
};

MainLayout.propTypes = {
    children: PropTypes.element,
};

export default MainLayout;
