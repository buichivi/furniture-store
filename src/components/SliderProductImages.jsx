import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Tippy from '@tippyjs/react';
import '@google/model-viewer';
import { useLocation } from 'react-router-dom';
import LightGallery from 'lightgallery/react';
import QRCode from 'react-qr-code';

// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

// import plugins if you need
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

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
    const [isOpenQRCode, setIsOpenQRCode] = useState(false);
    const viewInRoomBtn = useRef(null);
    const modelViewerRef = useRef(null);
    const location = useLocation();

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

    useEffect(() => {
        setIsView3DModel(false);
    }, [location, model3D]);

    return (
        <div className="size-full border-b">
            <div className="flex h-full w-full flex-col-reverse gap-2 lg:flex-row">
                <div
                    className="flex shrink-0 flex-row gap-0 overflow-x-auto overflow-y-hidden transition-all duration-1000 lg:flex-col lg:gap-2 lg:overflow-y-auto lg:overflow-x-hidden [&::-webkit-scrollbar]:hidden"
                    style={{
                        flexBasis: thumbWidth,
                    }}
                >
                    {model3D && (
                        <img
                            src={'https://placehold.co/600x600?text=3D'}
                            className={`mx-1 size-[25%] cursor-pointer object-contain transition-opacity hover:opacity-50 lg:mx-0 lg:size-auto`}
                            onClick={() => setIsView3DModel(true)}
                        />
                    )}
                    {imageGallery.map((img_url, index) => {
                        return (
                            <img
                                key={index}
                                src={img_url}
                                className={`mx-1 size-[25%] cursor-pointer object-contain transition-opacity hover:opacity-50 lg:mx-0 lg:size-auto ${selectedImg == img_url && 'border opacity-50'}`}
                                onClick={() => {
                                    setSelectedImg(img_url);
                                    setIsView3DModel(false);
                                    const wrapperWidth = imgThumbs.current.children[0].clientWidth;
                                    imgThumbs.current.style.left = -(index * wrapperWidth) + 'px';
                                }}
                            />
                        );
                    })}
                </div>
                <div className="relative h-full max-h-screen lg:flex-1">
                    <div className="absolute left-[3%] top-[3%] z-10 [&_span]:px-3 [&_span]:py-1 [&_span]:text-[10px] [&_span]:uppercase [&_span]:text-white lg:[&_span]:text-xs">
                        {isNew && <span className="mr-1 bg-[#d10202]">New</span>}
                        {discount > 0 && isValid && <span className="mr-1 bg-black">Sale</span>}
                        {!isValid && <span className="bg-[#919191]">Sold out</span>}
                    </div>
                    {viewFullScreen && (
                        <Tippy content="View full screen" animation="shift-toward">
                            <span
                                className="absolute right-[3%] top-[3%] z-10 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white text-lg transition-colors hover:bg-[#d10202] hover:text-white"
                                onClick={() => {
                                    Array.from(imgThumbs.current.children).forEach((child) => {
                                        if (child.dataset.src == selectedImg) child.click();
                                    });
                                }}
                            >
                                <i className="fa-regular fa-expand text-xl"></i>
                            </span>
                        </Tippy>
                    )}
                    {/* {model3D && (
                        <Tippy content="View 3D model" animation="shift-toward">
                            <button
                                className="absolute right-[15%] top-[3%] z-10 flex size-10 items-center justify-center gap-2 rounded-full text-sm hover:bg-[#d10202] hover:text-white"
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
                    )} */}
                    <div className="relative h-full w-full overflow-hidden">
                        {model3D && (
                            <Tippy content="View In Room" animation="shift-toward">
                                <button
                                    className="absolute bottom-[10%] left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-md border border-gray-300 bg-white p-2 shadow-md"
                                    onClick={() => {
                                        if (window.innerWidth <= 576) viewInRoomBtn.current.click();
                                        else setIsOpenQRCode(true);
                                    }}
                                >
                                    <ViewInARIcon className="size-6" />
                                    <span className="text-xs uppercase tracking-wider ">View in room</span>
                                </button>
                            </Tippy>
                        )}
                        <LightGallery
                            plugins={[lgZoom, lgThumbnail]}
                            mode="lg-slide"
                            speed={500}
                            galleryId={'nature'}
                            elementClassNames={`relative left-0 top-0 ${isView3DModel ? 'hidden' : 'flex'} h-full w-auto pb-4 transition-all duration-500 ease-[cubic-bezier(.795,-.035,0,1)]`}
                            onInit={({ instance }) => {
                                imgThumbs.current = instance.el;
                            }}
                        >
                            {imageGallery.length > 0 &&
                                imageGallery.map((img_url, index) => {
                                    return (
                                        <a
                                            href={img_url}
                                            key={img_url + '-' + index}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="gallery__item relative top-0 inline-block h-full w-full flex-auto shrink-0 overflow-hidden px-2"
                                        >
                                            <img
                                                src={img_url}
                                                className="size-full cursor-zoom-in object-contain object-center transition-transform duration-500 lg:object-cover"
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
                                        </a>
                                    );
                                })}
                        </LightGallery>
                        <div className={`${isView3DModel ? 'block' : 'hidden'}`}>
                            <model-viewer
                                ref={modelViewerRef}
                                src={model3D}
                                ar
                                shadow-intensity="1"
                                camera-controls
                                auto-rotate
                                touch-action="pan-y"
                                style={{ width: '100%', height: '100%', minHeight: '400px' }}
                            >
                                <button ref={viewInRoomBtn} slot="ar-button"></button>
                                <div
                                    slot="progress-bar"
                                    id="progress-bar"
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                >
                                    <LoadingIcon />
                                </div>
                            </model-viewer>
                        </div>
                    </div>
                </div>
            </div>
            <input
                type="checkbox"
                checked={isOpenQRCode}
                onChange={(e) => setIsOpenQRCode(e.currentTarget.checked)}
                className="hidden [&:checked+div>div:last-child]:scale-100 [&:checked+div]:pointer-events-auto [&:checked+div]:opacity-100"
            />
            <div className="pointer-events-none fixed left-0 top-0 z-50 flex size-full items-center justify-center opacity-0 transition-all">
                <div
                    className="absolute left-0 top-0 -z-[1] size-full bg-[#000000a6]"
                    onClick={() => setIsOpenQRCode(false)}
                ></div>
                <div className="flex size-auto max-w-[25%] scale-110 flex-col items-center justify-center bg-white p-5 text-center transition-all duration-500">
                    <h3 className="font-lora text-xl font-bold">How to View in Augmented Reality</h3>
                    <h4 className="mb-4 text-sm tracking-wider">
                        Scan this QR code with your phone to view the object in your space. The experience launches
                        directly from your browser - no app required!
                    </h4>
                    <QRCode size={500} value={window.location.href} className="size-52" viewBox={`0 0 256 256`} />
                    <p className="mt-4 text-xs tracking-widest opacity-90">
                        iOS 13+, iPadOS 13+ or Android with ARCore 1.9+ required
                    </p>
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
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
            <g stroke="black">
                <circle cx="12" cy="12" r="9.5" fill="none" strokeLinecap="round" strokeWidth="3">
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
