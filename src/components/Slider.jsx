import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { EffectFade } from 'swiper/modules';
import React, { useEffect, useState } from 'react';
import apiRequest from '../utils/apiRequest';
import useAuthStore from '../store/authStore';

const Slider = () => {
  const [sliders, setSliders] = useState([]);
  const { token } = useAuthStore();

  useEffect(() => {
    apiRequest
      .get('/sliders')
      .then((res) => setSliders(res.data?.sliders?.filter((sld) => sld?.active)))
      .catch((err) => console.log(err));
  }, [token]);
  return (
    <React.Fragment>
      {sliders?.length > 0 && (
        <Swiper
          pagination={{
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: (_, className) => {
              return `<span class="bullet !size-3 ${className}"></span>`;
            },
          }}
          modules={[Pagination, EffectFade, Autoplay]}
          effect="fade"
          className="h-full w-full"
          autoplay={{
            delay: 5000,
          }}
          loop={true}
          slidesPerView={1}
          initialSlide={0}
        >
          {sliders.map(({ title, heading, description, image, link }, index) => {
            return (
              <SwiperSlide key={index} className="">
                {({ isActive }) => (
                  <div
                    className={`relative flex h-full w-full cursor-pointer flex-col items-center transition-all ${
                      !isActive && 'opacity-0'
                    }`}
                  >
                    <div
                      className={`absolute left-1/2 top-[20%] w-full -translate-x-1/2 text-center lg:left-0 lg:top-[35%] lg:translate-x-0 lg:text-left [&>*]:transition-all [&>*]:duration-700 ${
                        isActive ? '[&>*]:translate-x-0 [&>*]:opacity-100' : '[&>*]:-translate-x-full [&>*]:opacity-0'
                      }`}
                    >
                      <h4 className="mb-4 font-inter text-sm uppercase delay-100 lg:text-base">{title}</h4>
                      <h2 className="w-full text-3xl font-medium leading-normal tracking-wider delay-300 lg:w-[40%] lg:text-[48px]">
                        {heading}
                      </h2>
                      <p className="text-sm font-normal delay-500 lg:text-lg">{description}</p>
                      <Link to={link} className="hover-text-effect mt-4 delay-300 lg:mt-10 lg:delay-700">
                        SHOP NOW
                      </Link>
                    </div>
                    <img
                      src={image}
                      alt=""
                      className={`slide-img absolute right-1/2 top-[65%] h-auto w-1/2 translate-x-1/2 transition-all duration-1000 md:top-[45%] lg:right-0 lg:top-[25%] lg:translate-x-0 lg:translate-y-0 ${
                        isActive
                          ? 'translate-y-0 opacity-100 lg:translate-x-0'
                          : 'translate-y-full opacity-0 lg:translate-x-full'
                      }`}
                    />
                  </div>
                )}
              </SwiperSlide>
            );
          })}
          <div className="swiper-pagination absolute !left-1/2 bottom-0 m-0 !w-auto !-translate-x-1/2 lg:left-0 lg:translate-x-0"></div>
        </Swiper>
      )}
    </React.Fragment>
  );
};

export default Slider;
