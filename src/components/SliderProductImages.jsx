import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
const init = [
    "https://swiperjs.com/demos/images/nature-2.jpg",
    "https://swiperjs.com/demos/images/nature-3.jpg",
    "https://swiperjs.com/demos/images/nature-4.jpg",
    "https://swiperjs.com/demos/images/nature-5.jpg",
    "https://swiperjs.com/demos/images/nature-6.jpg",
    "https://swiperjs.com/demos/images/nature-7.jpg",
];

const SliderProductImages = ({ imageGallery = init }) => {
    const imgThumbs = useRef([]);
    const [selectedImg, setSelectedImg] = useState(null);

    useEffect(() => {
        setSelectedImg(imageGallery[0]);
        if (imgThumbs.current.length) imgThumbs.current[0].scrollIntoView();
    }, [imageGallery]);

    return (
        <div className="flex h-full w-full gap-4">
            <div className="flex basis-[15%] flex-col gap-2 overflow-y-auto transition-all duration-1000 [&::-webkit-scrollbar]:hidden">
                {imageGallery.map((img_url, index) => {
                    return (
                        <img
                            key={index}
                            src={img_url}
                            className={`cursor-pointer object-contain transition-opacity hover:opacity-50 ${selectedImg == img_url && "opacity-50"}`}
                            onClick={() => {
                                setSelectedImg(img_url);
                                imgThumbs.current[index].scrollIntoView({
                                    behavior: "smooth",
                                    block: "end",
                                    inline: "nearest",
                                });
                            }}
                        ></img>
                    );
                })}
            </div>
            <div className="relative flex-1">
                <div className="absolute left-[3%] top-[3%] z-10 [&_span]:px-3 [&_span]:py-1 [&_span]:text-xs [&_span]:uppercase [&_span]:text-white">
                    <span className="bg-[#d10202] mr-1">Hot</span>
                    <span className="bg-black mr-1">Sale</span>
                    <span className="bg-[#919191]">Sold out</span>
                </div>
                <div className="flex gap-1 overflow-hidden">
                    {imageGallery.map((img_url, index) => {
                        return (
                            <img
                                ref={(el) => (imgThumbs.current[index] = el)}
                                key={index}
                                src={img_url}
                                alt=""
                                className="h-full w-full cursor-zoom-in object-cover transition-transform duration-500"
                                onMouseMove={(e) => {
                                    const rect = e.target.parentElement.getBoundingClientRect();
                                    const x = e.clientX - rect.left;
                                    const y = e.clientY - rect.top;
                                    e.target.style.transformOrigin = `${(x * 100) / rect.width}% ${(y * 100) / rect.height}%`;
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = "scale(2)";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = "scale(1)";
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

SliderProductImages.propTypes = {
    imageGallery: PropTypes.array,
};

export default SliderProductImages;
