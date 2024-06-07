import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { EffectFade } from 'swiper/modules';

const Slider = () => {
    return (
        <Swiper
            pagination={{
                el: '.swiper-pagination',
                clickable: true,
                renderBullet: (_, className) => {
                    return `<span class="bullet ${className}"></span>`;
                },
            }}
            modules={[Pagination, EffectFade, Autoplay]}
            effect="fade"
            className="h-full w-full"
            autoplay={{
                delay: 5000,
            }}
            loop={true}
        >
            {[
                {
                    title: 'New arrivals',
                    heading: "Chairs & Seating You'll love",
                    des: 'Designer chair styles for every space - ',
                    des_focus: 'Free shipping',
                    url_img:
                        'https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/revslider/furniture-1/slide-1-home1-2.png',
                },
                {
                    title: 'Sale off 30%',
                    heading: 'Lamps And Lighting Great Low Prices',
                    des: 'Free standard shipping',
                    des_focus: 'with $35',
                    url_img:
                        'https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/revslider/furniture-1/slide-2-home1-1.png',
                },
                {
                    title: 'Sale off 25%',
                    heading: 'Discover Living Room Tables',
                    des: 'Free standard shipping',
                    des_focus: 'with $45',
                    url_img:
                        'https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/revslider/furniture-1/slide-3-home1-1.png',
                },
            ].map(({ title, heading, des, des_focus, url_img }, index) => {
                return (
                    <SwiperSlide key={index} className="">
                        {({ isActive }) => (
                            <div
                                className={`relative flex h-full w-full cursor-pointer items-center transition-all ${
                                    !isActive && 'opacity-0'
                                }`}
                            >
                                <div
                                    className={`absolute left-0 top-[35%] w-full [&>*]:transition-all [&>*]:duration-700 ${
                                        isActive
                                            ? '[&>*]:translate-x-0 [&>*]:opacity-100'
                                            : '[&>*]:opacity-1 [&>*]:-translate-x-full'
                                    }`}
                                >
                                    <h4 className="mb-4 font-inter uppercase delay-100">{title}</h4>
                                    <h2 className="w-[40%] text-[48px] font-medium tracking-wider delay-300">
                                        {heading}
                                    </h2>
                                    <p className="text-lg font-normal delay-500">
                                        {des} <span className="font-bold">{des_focus}</span>
                                    </p>
                                    <Link className="hover-text-effect mt-10 delay-700">SHOP NOW</Link>
                                </div>
                                <img
                                    src={url_img}
                                    alt=""
                                    className={`slide-img absolute right-0 top-[25%] h-auto w-1/2 transition-all duration-1000 ${
                                        isActive ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                                    }`}
                                />
                            </div>
                        )}
                    </SwiperSlide>
                );
            })}
            <div className="swiper-pagination absolute bottom-0 left-0 m-0 !w-auto"></div>
        </Swiper>
    );
};

export default Slider;
