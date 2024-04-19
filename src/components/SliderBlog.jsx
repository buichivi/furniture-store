import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import { useRef } from "react";

const SliderBlog = () => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    return (
        <div>
            <h3 className="mb-[30px] text-3xl font-bold capitalize ">
                Our blog
            </h3>
            <Swiper
                navigation={{
                    nextEl: nextRef.current,
                    prevEl: prevRef.current,
                }}
                modules={[Navigation]}
                slidesPerView={1.2}
                spaceBetween={30}
                loop={true}
                onInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                    swiper.navigation.init();
                    swiper.navigation.update();
                }}
                className="group/blog-slider"
            >
                {[1, 2, 3].map((item, index) => {
                    return (
                        <SwiperSlide key={index}>
                            <div className="group/blog-slide flex h-[450px] items-center justify-between gap-14">
                                <div className="group/blog-slide-image relative h-full shrink-0 basis-3/5 overflow-hidden">
                                    <span className="absolute left-0 top-0 z-10 m-8 bg-white px-3 py-1 text-base">
                                        APR 9, 2023
                                    </span>
                                    <img
                                        src="https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/2022/10/blog-1-1174x862.jpg"
                                        alt=""
                                        className="h-full w-full object-cover transition-all  duration-500 group-hover/blog-slide-image:scale-110"
                                    />
                                    <Link className="absolute bottom-0 left-0 m-8 flex size-16 rounded-full transition-all duration-500 hover:scale-110">
                                        <div className="absolute left-1/2 top-1/2 z-0 inline-flex size-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#cbc3ba]"></div>
                                        <img
                                            src="https://secure.gravatar.com/avatar/f458ff8b61e871611d3de680ec718a03?s=150&d=mm&r=g"
                                            alt=""
                                            className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full object-cover"
                                        />
                                    </Link>
                                </div>
                                <div className="flex-1 shrink-0">
                                    <div className="mb-5 flex gap-1">
                                        {["Chair", "Furniture"].map(
                                            (type, index) => {
                                                return (
                                                    <div key={index}>
                                                        <Link className="text-base uppercase text-[#848484] transition-colors hover:text-[#D10202]">
                                                            {type}
                                                        </Link>
                                                        {index <=
                                                            [
                                                                "Chair",
                                                                "Furniture",
                                                            ].length -
                                                                2 && ", "}
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                    <Link className="mb-4 inline-block text-4xl transition-colors hover:text-[#D10202]">
                                        What is Feng Shui and How Can I Use It
                                        When I Decorate?
                                    </Link>
                                    <p className="mb-3 text-xl leading-[1.5] tracking-wide text-[#848484]">
                                        Nunc ut sem ut ex sollicitudin commodo.
                                        Suspendisse non enim felis. Nam nec diam
                                        ultricies, malesuada
                                    </p>
                                    <Link className="hover-text-effect font-bold uppercase">
                                        Read more
                                    </Link>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
                <div
                    ref={prevRef}
                    className="absolute left-10 top-1/2 z-10 flex size-14 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#ffffff80] text-xl text-black opacity-0 transition-all hover:bg-[#ffffffdc] group-hover/blog-slider:opacity-100"
                >
                    <i className="fa-light fa-angle-left"></i>
                </div>
                <div
                    ref={nextRef}
                    className="absolute right-10 top-1/2 z-10 flex size-14 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#ffffff80] text-xl text-black opacity-0 transition-all hover:bg-[#ffffffdc] group-hover/blog-slider:opacity-100"
                >
                    <i className="fa-light fa-angle-right"></i>
                </div>
            </Swiper>
        </div>
    );
};

export default SliderBlog;
