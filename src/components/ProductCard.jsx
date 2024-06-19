import { Link, useNavigate } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import PropType from 'prop-types';
import { numberWithCommas } from '../utils/format';
import { useProductQuickViewStore } from '../store/productQuickViewStore';
import toast from 'react-hot-toast';
import apiRequest from '../utils/apiRequest';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

const ProductCard = ({ product = {}, isDisplayGrid = true, to = '' }) => {
    const { setProduct, toggleOpen } = useProductQuickViewStore();
    const navigate = useNavigate();
    const { setCart } = useCartStore();
    const { token } = useAuthStore();

    const handleAddToCart = (productId, colorId, quantity) => {
        toast.promise(
            apiRequest.post(
                '/cart',
                {
                    product: productId,
                    color: colorId,
                    quantity,
                },
                { headers: { Authorization: 'Bearer ' + token }, withCredentials: true },
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
    return (
        <>
            <div className={`group/product w-full ${!isDisplayGrid && 'flex items-center gap-[50px]'}`}>
                <Link
                    to={to}
                    className={`group/product-img relative w-full shrink-0 overflow-hidden ${!isDisplayGrid && 'basis-[40%]'}`}
                >
                    <img
                        src={product?.colors?.length && product?.colors[0]?.images[0]}
                        alt=""
                        className="h-[350px] w-full object-contain transition-all duration-500 group-hover/product-img:opacity-0"
                    />
                    <img
                        src={product?.colors?.length && product?.colors[0]?.images[1]}
                        alt=""
                        className="absolute left-0 top-0 -z-10 h-[350px] w-full object-contain"
                    />
                    <div className="absolute left-0 top-0 z-10 h-full w-full p-4">
                        <span className="mr-1 bg-[#D10202] px-3 py-[2px] text-xs uppercase text-white">Hot</span>
                        {product?.discount > 0 && (
                            <span className="mr-1 bg-[#000] px-3 py-[2px] text-xs uppercase text-white">Sale</span>
                        )}
                        {!product?.isValid && (
                            <span className="bg-[#919191] px-3 py-[2px] text-xs uppercase text-white">Sold out</span>
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
                                        <label htmlFor={'product-quick-view-' + product?.id}></label>
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
                                        onClick={(e) => e.preventDefault()}
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
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <i className="fa-sharp fa-light fa-heart"></i>
                                    </div>
                                </Tippy>
                            </div>
                            {product?.colors?.length >= 2 && product?.isValid && (
                                <span
                                    onClick={() => {
                                        navigate(to);
                                    }}
                                    className={`w-full translate-y-3 bg-black py-3 text-center text-sm font-semibold uppercase text-white opacity-0 transition-all ease-out hover:bg-[#D10202] hover:text-white group-hover/product:translate-y-0 group-hover/product:opacity-100 ${!isDisplayGrid && 'hidden'}`}
                                >
                                    Select options
                                </span>
                            )}
                            {product?.colors?.length == 1 && product?.isValid && (
                                <div
                                    className={`w-full translate-y-3 bg-black py-3 text-center text-sm font-semibold uppercase text-white opacity-0 transition-all ease-out hover:bg-[#D10202] hover:text-white group-hover/product:translate-y-0 group-hover/product:opacity-100 ${!isDisplayGrid && 'hidden'}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleAddToCart(product?._id, product?.colors[0]?._id, 1);
                                    }}
                                >
                                    Add to cart
                                </div>
                            )}
                            {!product?.isValid && (
                                <span
                                    onClick={() => {
                                        navigate(to);
                                    }}
                                    className={`w-full translate-y-3 bg-black py-3 text-center text-sm font-semibold uppercase text-white opacity-0 transition-all ease-out hover:bg-[#D10202] hover:text-white group-hover/product:translate-y-0 group-hover/product:opacity-100 ${!isDisplayGrid && 'hidden'}`}
                                >
                                    Read more
                                </span>
                            )}
                        </div>
                        <div
                            className={`absolute bottom-0 right-4 flex size-10 items-center justify-center text-xl opacity-100 transition-all duration-500 group-hover/product:pointer-events-none group-hover/product:opacity-0 ${!isDisplayGrid && 'bottom-4'}`}
                        >
                            <i className="fa-sharp fa-light fa-heart "></i>
                        </div>
                    </div>
                </Link>
                <div className="mt-2">
                    {product?.discount > 0 && <span className="text-sm text-green-400">-{product?.discount}%</span>}
                    <Link
                        to={to}
                        className={`mb-3 line-clamp-2 cursor-pointer text-base tracking-wide transition-colors hover:text-[#D10202] ${!isDisplayGrid && '!text-xl font-normal tracking-wider'}`}
                    >
                        {product?.name}
                    </Link>
                    <div className={`flex items-center gap-4 text-base tracking-wide ${!isDisplayGrid && 'text-xl'}`}>
                        {product?.discount > 0 && (
                            <span className="font-semibold">
                                <span>$</span>
                                <span>{numberWithCommas(product?.salePrice)}</span>
                            </span>
                        )}
                        <span className={`${product?.discount > 0 ? 'text-[#959595] line-through' : 'font-semibold'}`}>
                            <span>$</span>
                            <span>{numberWithCommas(product?.price)}</span>
                        </span>
                    </div>
                    {!isDisplayGrid && (
                        <>
                            <p
                                className="mt-6 line-clamp-3 text-sm text-[#848484]"
                                dangerouslySetInnerHTML={{ __html: product?.description }}
                            ></p>
                            {product?.colors?.length >= 2 && product?.isValid && (
                                <button
                                    onClick={() => {
                                        navigate(to);
                                    }}
                                    className="mt-6 bg-black px-24 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#D10202]"
                                >
                                    Select options
                                </button>
                            )}
                            {product?.colors?.length == 1 && product?.isValid && (
                                <button
                                    className="mt-6 bg-black px-24 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#D10202]"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleAddToCart(product?._id, product?.colors[0]?._id, 1);
                                    }}
                                >
                                    Add to cart
                                </button>
                            )}
                            {!product?.isValid && (
                                <button
                                    onClick={() => {
                                        navigate(to);
                                    }}
                                    className="mt-6 bg-black px-24 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#D10202]"
                                >
                                    Read more
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

ProductCard.propTypes = {
    product: PropType.object,
    isDisplayGrid: PropType.bool,
    to: PropType.string,
};

export default ProductCard;
