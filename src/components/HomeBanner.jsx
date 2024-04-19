import { Link } from "react-router-dom";

const HomeBanner = () => {
    return (
        <div className="flex items-end gap-[30px]">
            <div className="flex flex-1 shrink-0 flex-col">
                <Link className="group/banner_1 relative block h-full overflow-hidden">
                    <div className="absolute left-0 top-1/3 z-[1]">
                        <h3 className="mb-8 w-2/3 text-5xl capitalize tracking-wider">
                            Up to 40% off top lamp brands
                        </h3>
                        <span className="relative font-bold uppercase before:absolute before:bottom-0 before:right-0 before:h-[1px] before:w-full before:bg-black before:transition-all before:duration-500 before:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-black after:transition-all after:delay-500 after:duration-500 after:content-[''] group-hover/banner_1:before:w-0 group-hover/banner_1:after:w-full">
                            Shop now
                        </span>
                    </div>
                    <img
                        src="https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/2023/04/banner-0.jpg"
                        alt=""
                        className="w-full transition-all duration-500 group-hover/banner_1:scale-110"
                    />
                </Link>
                <Link className="group/banner_2 relative cursor-pointer">
                    <div className="absolute bottom-0 left-0 right-0 top-0 m-[15px] border-black">
                        <span className="absolute left-0 top-0 h-0 w-[1px] bg-black transition-all duration-500 group-hover/banner_2:h-full"></span>
                        <span className="absolute right-0 top-0 h-0 w-[1px] bg-black transition-all duration-500 group-hover/banner_2:h-full"></span>
                        <span className="absolute left-0 top-0 h-[1px] w-0 bg-black transition-all duration-500 group-hover/banner_2:w-full"></span>
                        <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-black transition-all duration-500 group-hover/banner_2:w-full"></span>
                    </div>
                    <div className="absolute left-0 top-0 p-[50px]">
                        <h5 className="mb-2 text-[16px] font-normal uppercase text-black">
                            New products
                        </h5>
                        <h3 className="mb-6 text-4xl font-bold capitalize tracking-wider">
                            Up to 25% off cabinets
                        </h3>
                        <span className="relative font-bold uppercase before:absolute before:bottom-0 before:right-0 before:h-[1px] before:w-full before:bg-black before:transition-all before:duration-500 before:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-black after:transition-all after:delay-500 after:duration-500 after:content-[''] group-hover/banner_2:before:w-0 group-hover/banner_2:after:w-full">
                            Shop now
                        </span>
                    </div>
                    <img
                        src="https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/2023/04/banner-1.jpg"
                        alt=""
                    />
                </Link>
            </div>
            <div className="flex-1 shrink-0">
                <Link className="group/banner_3 relative h-full w-full cursor-pointer">
                    <div className="absolute bottom-0 left-0 right-0 top-0 m-[15px] border-black">
                        <span className="absolute left-0 top-0 h-0 w-[1px] bg-white transition-all duration-500 group-hover/banner_3:h-full"></span>
                        <span className="absolute right-0 top-0 h-0 w-[1px] bg-white transition-all duration-500 group-hover/banner_3:h-full"></span>
                        <span className="absolute left-0 top-0 h-[1px] w-0 bg-white transition-all duration-500 group-hover/banner_3:w-full"></span>
                        <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-white transition-all duration-500 group-hover/banner_3:w-full"></span>
                    </div>
                    <div className="absolute left-0 top-0 w-full p-[50px]">
                        <h5 className="mb-6 text-center text-2xl uppercase text-white">
                            Big sale
                        </h5>
                        <h2 className="mx-auto mb-10 w-[90%] text-wrap text-center text-6xl capitalize text-white">
                            Up to 70% off furniture & decor
                        </h2>
                        <div className="text-center">
                            <span className="relative mx-auto text-base font-bold uppercase text-white before:absolute before:bottom-0 before:right-0 before:h-[1px] before:w-full before:bg-white before:transition-all before:duration-500 before:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-white after:transition-all after:delay-500 after:duration-500 after:content-[''] group-hover/banner_3:before:w-0 group-hover/banner_3:after:w-full">
                                Shop now
                            </span>
                        </div>
                    </div>
                    <img
                        src="https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/2023/04/banner-2.jpg"
                        alt=""
                        className="w-full object-contain"
                    />
                </Link>
            </div>
        </div>
    );
};

export default HomeBanner;
