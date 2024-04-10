import { Header, Footer } from "./components";
import PropTypes from "prop-types";

const MainLayout = ({ children }) => {
    return (
        <div>
            <Header />
            <div>{children}</div>
            <Footer />
        </div>
    );
};

MainLayout.propTypes = {
    children: PropTypes.element,
};

export default MainLayout;
