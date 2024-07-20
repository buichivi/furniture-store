import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ProductCard from './ProductCard';
import { useRef } from 'react';
import PropTypes from 'prop-types';

const SliderProducts = ({ title = '', products = [] }) => {
    const nextRef = useRef();
    const prevRef = useRef();

    return (
        <>
            <h3 className="mb-12 font-inter text-2xl font-bold capitalize tracking-wider">
                {title}
            </h3>
            <Swiper
                slidesPerView={4}
                spaceBetween={30}
                modules={[Navigation]}
                onInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                    swiper.navigation.init();
                    swiper.navigation.update();
                }}
                loop={true}
                className="[&:hover_.nextBtn]:opacity-100 [&:hover_.prevBtn]:opacity-100 "
            >
                {products.map((product, index) => (
                    <SwiperSlide key={index}>
                        <ProductCard product={product} />
                    </SwiperSlide>
                ))}
                <span
                    ref={prevRef}
                    className="nextBtn absolute left-1 top-1/2 z-10 size-12 -translate-y-1/2 cursor-pointer rounded-full bg-[#ffffff80] text-center text-lg leading-[48px] text-black opacity-0 transition-all hover:bg-white"
                >
                    <i className="fa-sharp fa-light fa-angle-left"></i>
                </span>
                <span
                    ref={nextRef}
                    className="prevBtn absolute right-1 top-1/2 z-10 size-12 -translate-y-1/2 cursor-pointer  rounded-full bg-[#ffffff80] text-center text-lg leading-[48px] text-black opacity-0 transition-all hover:bg-white"
                >
                    <i className="fa-sharp fa-light fa-angle-right"></i>
                </span>
            </Swiper>
        </>
    );
};

SliderProducts.propTypes = {
    title: PropTypes.string,
    products: PropTypes.array,
};

export default SliderProducts;
