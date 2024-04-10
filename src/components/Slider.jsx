/* eslint-disable react/no-unescaped-entities */
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { EffectFade } from "swiper/modules";

const Slider = () => {
    return (
        <Swiper
            pagination={{
                clickable: true,
                renderBullet: (_, className) => {
                    return `<span class="bullet ${className}"></span>`;
                },
            }}
            modules={[Pagination, EffectFade]}
            effect="fade"
            className="h-full w-full"
        >
            {[
                {
                    title: "New arrivals",
                    heading: "Chairs & Seating You'll love",
                    des: "Designer chair styles for every space - ",
                    des_focus: "Free shipping",
                    url_img:
                        "https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/revslider/furniture-1/slide-1-home1-2.png",
                },
                {
                    title: "Sale off 30%",
                    heading: "Lamps And Lighting Great Low Prices",
                    des: "Free standard shipping",
                    des_focus: "with $35",
                    url_img:
                        "https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/revslider/furniture-1/slide-2-home1-1.png",
                },
                {
                    title: "Sale off 25%",
                    heading: "Discover Living Room Tables",
                    des: "Free standard shipping",
                    des_focus: "with $45",
                    url_img:
                        "https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/revslider/furniture-1/slide-3-home1-1.png",
                },
            ].map(({ title, heading, des, des_focus, url_img }, index) => {
                return (
                    <SwiperSlide key={index} className="">
                        {({ isActive }) => (
                            <div
                                className={`w-full h-full flex items-center relative transition-all cursor-pointer ${
                                    !isActive && "opacity-0"
                                }`}
                            >
                                <div
                                    className={`w-full absolute top-[35%] left-0 ${
                                        isActive
                                            ? "translate-x-0 opacity-100"
                                            : "-translate-x-full opacity-1"
                                    } transition-all duration-1000`}
                                >
                                    <h4 className="font-inter mb-4 uppercase">
                                        {title}
                                    </h4>
                                    <h2 className="w-[40%] text-[48px] font-medium tracking-wider ">
                                        {heading}
                                    </h2>
                                    <p className="text-base font-normal">
                                        {des}{" "}
                                        <span className="font-bold">
                                            {des_focus}
                                        </span>
                                    </p>
                                    <Link className="mt-10 hover-text-effect">
                                        SHOP NOW
                                    </Link>
                                </div>
                                <img
                                    src={url_img}
                                    alt=""
                                    className={`slide-img w-1/2 h-auto absolute top-[25%] right-0 transition-all duration-1000 ${
                                        isActive
                                            ? "translate-x-0 opacity-100"
                                            : "translate-x-full opacity-0"
                                    }`}
                                />
                            </div>
                        )}
                    </SwiperSlide>
                );
            })}
        </Swiper>
    );
};

export default Slider;
