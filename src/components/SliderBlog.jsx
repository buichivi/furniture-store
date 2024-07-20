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
            <div className="flex items-center justify-between">
                <h3 className="mb-[30px] text-2xl font-bold capitalize ">
                    Our blog
                </h3>
                <Link
                    to="/blogs"
                    className="transition-colors hover:text-[#d01202]"
                >
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
                                <div className="group/blog-slide flex h-[450px] items-center justify-between gap-14">
                                    <div className="group/blog-slide-image relative h-full shrink-0 basis-3/5 overflow-hidden">
                                        <span className="absolute left-0 top-0 z-10 m-8 bg-white px-3 py-1 text-sm uppercase">
                                            {moment(item?.createdAt).format(
                                                'll',
                                            )}
                                        </span>
                                        <Link
                                            to={`/blogs/${item?.slug}`}
                                            className="inline-block"
                                        >
                                            <img
                                                src={item?.thumb}
                                                alt=""
                                                className="h-full w-full object-cover transition-all  duration-500 group-hover/blog-slide-image:scale-110"
                                            />
                                        </Link>
                                        <div className="absolute bottom-0 left-0 m-8 flex size-16 rounded-full transition-all duration-500 hover:scale-110">
                                            <div className="absolute left-1/2 top-1/2 z-0 inline-flex size-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#cbc3ba]"></div>
                                            <img
                                                src={
                                                    item?.author?.avatar ||
                                                    '/images/account-placeholder.jpg'
                                                }
                                                alt=""
                                                className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 shrink-0">
                                        <div className="mb-5">
                                            {item?.tags?.map((tag, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className="mr-1 inline-block"
                                                    >
                                                        <Link
                                                            to={`/tag/${tag?.name}`}
                                                            className="text-sm uppercase text-[#848484] transition-colors hover:text-[#D10202]"
                                                        >
                                                            {tag?.name}
                                                        </Link>
                                                        {index <=
                                                            item?.tags?.length -
                                                                2 && ', '}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <Link
                                            to={`/blog/${item?.slug}`}
                                            className="mb-4 inline-block text-3xl transition-colors hover:text-[#D10202]"
                                        >
                                            {item?.title}
                                        </Link>
                                        <p className="mb-3 text-base leading-[1.5] tracking-wide text-[#848484]">
                                            {item?.description}
                                        </p>
                                        <Link
                                            to={`/blog/${item?.slug}`}
                                            className="hover-text-effect font-bold uppercase"
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
            )}
        </div>
    );
};

export default SliderBlog;
