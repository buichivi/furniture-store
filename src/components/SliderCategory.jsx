import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

const SliderCategory = () => {
    return (
        <Swiper
            slidesPerView={4}
            spaceBetween={30}
            loop={true}
            autoplay={{
                delay: 3000,
            }}
            loopAdditionalSlides={1}
        >
            {[
                {
                    url: "https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/2023/04/bed-310x310.jpg",
                    type: "Bed",
                    number_of_products: 7,
                },
                {
                    url: "https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/2023/04/lamp-1-310x310.jpg",
                    type: "Lamp",
                    number_of_products: 5,
                },
                {
                    url: "https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/2023/04/table-310x310.jpg",
                    type: "Table",
                    number_of_products: 10,
                },
                {
                    url: "https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/2023/04/chair-1-310x310.jpg",
                    type: "Chair",
                    number_of_products: 12,
                },
            ].map(({ url, type, number_of_products }, index) => (
                <SwiperSlide key={index}>
                    <div className="flex h-[120px] items-center">
                        <Link className="group relative mr-[25px] h-[120px] w-[120px] shrink-0 overflow-hidden rounded-full ">
                            <img
                                src={url}
                                alt=""
                                className="h-full w-full object-contain transition-all duration-500 group-hover:scale-110"
                            />
                            <div className="z-1 absolute left-0 top-0 h-full w-full transition-colors duration-500 group-hover:bg-[#3337]"></div>
                            <i className="fa-regular fa-link-simple absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[145deg] text-white opacity-0 duration-500 group-hover:opacity-100"></i>
                        </Link>
                        <div>
                            <Link className="font-bold transition-colors hover:text-[#D10202]">{type}</Link>
                            <p>
                                {number_of_products} product
                                {number_of_products > 2 && "s"}
                            </p>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default SliderCategory;
