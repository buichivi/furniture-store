import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import Skeleton from 'react-loading-skeleton';
import useDataStore from '../store/dataStore';

const SliderBlog = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sliderBlogRef = useRef();
    const { blogs } = useDataStore();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.5,
            },
        );
        observer.observe(sliderBlogRef.current);
        return () => {
            if (sliderBlogRef.current) {
                observer.unobserve(sliderBlogRef.current);
            }
        };
    }, []);

    const prevRef = useRef(null);
    const nextRef = useRef(null);
    return (
        <div ref={sliderBlogRef}>
            <div className="mb-[30px] flex items-center justify-between">
                <h3 className="flex-1 text-center text-xl font-bold capitalize lg:text-left lg:text-2xl">Our blog</h3>
                <Link to="/blogs" className="hidden transition-colors hover:text-[#d01202] lg:inline-block">
                    See all {'>>'}
                </Link>
            </div>
            {!isVisible ? (
                <Skeleton height={500} />
            ) : (
                <Swiper
                    navigation={{
                        nextEl: nextRef.current,
                        prevEl: prevRef.current,
                    }}
                    modules={[Navigation]}
                    slidesPerView={1.2}
                    breakpoints={{
                        320: {
                            slidesPerView: 1,
                            spaceBetween: 0,
                        },
                        1280: {
                            slidesPerView: 1.2,
                            spaceBetween: 30,
                        },
                    }}
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
                    {blogs.map((item, index) => {
                        return (
                            <SwiperSlide key={index}>
                                <div className="group/blog-slide flex h-auto flex-col items-center justify-start lg:h-[450px] lg:flex-row lg:justify-between lg:gap-14">
                                    <div className="group/blog-slide-image relative h-full shrink-0 basis-3/5 overflow-hidden">
                                        <span className="absolute left-0 top-0 z-10 m-4 bg-white px-3 py-1 text-xs uppercase lg:m-8 lg:text-sm">
                                            {moment(item?.createdAt).format('ll')}
                                        </span>
                                        <Link to={`/blogs/${item?.slug}`} className="inline-block">
                                            <img
                                                src={item?.thumb}
                                                alt=""
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-all  duration-500 group-hover/blog-slide-image:scale-110"
                                            />
                                        </Link>
                                        <div className="absolute bottom-0 left-0 m-4 flex size-14 rounded-full transition-all duration-500 hover:scale-110 lg:m-8 lg:size-16">
                                            <div className="absolute left-1/2 top-1/2 z-0 inline-flex size-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#cbc3ba] lg:size-16"></div>
                                            <img
                                                src={item?.author?.avatar || '/images/account-placeholder.jpg'}
                                                alt=""
                                                loading="lazy"
                                                className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full object-cover lg:size-12"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="mb-2 lg:mb-5">
                                            {item?.tags?.map((tag, index) => {
                                                return (
                                                    <div key={index} className="mr-1 inline-block">
                                                        <Link
                                                            to={`/tag/${tag?.name}`}
                                                            className="text-xs uppercase text-[#848484] transition-colors hover:text-[#D10202] lg:text-sm"
                                                        >
                                                            {tag?.name}
                                                        </Link>
                                                        {index <= item?.tags?.length - 2 && ', '}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <Link
                                            to={`/blogs/${item?.slug}`}
                                            className="mb-2 inline-block text-2xl transition-colors hover:text-[#D10202] lg:mb-4 lg:text-3xl"
                                        >
                                            {item?.title}
                                        </Link>
                                        <p className="mb-3 text-sm leading-[1.5] tracking-wide text-[#848484] lg:text-base">
                                            {item?.description}
                                        </p>
                                        <Link
                                            to={`/blogs/${item?.slug}`}
                                            className="hover-text-effect text-sm font-bold uppercase lg:text-base"
                                        >
                                            Read more
                                        </Link>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                    <div
                        ref={prevRef}
                        className="absolute left-2 top-1/2 z-10 flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#ffffff80] text-xl text-black transition-all hover:bg-[#ffffffdc] group-hover/blog-slider:opacity-100 lg:left-10 lg:size-14 lg:opacity-0"
                    >
                        <i className="fa-light fa-angle-left"></i>
                    </div>
                    <div
                        ref={nextRef}
                        className="absolute right-2 top-1/2 z-10 flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#ffffff80] text-xl text-black transition-all hover:bg-[#ffffffdc] group-hover/blog-slider:opacity-100 lg:right-10 lg:size-14 lg:opacity-0"
                    >
                        <i className="fa-light fa-angle-right"></i>
                    </div>
                </Swiper>
            )}
        </div>
    );
};

export default SliderBlog;
