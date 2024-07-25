import { Link, useNavigate } from 'react-router-dom';
import SliderProductImages from './SliderProductImages';
import ReviewStars from './ReviewStars';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { numberWithCommas } from '../utils/format';
import PropType from 'prop-types';
import { useProductQuickViewStore } from '../store/productQuickViewStore';
import toast from 'react-hot-toast';
import apiRequest from '../utils/apiRequest';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

const ProductQuickView = forwardRef(function ProductQuickView() {
    const [selectedColor, setSelectedColor] = useState();
    const [quantity, setQuantity] = useState(1);
    const { product, isOpen, toggleOpen } = useProductQuickViewStore();
    const { setCart } = useCartStore();
    const { token } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isOpen && product?.colors?.length > 1) setSelectedColor();
        if (!isOpen) setQuantity(1);
    }, [isOpen, product]);

    useEffect(() => {
        const closeQuickViewWithESC = (e) => {
            if (e.keyCode == 27) toggleOpen(false);
        };
        window.addEventListener('keydown', closeQuickViewWithESC);
        return () => {
            window.removeEventListener('keydown', closeQuickViewWithESC);
        };
    }, [toggleOpen]);

    useEffect(() => {
        if (product?.colors?.length >= 1) {
            for (const color of product.colors) {
                if (color?.stock > 0) {
                    setSelectedColor(color);
                    break;
                }
            }
        }
    }, [product]);

    const averageRating = useMemo(() => {
        const totalRating = product?.reviews?.reduce((acc, cur) => acc + cur?.rating, 0);
        const totalReview = product?.reviews?.length;
        return totalReview ? totalRating / totalReview : 0;
    }, [product]);

    const handleAddToCart = (productId, colorId, quantity, buyNow = false) => {
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
                    if (buyNow) {
                        navigate('/cart');
                        toggleOpen(false);
                    }
                    setCart(res.data.cart);
                    return res.data.message;
                },
                error: (err) => err.response.data?.error,
            },
        );
    };

    return (
        <>
            {/* Quick view */}
            <div
                className={`fixed left-0 top-0 z-[60] h-screen w-screen ${isOpen ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-110 opacity-0'} transition-all`}
            >
                <span
                    className="absolute left-0 top-0 block h-full w-full bg-[#000000ce]"
                    onClick={() => toggleOpen(false)}
                ></span>
                <div
                    className={`absolute left-1/2 top-1/2 flex h-[600px] min-w-[1000px] -translate-x-1/2 ${isOpen ? '-translate-y-1/2 opacity-100' : '-translate-y-10 opacity-0'} items-center gap-8 bg-white p-8  transition-all delay-300`}
                >
                    <span
                        className="absolute right-0 top-0 flex size-8 cursor-pointer items-center justify-center bg-black text-white"
                        onClick={() => toggleOpen(false)}
                    >
                        <i className="fa-light fa-xmark"></i>
                    </span>
                    <div className="h-full basis-[55%]">
                        <SliderProductImages
                            isValid={product?.isValid}
                            discount={product?.discount}
                            imageGallery={selectedColor?.images || product?.colors[0]?.images}
                            viewFullScreen={false}
                        />
                    </div>
                    <div className="absolute bottom-[5%] right-0 top-[10%] max-h-full w-[42%] overflow-y-auto pr-8 [scrollbar-width:thin]">
                        <h3 className="mb-8 text-3xl tracking-wider">{product?.name}</h3>
                        <div className="mb-7 flex items-center gap-12">
                            <div className="flex items-center gap-2">
                                <ReviewStars stars={averageRating} size="15px" />
                                <span>({product?.reviews?.length})</span>
                            </div>
                            <div className="text-base">
                                <span>Stock: </span>
                                {product?.isValid ? (
                                    <span className="text-green-400">{selectedColor?.stock} In Stock</span>
                                ) : (
                                    <span className="text-red-400">Out Of Stock</span>
                                )}
                            </div>
                        </div>
                        <div className="mb-7 flex items-center gap-4">
                            <span className="text-2xl tracking-wide">${numberWithCommas(product?.salePrice)}</span>
                            <span className="text-lg font-light tracking-wide text-[#959595] line-through">
                                ${numberWithCommas(product?.price)}
                            </span>
                            {product?.discount > 0 && (
                                <span className="text-lg text-green-500">(-{product?.discount}%)</span>
                            )}
                        </div>
                        <p
                            className="mb-7 line-clamp-3 text-base text-[#959595]"
                            dangerouslySetInnerHTML={{
                                __html: product?.description,
                            }}
                        ></p>
                        {product?.colors?.length > 1 && (
                            <div className={`mb-10 ${selectedColor && 'mb-8'}`}>
                                <div className="mb-5 flex items-center gap-2">
                                    <h3 className="text-lg font-semibold">COLOR:</h3>
                                    {selectedColor && (
                                        <span className="font-light capitalize">{selectedColor?.name}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {product?.colors.map((color, index) => (
                                        <div
                                            key={index}
                                            className={`relative size-10 cursor-pointer border border-[#c5c5c5] transition-all hover:border-black ${selectedColor?.name == color?.name && '!border-black'} ${!color?.stock && 'pointer-events-none opacity-40'}`}
                                            onClick={() => {
                                                setSelectedColor(color);
                                            }}
                                        >
                                            <img
                                                src={color?.thumb}
                                                alt={color?.name}
                                                className="absolute left-1/2 top-1/2 inline-block size-8 -translate-x-1/2 -translate-y-1/2 object-cover"
                                            ></img>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {product?.isValid && (
                            <div className="flex h-[50px] w-full items-center gap-4">
                                <div className="flex h-full flex-1 items-center bg-[#ededed]">
                                    <i
                                        className="fa-light fa-minus flex-1 shrink-0 cursor-pointer text-center text-sm"
                                        onClick={() => {
                                            setQuantity(quantity - 1 || 1);
                                        }}
                                    ></i>
                                    <input
                                        type="number"
                                        min={1}
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        onBlur={(e) =>
                                            setQuantity(Number(e.target.value) >= 1 ? Number(e.target.value) : 1)
                                        }
                                        className="w-5 flex-1 shrink-0 border-none bg-transparent px-4 text-center text-sm outline-none"
                                    />
                                    <i
                                        className="fa-light fa-plus flex-1 shrink-0 cursor-pointer text-center text-sm"
                                        onClick={() => {
                                            setQuantity(quantity + 1);
                                        }}
                                    ></i>
                                </div>
                                <div className="h-full flex-1 shrink-0">
                                    <button
                                        className={`h-full w-full bg-black text-sm font-semibold uppercase text-white transition-colors hover:bg-[#d10202] ${!selectedColor && 'pointer-events-none cursor-not-allowed opacity-50'} select-none`}
                                        onClick={() => handleAddToCart(product?._id, selectedColor?._id, quantity)}
                                    >
                                        Add to cart
                                    </button>
                                </div>
                            </div>
                        )}

                        {product?.isValid && (
                            <button
                                className={`mt-4 h-[50px] w-full border border-black bg-transparent text-sm font-semibold uppercase text-black transition-all hover:border-[#d10202] hover:text-[#d10202] ${!selectedColor && 'cursor-not-allowed opacity-40'}`}
                                onClick={() => {
                                    handleAddToCart(product?._id, selectedColor?._id, quantity, true);
                                }}
                            >
                                Buy now
                            </button>
                        )}
                        <div className="mt-9 flex flex-col gap-[10px] text-sm tracking-wide">
                            <p>
                                SKU: <span className="text-[#848484]">{product?.SKU}</span>
                            </p>
                            <p>
                                BRAND:
                                <Link
                                    to={`/brand/${product?.brand?.name}`}
                                    onClick={() => toggleOpen(false)}
                                    className="ml-1 text-[#848484] transition-colors hover:text-[#d10202]"
                                >
                                    {product?.brand?.name}
                                </Link>
                            </p>
                            <div className="flex gap-1">
                                TAGS:
                                <div className="flex items-center gap-1">
                                    {product?.tags?.map((tag, index) => (
                                        <div key={index}>
                                            <Link
                                                to={`/tag/${tag?.name}`}
                                                onClick={() => toggleOpen(false)}
                                                className="capitalize text-[#848484] transition-colors hover:text-[#d10202]"
                                            >
                                                {tag?.name}
                                            </Link>
                                            {index <= product?.tags?.length - 2 && <span>,</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

ProductQuickView.propTypes = {
    product: PropType.object,
};

export default ProductQuickView;
