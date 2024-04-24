import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const Navigation = ({ isShowPageName = true }) => {
    const location = useLocation();
    const pathNames = location.pathname.split("/");
    return (
        <div className="py-14">
            <div className="mb-6 flex justify-center">
                {[
                    {
                        name: "home",
                        to: "/",
                    },
                    {
                        name: "shop",
                        to: "/shop",
                    },
                ].map(({ name, to }, index) => {
                    return (
                        <div key={index} className="mr-2 flex items-center gap-2">
                            {pathNames.at(-1) != name ? (
                                <Link to={to} className="capitalize text-[#848484] hover:underline">
                                    {name}
                                </Link>
                            ) : (
                                <span className="capitalize text-black hover:no-underline">{name}</span>
                            )}
                            {index < ["Home", "Shop"].length - 1 && <span className="text-[#848484]">/</span>}
                        </div>
                    );
                })}
            </div>
            {isShowPageName && (
                <h3 className="text-center text-4xl font-semibold capitalize tracking-wider text-black">Shop</h3>
            )}
        </div>
    );
};

Navigation.propTypes = {
    isShowPageName: PropTypes.bool,
};

export default Navigation;
