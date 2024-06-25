import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ProductCard from './ProductCard';
import { useRef } from 'react';
import useDataStore from '../store/dataStore';
import PropTypes from 'prop-types';

function getRandomProducts(products, product, count) {
    // Lọc ra các sản phẩm ngoại trừ sản phẩm có id là product
    const filteredProducts = products.filter(
        (prod) => prod._id !== product?._id && prod?.category?._id == product?.category?._id,
    );

    // Sử dụng hàm ngẫu nhiên để xáo trộn danh sách
    const shuffledProducts = filteredProducts.sort(() => 0.5 - Math.random());

    // Lấy ra count sản phẩm ngẫu nhiên từ danh sách đã xáo trộn
    return shuffledProducts.slice(0, count);
}

const RelatedProducts = ({ product }) => {
    const nextRef = useRef();
    const prevRef = useRef();
    const { products } = useDataStore();

    return (
        <>
            <h3 className="mb-12 text-2xl font-bold uppercase tracking-wider">Related products</h3>
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
                {getRandomProducts(products, product, 5).map((product, index) => (
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

RelatedProducts.propTypes = {
    product: PropTypes.object,
};

export default RelatedProducts;
