import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import useDataStore from '../store/dataStore';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

const SliderCategory = ({ products = [], className }) => {
    const { categories, getNavigationPath } = useDataStore();

    console.log('Slider category re-render');

    const listCategory = useMemo(() => {
        const categoryMap = new Map();

        if (categories.length > 0 && products.length > 0) {
            categories.forEach((cate) => {
                if (cate.parentId) {
                    categoryMap.set(cate.name, { category: cate, numberOfProducts: 0 });
                }
            });

            products.forEach((prod) => {
                const category = prod.category;
                if (categoryMap.has(category.name)) {
                    categoryMap.set(category.name, {
                        category,
                        numberOfProducts: categoryMap.get(category.name).numberOfProducts + 1,
                    });
                }
            });
        }
        // eslint-disable-next-line no-unused-vars
        return Array.from(categoryMap).filter(([_, item]) => item.numberOfProducts > 0);
    }, [categories, products]);

    console.log(listCategory.length < 4 ? listCategory.length : 4);

    return (
        <Swiper
            slidesPerView={listCategory.length < 4 ? listCategory.length : 4}
            spaceBetween={listCategory.length < 4 ? 10 : 30}
            loop={true}
            autoplay={{
                delay: 3000,
            }}
            className={className}
        >
            {/* eslint-disable-next-line no-unused-vars */}
            {listCategory.map(([_, { category, numberOfProducts }], index) => {
                return (
                    <SwiperSlide key={index}>
                        <div className="flex h-[120px] items-center justify-center">
                            <Link
                                to={getNavigationPath(category, 'category')}
                                className="group relative mr-[25px] h-[120px] w-[120px] shrink-0 overflow-hidden rounded-full "
                            >
                                <img
                                    src={category.imageUrl}
                                    alt=""
                                    className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
                                />
                                <div className="z-1 absolute left-0 top-0 h-full w-full transition-colors duration-500 group-hover:bg-[#3337]"></div>
                                <i className="fa-regular fa-link-simple absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[145deg] text-white opacity-0 duration-500 group-hover:opacity-100"></i>
                            </Link>
                            <div>
                                <Link className="font-bold transition-colors hover:text-[#D10202]">
                                    {category.name}
                                </Link>
                                <p>
                                    {numberOfProducts} product
                                    {numberOfProducts >= 2 && 's'}
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                );
            })}
        </Swiper>
    );
};
SliderCategory.propTypes = {
    products: PropTypes.array,
    className: PropTypes.string,
};

export default SliderCategory;
