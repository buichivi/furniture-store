import { Link, useNavigate } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import PropType from 'prop-types';
import { numberWithCommas } from '../utils/format';
import { useProductQuickViewStore } from '../store/productQuickViewStore';
import toast from 'react-hot-toast';
import apiRequest from '../utils/apiRequest';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { useEffect, useRef, useState } from 'react';
import useDataStore from '../store/dataStore';
import { useCompareProductsStore } from '../store/compareProductsStore.js';
import Skeleton from 'react-loading-skeleton';

const ProductCard = ({ product = {}, isDisplayGrid = true }) => {
    const [isVisible, setIsVisible] = useState(false);
    const { setProduct, toggleOpen } = useProductQuickViewStore();
    const navigate = useNavigate();
    const { setCart } = useCartStore();
    const { token } = useAuthStore();
    const { setWishlist } = useDataStore();
    const [isFavor, setIsFavor] = useState(false);
    const productCardRef = useRef();
    const [selectedColor, setSelectedColor] = useState(product?.colors[0]);

    const {
        toggleOpen: toggleOpenCompare,
        setCompares,
        compareProducts,
    } = useCompareProductsStore();

    useEffect(() => {
        setIsFavor(product?.isInWishlist || false);
    }, [product?.isInWishlist]);

    const handleAddToCart = (productId, colorId, quantity) => {
        toast.promise(
            apiRequest.post(
                '/cart',
                {
                    product: productId,
                    color: colorId,
                    quantity,
                },
                {
                    headers: { Authorization: 'Bearer ' + token },
                    withCredentials: true,
                },
            ),
            {
                loading: 'Adding to cart...',
                success: (res) => {
                    setCart(res.data.cart);
                    return res.data.message;
                },
                error: (err) => err.response.data?.error,
            },
        );
    };

    const handleAddToWishlist = () => {
        toast.promise(
            apiRequest.post(
                '/wishlist',
                { product: product?._id },
                { headers: { Authorization: 'Bearer ' + token } },
            ),
            {
                loading: 'Adding...',
                success: (res) => {
                    setWishlist(res.data?.wishlist);
                    return res.data?.message;
                },
                error: (err) => err?.response?.data?.error,
            },
        );
    };
    const handleRemoveFromWishlist = () => {
        toast.promise(
            apiRequest.delete('/wishlist/' + product?._id, {
                headers: { Authorization: 'Bearer ' + token },
            }),
            {
                loading: 'Removing...',
                success: (res) => {
                    setWishlist(res.data?.wishlist);
                    return res.data?.message;
                },
                error: (err) => err?.response?.data?.error,
            },
        );
    };

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
        observer.observe(productCardRef.current);
        return () => {
            if (productCardRef.current) {
                observer.unobserve(productCardRef.current);
            }
        };
    }, []);

    return (
        <div
            className={`group/product h-fit w-full transition-all duration-500 ${!isDisplayGrid && 'flex items-center gap-[50px]'}`}
            ref={productCardRef}
        >
            {!isVisible ? (
                <div className="h-[400px]">
                    <Skeleton height={300} />
                    <p className="mt-4">
                        <Skeleton count={2} />
                    </p>
                </div>
            ) : (
                <>
                    <Link
                        to={`/product/${product?.slug}`}
                        className={`group/product-img relative w-full shrink-0 overflow-hidden ${!isDisplayGrid && 'basis-[40%]'}`}
                    >
                        <img
                            src={
                                product?.colors?.length &&
                                selectedColor &&
                                selectedColor?.images[0]
                            }
                            alt=""
                            className="h-[350px] w-full object-contain transition-all duration-500 group-hover/product-img:opacity-0"
                        />
                        <img
                            src={
                                product?.colors?.length &&
                                selectedColor &&
                                selectedColor?.images[1]
                            }
                            alt=""
                            className="absolute left-0 top-0 -z-10 h-[350px] w-full object-contain transition-all duration-500 group-hover/product-img:scale-105"
                        />
                        <div className="absolute left-0 top-0 z-10 h-full w-full p-4">
                            {product?.isNew && (
                                <span className="mr-1 bg-[#D10202] px-3 py-[2px] text-xs uppercase text-white">
                                    New
                                </span>
                            )}
                            {product?.discount > 0 && (
                                <span className="mr-1 bg-[#000] px-3 py-[2px] text-xs uppercase text-white">
                                    Sale
                                </span>
                            )}
                            {!product?.isValid && (
                                <span className="bg-[#919191] px-3 py-[2px] text-xs uppercase text-white">
                                    Sold out
                                </span>
                            )}
                        </div>
                        <div className="absolute right-0 top-0 z-10 h-full w-full">
                            <div className="absolute left-0 top-0 z-20 flex h-full w-full flex-col">
                                <div className="flex flex-1 flex-col items-end justify-end gap-4 p-4">
                                    <Tippy
                                        content="Quick view"
                                        placement="left"
                                        animation="shift-toward"
                                        className="!bg-[#D10202] px-3 !text-sm [&.tippy-box[data-placement^=left]>.tippy-arrow:before]:border-l-[#D10202]"
                                    >
                                        <div
                                            className="flex size-9 translate-y-3 cursor-pointer items-center justify-center rounded-full bg-white text-base opacity-0 transition-all delay-[50ms]  hover:bg-[#D10202] hover:text-white group-hover/product:translate-y-0 group-hover/product:opacity-100"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setProduct(product);
                                                toggleOpen(true);
                                            }}
                                        >
                                            <label
                                                htmlFor={
                                                    'product-quick-view-' +
                                                    product?.id
                                                }
                                            ></label>
                                            <i className="fa-light fa-magnifying-glass"></i>
                                        </div>
                                    </Tippy>
                                    <Tippy
                                        content="Compare"
                                        placement="left"
                                        animation="shift-toward"
                                        className="!bg-[#D10202] px-3 !text-sm [&.tippy-box[data-placement^=left]>.tippy-arrow:before]:border-l-[#D10202]"
                                        hideOnClick={false}
                                    >
                                        <div
                                            className="flex size-9 translate-y-3 cursor-pointer items-center justify-center rounded-full bg-white text-base opacity-0 transition-all delay-[100ms]  hover:bg-[#D10202] hover:text-white group-hover/product:translate-y-0 group-hover/product:opacity-100"
                                            onClick={(e) => {
                                                const existedProd =
                                                    compareProducts.find(
                                                        (prod) =>
                                                            prod?._id ==
                                                            product?._id,
                                                    );
                                                if (!existedProd) {
                                                    setCompares([
                                                        ...compareProducts,
                                                        product,
                                                    ]);
                                                }
                                                toggleOpenCompare(true);
                                                e.preventDefault();
                                            }}
                                        >
                                            <i className="fa-light fa-code-compare"></i>
                                        </div>
                                    </Tippy>
                                    <Tippy
                                        content="Wishlist"
                                        placement="left"
                                        animation="shift-toward"
                                        className="!bg-[#D10202] px-3 !text-sm [&.tippy-box[data-placement^=left]>.tippy-arrow:before]:border-l-[#D10202]"
                                        hideOnClick={false}
                                    >
                                        <div
                                            className="flex size-9 translate-y-3 cursor-pointer items-center justify-center rounded-full bg-white text-base opacity-0 transition-all delay-[150ms] hover:bg-[#D10202] hover:text-white group-hover/product:translate-y-0 group-hover/product:opacity-100"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (!isFavor)
                                                    handleAddToWishlist();
                                                else handleRemoveFromWishlist();
                                            }}
                                        >
                                            {!isFavor ? (
                                                <i className="fa-sharp fa-light fa-heart text-xl"></i>
                                            ) : (
                                                <i className="fa-solid fa-heart text-xl"></i>
                                            )}
                                        </div>
                                    </Tippy>
                                </div>
                                {product?.colors?.length >= 2 &&
                                    product?.isValid && (
                                        <span
                                            onClick={() => {
                                                navigate(
                                                    `/product/${product?.slug}`,
                                                );
                                            }}
                                            className={`flex w-full translate-y-3 items-center justify-center gap-2 bg-black py-3 text-center text-sm font-semibold uppercase text-white opacity-0 transition-all ease-out hover:bg-[#D10202] hover:text-white group-hover/product:translate-y-0 group-hover/product:opacity-100 ${!isDisplayGrid && 'hidden'}`}
                                        >
                                            <span>Select options</span>
                                        </span>
                                    )}
                                {product?.colors?.length == 1 &&
                                    product?.isValid && (
                                        <div
                                            className={`flex w-full translate-y-3 items-center justify-center gap-2 bg-black py-3 text-center text-sm font-semibold uppercase text-white opacity-0 transition-all ease-out hover:bg-[#D10202] hover:text-white group-hover/product:translate-y-0 group-hover/product:opacity-100 ${!isDisplayGrid && 'hidden'}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleAddToCart(
                                                    product?._id,
                                                    selectedColor?._id,
                                                    1,
                                                );
                                            }}
                                        >
                                            <span>Add to cart</span>
                                        </div>
                                    )}
                                {!product?.isValid && (
                                    <span
                                        onClick={() => {
                                            navigate(
                                                `/product/${product?.slug}`,
                                            );
                                        }}
                                        className={`flex w-full translate-y-3 items-center justify-center gap-2 bg-black py-3 text-center text-sm font-semibold uppercase text-white opacity-0 transition-all ease-out hover:bg-[#D10202] hover:text-white group-hover/product:translate-y-0 group-hover/product:opacity-100 ${!isDisplayGrid && 'hidden'}`}
                                    >
                                        <span>Read more</span>
                                    </span>
                                )}
                            </div>
                            <div
                                className={`absolute bottom-0 right-4 flex size-10 items-center justify-center text-xl opacity-100 transition-all duration-500 group-hover/product:pointer-events-none group-hover/product:opacity-0 ${!isDisplayGrid && 'bottom-4'}`}
                            >
                                {!isFavor ? (
                                    <i className="fa-sharp fa-light fa-heart"></i>
                                ) : (
                                    <i className="fa-solid fa-heart"></i>
                                )}
                            </div>
                        </div>
                    </Link>
                    <div className="mt-2">
                        <div className="flex items-center justify-between">
                            {product?.discount > 0 ? (
                                <span className="text-sm text-green-400">
                                    -{product?.discount}%
                                </span>
                            ) : (
                                <span></span>
                            )}
                            {product?.colors?.length > 1 ? (
                                <div className="flex items-center gap-[6px]">
                                    {product?.colors?.map((color, index) => {
                                        return (
                                            <span
                                                key={index}
                                                className={`relative inline-block size-5 shrink-0 rounded-full border ${selectedColor?._id == color?._id ? 'border-gray-700' : 'border-transparent'} p-1 transition-colors hover:border-gray-700`}
                                                onClick={() =>
                                                    setSelectedColor(color)
                                                }
                                            >
                                                <img
                                                    src={color?.thumb}
                                                    alt=""
                                                    className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full object-cover"
                                                />
                                            </span>
                                        );
                                    })}
                                </div>
                            ) : (
                                <span></span>
                            )}
                        </div>
                        <Link
                            to={`/product/${product?.slug}`}
                            className={`mb-3 line-clamp-2 cursor-pointer text-base tracking-wide transition-colors hover:text-[#D10202] ${!isDisplayGrid && '!text-xl font-normal tracking-wider'}`}
                        >
                            {product?.name}
                        </Link>
                        <div
                            className={`flex items-center gap-4 text-base tracking-wide ${!isDisplayGrid && 'text-xl'}`}
                        >
                            {product?.discount > 0 && (
                                <span className="font-semibold">
                                    <span>$</span>
                                    <span>
                                        {numberWithCommas(product?.salePrice)}
                                    </span>
                                </span>
                            )}
                            <span
                                className={`${product?.discount > 0 ? 'text-[#959595] line-through' : 'font-semibold'}`}
                            >
                                <span>$</span>
                                <span>{numberWithCommas(product?.price)}</span>
                            </span>
                        </div>
                        {!isDisplayGrid && (
                            <>
                                <p
                                    className="mt-6 line-clamp-3 text-sm text-[#848484]"
                                    dangerouslySetInnerHTML={{
                                        __html: product?.description,
                                    }}
                                ></p>
                                {product?.colors?.length >= 2 &&
                                    product?.isValid && (
                                        <button
                                            onClick={() => {
                                                navigate(
                                                    `/product/${product?.slug}`,
                                                );
                                            }}
                                            className="mt-6 bg-black px-24 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#D10202]"
                                        >
                                            Select options
                                        </button>
                                    )}
                                {product?.colors?.length == 1 &&
                                    product?.isValid && (
                                        <button
                                            className="mt-6 bg-black px-24 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#D10202]"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleAddToCart(
                                                    product?._id,
                                                    product?.colors[0]?._id,
                                                    1,
                                                );
                                            }}
                                        >
                                            Add to cart
                                        </button>
                                    )}
                                {!product?.isValid && (
                                    <button
                                        onClick={() => {
                                            navigate(
                                                `/product/${product?.slug}`,
                                            );
                                        }}
                                        className="mt-6 bg-black px-24 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#D10202]"
                                    >
                                        Read more
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

ProductCard.propTypes = {
    product: PropType.object,
    isDisplayGrid: PropType.bool,
    to: PropType.string,
};

export default ProductCard;
