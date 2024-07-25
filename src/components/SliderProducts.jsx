import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ProductCard from './ProductCard';
import { useRef } from 'react';
import PropTypes from 'prop-types';

const SliderProducts = ({ title = '', products = [] }) => {
    const nextRef = useRef();
    const prevRef = useRef();

    return (
        <div>
            <h3 className="mb-12 text-center font-inter text-xl font-bold capitalize tracking-wider lg:text-left lg:text-2xl">
                {title}
            </h3>
            <Swiper
                slidesPerView={4}
                spaceBetween={30}
                breakpoints={{
                    320: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 4,
                    },
                }}
                modules={[Navigation]}
                onInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                    swiper.navigation.init();
                    swiper.navigation.update();
                }}
                className="[&:hover_.nextBtn]:opacity-100 [&:hover_.prevBtn]:opacity-100 "
            >
                {products.map((product, index) => (
                    <SwiperSlide key={index}>
                        <ProductCard product={product} />
                    </SwiperSlide>
                ))}
                <span
                    ref={prevRef}
                    className="nextBtn absolute left-1 top-1/2 z-10 size-10 -translate-y-1/2 cursor-pointer rounded-full bg-[#ffffff80] text-center text-lg leading-10 text-black shadow-md transition-all hover:bg-white lg:size-12 lg:leading-[48px] lg:opacity-0"
                >
                    <i className="fa-sharp fa-light fa-angle-left"></i>
                </span>
                <span
                    ref={nextRef}
                    className="prevBtn absolute right-1 top-1/2 z-10 size-10 -translate-y-1/2 cursor-pointer rounded-full bg-[#ffffff80]  text-center text-lg leading-10 text-black shadow-md transition-all hover:bg-white lg:size-12 lg:leading-[48px] lg:opacity-0"
                >
                    <i className="fa-sharp fa-light fa-angle-right"></i>
                </span>
            </Swiper>
        </div>
    );
};

SliderProducts.propTypes = {
    title: PropTypes.string,
    products: PropTypes.array,
};

export default SliderProducts;
