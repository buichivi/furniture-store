import React, { useEffect, useRef, useState } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import PropTypes from 'prop-types';
import Tippy from '@tippyjs/react';
import '@google/model-viewer';

const SliderProductImages = ({
    isNew = false,
    isValid = true,
    discount = 0,
    thumbWidth = '15%',
    imageGallery = [],
    viewFullScreen = true,
    model3D = '',
}) => {
    const imgThumbs = useRef();
    const [selectedImg, setSelectedImg] = useState(null);
    const [isView3DModel, setIsView3DModel] = useState(false);
    const modelViewerRef = useRef(null);

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
                showHideAnimationType: 'fade',
                arrowPrevSVG: `<i class="fa-light fa-angle-left text-white text-xl"></i>`,
                arrowNextSVG: `<i class="fa-light fa-angle-right text-white text-xl"></i>`,
                closeSVG: `<i class="fa-light fa-xmark text-xl text-white"></i>`,
                zoomSVG: `<i class="fa-light fa-magnifying-glass-plus text-lg text-white"></i>`,
                bgOpacity: 0.9,
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
        if (imgThumbs.current?.length) imgThumbs.current[0]?.scrollIntoView();
    }, [imageGallery]);

    useEffect(() => {
        const modelViewer = document.querySelector('model-viewer');
        const onProgress = (e) => {
            const progressBar = modelViewer.querySelector('#progress-bar');
            if (e.detail.totalProgress == 1) {
                progressBar.classList.add('hidden');
            } else progressBar.classList.remove('hidden');
        };
        if (modelViewer) {
            modelViewer.addEventListener('progress', onProgress);
        }
        return () => {
            if (modelViewer) {
                modelViewer.removeEventListener('progress', onProgress);
            }
        };
    }, [isView3DModel]);

    return (
        <div className="size-full border-b">
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
                                className={`cursor-pointer object-contain transition-opacity hover:opacity-50 ${selectedImg == img_url && 'border opacity-50'}`}
                                onClick={() => {
                                    setSelectedImg(img_url);
                                    setIsView3DModel(false);
                                    const wrapperWidth =
                                        imgThumbs.current.children[0]
                                            .clientWidth;
                                    imgThumbs.current.style.left =
                                        -(index * wrapperWidth) + 'px';
                                }}
                            />
                        );
                    })}
                </div>
                <div className="relative h-full flex-1">
                    <div className="absolute left-[3%] top-[3%] z-10 [&_span]:px-3 [&_span]:py-1 [&_span]:text-xs [&_span]:uppercase [&_span]:text-white">
                        {isNew && (
                            <span className="mr-1 bg-[#d10202]">New</span>
                        )}
                        {discount && isValid && (
                            <span className="mr-1 bg-black">Sale</span>
                        )}
                        {!isValid && (
                            <span className="bg-[#919191]">Sold out</span>
                        )}
                    </div>
                    {viewFullScreen && (
                        <Tippy
                            content="View full screen"
                            animation="shift-toward"
                        >
                            <span
                                className="absolute right-[3%] top-[3%] z-10 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white text-lg transition-colors hover:bg-[#d10202] hover:text-white"
                                onClick={() => {
                                    imgThumbs.current.children[0].click();
                                }}
                            >
                                <i className="fa-regular fa-expand text-xl"></i>
                            </span>
                        </Tippy>
                    )}
                    {model3D && (
                        <Tippy content="View 3D model" animation="shift-toward">
                            <button
                                className="absolute right-[12%] top-[3%] z-10 flex size-10 items-center justify-center gap-2 rounded-full text-sm hover:bg-[#d10202] hover:text-white"
                                onClick={() => setIsView3DModel(!isView3DModel)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    className="size-8"
                                    fill="currentColor"
                                >
                                    <path
                                        fill="currentColor"
                                        d="m11.192 19.129l-4.884-2.837q-.38-.217-.594-.593t-.214-.805V9.221q0-.429.214-.805t.594-.593l4.884-2.836q.38-.218.808-.218t.808.218l4.884 2.836q.38.217.594.593t.214.805v5.673q0 .43-.214.805t-.594.593l-4.884 2.837q-.38.217-.808.217t-.808-.217M3 7V4.615q0-.67.472-1.143Q3.944 3 4.615 3H7v1H4.615q-.269 0-.442.173T4 4.615V7zm4 14H4.615q-.67 0-1.143-.472Q3 20.056 3 19.385V17h1v2.385q0 .269.173.442t.442.173H7zm10 0v-1h2.385q.269 0 .442-.173t.173-.442V17h1v2.385q0 .67-.472 1.143q-.472.472-1.143.472zm3-14V4.615q0-.269-.173-.442T19.385 4H17V3h2.385q.67 0 1.143.472q.472.472.472 1.143V7zM7.012 8.583l-.512.292v.606l5 2.844v5.83l.5.287l.5-.286v-5.831l5-2.844v-.606l-.512-.292L12 11.465z"
                                    ></path>
                                </svg>
                            </button>
                        </Tippy>
                    )}
                    <div className="relative h-full w-full overflow-hidden">
                        {!isView3DModel ? (
                            <div
                                id="galleryFullScreen"
                                className="relative left-0 top-0 flex h-full w-auto transition-all duration-500 ease-[cubic-bezier(.795,-.035,0,1)]"
                                ref={imgThumbs}
                            >
                                {imageGallery.map((img_url, index) => {
                                    return (
                                        <a
                                            href={img_url}
                                            key={img_url + '-' + index}
                                            data-pswp-width="500"
                                            data-pswp-height="600"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="relative top-0 inline-block h-full w-full flex-auto shrink-0 px-2"
                                        >
                                            <img
                                                src={img_url}
                                                className="size-full cursor-zoom-in object-scale-down object-center transition-transform duration-500"
                                                onMouseMove={(e) => {
                                                    const rect =
                                                        e.target.getBoundingClientRect();
                                                    const x =
                                                        e.clientX - rect.left;
                                                    const y =
                                                        e.clientY - rect.top;
                                                    e.target.style.transformOrigin = `${(x * 100) / rect.width}% ${(y * 100) / rect.height}%`;
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.transform =
                                                        'scale(2)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.transform =
                                                        'scale(1)';
                                                }}
                                            />
                                        </a>
                                    );
                                })}
                            </div>
                        ) : (
                            <React.Fragment>
                                <model-viewer
                                    ref={modelViewerRef}
                                    src={model3D}
                                    ar
                                    shadow-intensity="1"
                                    camera-controls
                                    auto-rotate
                                    touch-action="pan-y"
                                    style={{ width: '100%', height: '100%' }}
                                >
                                    <Tippy
                                        content="View In Room"
                                        animation="shift-toward"
                                    >
                                        <button
                                            slot="ar-button"
                                            className="absolute bottom-[10%] left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-md border border-gray-300 bg-white p-2 shadow-md"
                                        >
                                            <ViewInARIcon className="size-6" />
                                            <span className="text-xs uppercase tracking-wider ">
                                                View in room
                                            </span>
                                        </button>
                                    </Tippy>
                                    <div
                                        slot="progress-bar"
                                        id="progress-bar"
                                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                    >
                                        <LoadingIcon />
                                    </div>
                                </model-viewer>
                            </React.Fragment>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ViewInARIcon = ({ className }) => {
    return (
        <svg
            width="54"
            height="54"
            viewBox="0 0 54 54"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M20.4401 21.4485L27.2628 25.0394L34.0856 21.4485"
                stroke="black"
                strokeWidth="1.64778"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M6.1539 13.9292L14.2427 18.1865"
                stroke="black"
                strokeWidth="1.64778"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M48.3713 13.9292L40.2824 18.1865"
                stroke="black"
                strokeWidth="1.64778"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M27.2626 2.66093V12.2473"
                stroke="black"
                strokeWidth="1.64778"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M27.2626 25.0796V33.2978"
                stroke="black"
                strokeWidth="1.64778"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M27.2626 41.9386V51.347"
                stroke="black"
                strokeWidth="1.64778"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M6.1539 31.5853V40.4483L14.0803 44.6201"
                stroke="black"
                strokeWidth="1.64778"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M14.243 36.1597L6.15414 40.417"
                stroke="black"
                strokeWidth="1.64778"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M40.2822 36.1597L48.371 40.417"
                stroke="black"
                strokeWidth="1.64778"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M14.0803 9.61237L6.1539 13.7842V23.1966"
                stroke="black"
                strokeWidth="1.64778"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M19.9362 6.53048L27.2627 2.67441L34.5893 6.53048"
                stroke="black"
                strokeWidth="1.64778"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M40.4445 9.61237L48.3709 13.7842V23.1966"
                stroke="black"
                strokeWidth="1.64778"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M48.3709 31.5853V40.4483L40.4445 44.6201"
                stroke="black"
                strokeWidth="1.64778"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M19.9362 47.4637L27.2627 51.3197L34.5893 47.4637"
                stroke="black"
                strokeWidth="1.64778"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

const LoadingIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
        >
            <g stroke="black">
                <circle
                    cx="12"
                    cy="12"
                    r="9.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeWidth="3"
                >
                    <animate
                        attributeName="stroke-dasharray"
                        calcMode="spline"
                        dur="1.5s"
                        keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                        keyTimes="0;0.475;0.95;1"
                        repeatCount="indefinite"
                        values="0 150;42 150;42 150;42 150"
                    />
                    <animate
                        attributeName="stroke-dashoffset"
                        calcMode="spline"
                        dur="1.5s"
                        keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                        keyTimes="0;0.475;0.95;1"
                        repeatCount="indefinite"
                        values="0;-16;-59;-59"
                    />
                </circle>
                <animateTransform
                    attributeName="transform"
                    dur="2s"
                    repeatCount="indefinite"
                    type="rotate"
                    values="0 12 12;360 12 12"
                />
            </g>
        </svg>
    );
};

SliderProductImages.propTypes = {
    isNew: PropTypes.bool,
    imageGallery: PropTypes.array,
    thumbWidth: PropTypes.string,
    viewFullScreen: PropTypes.bool,
    isValid: PropTypes.bool,
    discount: PropTypes.number,
    model3D: PropTypes.string,
};

ViewInARIcon.propTypes = {
    className: PropTypes.string,
};

export default SliderProductImages;
