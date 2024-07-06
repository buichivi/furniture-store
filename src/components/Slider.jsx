import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { EffectFade } from 'swiper/modules';
import { useEffect, useState } from 'react';
import apiRequest from '../utils/apiRequest';
import useAuthStore from '../store/authStore';

const Slider = () => {
    const [sliders, setSliders] = useState([]);
    const { token } = useAuthStore();

    useEffect(() => {
        apiRequest
            .get('/sliders', { headers: { Authorization: 'Bearer ' + token } })
            .then((res) => setSliders(res.data?.sliders?.filter((sld) => sld?.active)))
            .catch((err) => console.log(err));
    }, [token]);
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
            {sliders.map(({ title, heading, description, image, link }, index) => {
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
                                    <h2 className="w-[40%] text-[48px] font-medium leading-normal tracking-wider delay-300">
                                        {heading}
                                    </h2>
                                    <p className="text-lg font-normal delay-500">{description}</p>
                                    <Link to={link} className="hover-text-effect mt-10 delay-700">
                                        SHOP NOW
                                    </Link>
                                </div>
                                <img
                                    src={image}
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
