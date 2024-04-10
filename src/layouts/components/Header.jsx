import { MenuHeader } from "../../components";
const Header = () => {
    return (
        <div className="w-full h-[75px] bg-main flex items-center justify-center fixed top-0 left-0 z-10">
            <div className="container flex items-center gap-8 ">
                <div className="w-[105px] h-full flex items-center justify-center">
                    <img
                        src="src/assets/logo.svg"
                        alt=""
                        className="w-full object-fill"
                    />
                </div>
                <MenuHeader />
                <div className="flex items-center [&>span>i]:text-2xl gap-8 [&>span>i]:cursor-pointer">
                    <span>
                        <i className="fa-light fa-magnifying-glass"></i>
                    </span>
                    <span>
                        <i className="fa-light fa-user"></i>
                    </span>
                    <span>
                        <i className="fa-light fa-heart"></i>
                    </span>
                    <span>
                        <i className="fa-light fa-cart-shopping"></i>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Header;
