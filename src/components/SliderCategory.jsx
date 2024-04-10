import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

const SliderCategory = () => {
    return (
        <Swiper
            slidesPerView={4}
            spaceBetween={30}
            autoplay={{
                delay: 5000,
            }}
        >
            {[1, 2, 3, 4, 5, 6].map((item, index) => (
                <SwiperSlide key={index}>
                    <div className="h-[120px] flex items-center">
                        <Link className="w-[120px] h-[120px] mr-[25px] relative group overflow-hidden rounded-full ">
                            <img
                                src="https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/2023/04/lamp-1-310x310.jpg"
                                alt=""
                                className="w-full h-full object-contain"
                            />
                            <div className="group-hover:bg-[#3337] transition-colors w-full h-full absolute z-1 top-0 left-0"></div>
                            <i className="fa-regular fa-link-simple rotate-[145deg] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:block hidden text-white"></i>
                        </Link>
                        <div>
                            <Link className="font-bold hover:text-[#D10202] transition-colors">Chair</Link>
                            <p>5 products</p>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default SliderCategory;
