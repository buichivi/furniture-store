import { useEffect, useRef, useState } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';

import PropTypes from 'prop-types';
const SliderProductImages = ({
    isValid = true,
    discount = 0,
    thumbWidth = '15%',
    imageGallery = [],
    viewFullScreen = true,
}) => {
    const imgThumbs = useRef();
    const galleryFullScreen = useRef();
    const [selectedImg, setSelectedImg] = useState(null);

    useEffect(() => {
        if (viewFullScreen) {
            let lightbox = new PhotoSwipeLightbox({
                gallery: '#galleryFullScreen',
                children: 'a',
                wheelToZoom: true,
                pswpModule: () => import('photoswipe'),
                initialZoomLevel: 'fit',
                secondaryZoomLevel: 2,
                maxZoomLevel: 1,
                showHideAnimationType: 'none',
                arrowPrevSVG: `<i class="fa-light fa-angle-left text-white text-2xl"></i>`,
                arrowNextSVG: `<i class="fa-light fa-angle-right text-white text-2xl"></i>`,
                closeSVG: `<i class="fa-light fa-xmark text-2xl text-white"></i>`,
                zoomSVG: `<i class="fa-light fa-magnifying-glass-plus text-xl text-white"></i>`,
                bgOpacity: 1,
            });
            lightbox.init();
            return () => {
                lightbox.destroy();
                lightbox = null;
            };
        }
    }, [viewFullScreen]);

    useEffect(() => {
        setSelectedImg(imageGallery[0]);
        if (imgThumbs.current.length) imgThumbs.current[0].scrollIntoView();
    }, [imageGallery]);

    return (
        <>
            <div className="flex h-full w-full gap-2">
                <div
                    className="flex shrink-0 flex-col gap-2 overflow-y-auto transition-all duration-1000 [&::-webkit-scrollbar]:hidden"
                    style={{
                        flexBasis: thumbWidth,
                    }}
                >
                    {imageGallery.map((img_url, index) => {
                        return (
                            <img
                                key={index}
                                src={img_url}
                                className={`cursor-pointer object-contain transition-opacity hover:opacity-50 ${selectedImg == img_url && 'opacity-50'}`}
                                onClick={() => {
                                    setSelectedImg(img_url);
                                    const wrapperWidth = imgThumbs.current.children[0].clientWidth;
                                    imgThumbs.current.style.left = -(index * wrapperWidth) + 'px';
                                }}
                            ></img>
                        );
                    })}
                </div>
                <div className="relative h-full flex-1">
                    <div className="absolute left-[3%] top-[3%] z-10 [&_span]:px-3 [&_span]:py-1 [&_span]:text-xs [&_span]:uppercase [&_span]:text-white">
                        <span className="mr-1 bg-[#d10202]">Hot</span>
                        {discount && <span className="mr-1 bg-black">Sale</span>}
                        {!isValid && <span className="bg-[#919191]">Sold out</span>}
                    </div>
                    {viewFullScreen && (
                        <span
                            className="absolute right-[3%] top-[3%] z-10 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white text-lg transition-colors hover:bg-[#d10202] hover:text-white"
                            onClick={() => {
                                const index = (selectedImg && imageGallery.indexOf(selectedImg)) || 0;
                                galleryFullScreen.current.children[index].click();
                            }}
                        >
                            <i className="fa-light fa-magnifying-glass"></i>
                        </span>
                    )}
                    <div className="relative h-full w-full overflow-hidden">
                        <div
                            className="relative left-0 top-0 flex h-full w-auto transition-all duration-500 ease-[cubic-bezier(.795,-.035,0,1)]"
                            ref={imgThumbs}
                        >
                            {imageGallery.map((img_url, index) => {
                                return (
                                    <img
                                        key={index}
                                        src={img_url}
                                        alt=""
                                        className="relative top-0 h-full w-full flex-auto shrink-0 cursor-zoom-in object-contain object-top transition-transform duration-500"
                                        onMouseMove={(e) => {
                                            const rect = e.target.getBoundingClientRect();
                                            const x = e.clientX - rect.left;
                                            const y = e.clientY - rect.top;
                                            e.target.style.transformOrigin = `${(x * 100) / rect.width}% ${(y * 100) / rect.height}%`;
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'scale(2)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'scale(1)';
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            {viewFullScreen && (
                <div className="pswp-gallery fixed" id="galleryFullScreen" ref={galleryFullScreen}>
                    {imageGallery.map((image, index) => (
                        <a
                            href={image}
                            data-pswp-width="450"
                            data-pswp-height="550"
                            key={'galleryFullScreen' + '-' + index}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img src={image} alt="" className="size-full object-cover py-4" />
                        </a>
                    ))}
                </div>
            )}
        </>
    );
};

SliderProductImages.propTypes = {
    imageGallery: PropTypes.array,
    thumbWidth: PropTypes.string,
    viewFullScreen: PropTypes.bool,
    isValid: PropTypes.bool,
    discount: PropTypes.number,
};

export default SliderProductImages;
