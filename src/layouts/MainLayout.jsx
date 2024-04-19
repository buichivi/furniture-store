import { useEffect, useRef } from "react";
import { Header, Footer } from "./components";
import PropTypes from "prop-types";

const MainLayout = ({ children }) => {
    const scroll_to_top = useRef();

    useEffect(() => {
        window.addEventListener("scroll", () => {
            var doc = document.documentElement;
            var top = (window.scrollY || doc.scrollTop) - (doc.clientTop || 0);
            if (top >= 200) {
                scroll_to_top.current.style = "transform: translateX(0)";
            } else if (top == 0) {
                scroll_to_top.current.style = "transform: translateX(100%)";
            }
        });
    }, []);

    return (
        <div className="relative">
            <Header />
            {children}
            <Footer />
            <div
                ref={scroll_to_top}
                className="fixed bottom-0 right-0 flex size-14 translate-x-full cursor-pointer items-center justify-center bg-black text-white transition-all duration-500"
                onClick={() => {
                    window.scrollTo(0, 0);
                }}
            >
                <i className="fa-light fa-arrow-up"></i>
            </div>
        </div>
    );
};

MainLayout.propTypes = {
    children: PropTypes.element,
};

export default MainLayout;
