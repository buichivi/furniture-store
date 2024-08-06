import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import useCartStore from '../store/cartStore';
import PropTypes from 'prop-types';
import apiRequest from '../utils/apiRequest';
import toast from 'react-hot-toast';
import useDebounced from '../utils/useDebounced';
import useDataStore from '../store/dataStore';
import { numberWithCommas } from '../utils/format';
import StepProgress from '../components/StepProgress';
import useAuthStore from '../store/authStore';

const Cart = () => {
    const { cart, setCart } = useCartStore();
    const { promoCode, setPromoCode } = useDataStore();
    const { token } = useAuthStore();
    const [code, setCode] = useState();

    const handleDeleteCartItem = (id) => {
        toast.promise(
            apiRequest.delete('/cart/' + id, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            }),
            {
                loading: 'Deleting...',
                success: (res) => {
                    setCart(res.data.cart);
                    return res.data.message;
                },
                error: (err) => err?.response?.data?.error,
            },
        );
    };

    const handleApplyPromoCode = () => {
        toast.promise(apiRequest.get('/promo-code/' + code), {
            loading: 'Checking...',
            success: (res) => {
                setPromoCode(res.data.promoCode);
                return res.data.message;
            },
            error: (err) => err.response.data.error,
        });
    };
    const handleEmptyCart = () => {
        if (confirm('Are you sure you want to clear your cart?')) {
            toast.promise(
                apiRequest.delete('/cart/clear', {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                {
                    loading: 'Clearing...',
                    success: (res) => {
                        setCart({ ...cart, items: [] });
                        return res.data.message;
                    },
                    error: (err) => err.response.data.error,
                },
            );
        }
    };

    const discount = useMemo(() => {
        if (!promoCode?.type) {
            return 0;
        }
        return promoCode?.type == 'coupon'
            ? Math.floor((cart?.subTotal * promoCode?.discount) / 100)
            : promoCode?.discount;
    }, [promoCode, cart]);

    const total = useMemo(() => {
        return (cart?.subTotal >= discount ? cart?.subTotal - discount : 0) + 10;
    }, [discount, cart]);

    return (
        <div className="my-16 lg:my-content-top lg:border-t">
            <div className="container mx-auto px-5">
                <Navigation isShowPageName={false} paths="/cart" />
                <StepProgress />
                {cart?.items?.length > 0 ? (
                    <div className="flex flex-col items-start gap-10 lg:flex-row">
                        <div className="w-full flex-1">
                            <table className="hidden w-full lg:table">
                                <thead>
                                    <tr>
                                        <th align="left" className="mr-8 w-2/5 border-b pb-5">
                                            Product
                                        </th>
                                        <th align="left" className="mr-8 border-b pb-5">
                                            Price
                                        </th>
                                        <th align="left" className="mr-8 border-b pb-5">
                                            Quantity
                                        </th>
                                        <th align="left" className="mr-8 border-b pb-5">
                                            Subtotal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart?.items?.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className="w-2/5 border-b py-5">
                                                    <div className="flex w-full items-center gap-4">
                                                        <Link
                                                            to={`/product/${item?.product?.slug}`}
                                                            className="w-28 shrink-0"
                                                        >
                                                            <img
                                                                src={item?.productImage}
                                                                className="h-auto w-full object-contain"
                                                            />
                                                        </Link>
                                                        <Link
                                                            to={`/product/${item?.product?.slug}`}
                                                            className="flex-1 text-wrap text-base transition-colors hover:text-[#D10202]"
                                                        >
                                                            {item?.product?.name}
                                                        </Link>
                                                    </div>
                                                </td>
                                                <td className="border-b">
                                                    <span className="text-base font-bold tracking-wide">
                                                        ${numberWithCommas(item?.product?.salePrice)}
                                                    </span>
                                                </td>
                                                <td className="border-b">
                                                    <CartItemQuantity
                                                        productId={item?.product?._id}
                                                        colorId={item?.color?._id}
                                                        quantity={item?.quantity}
                                                    />
                                                </td>
                                                <td className="border-b">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-base font-bold tracking-wide">
                                                            ${numberWithCommas(item?.itemPrice)}
                                                        </span>
                                                        <TrashIcon
                                                            className="size-5 cursor-pointer transition-colors hover:text-[#D10202]"
                                                            onClick={() => handleDeleteCartItem(item?._id)}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <ul className="w-full lg:hidden">
                                {cart?.items?.map((item, index) => {
                                    return (
                                        <li key={index} className="w-full border p-5 [&:not(:first-child)]:mt-2">
                                            <div className="relative flex items-center gap-4">
                                                <Link
                                                    to={`/product/${item?.product?.slug}`}
                                                    className="inline-block w-[100px] shrink-0"
                                                >
                                                    <img
                                                        src={item?.productImage}
                                                        alt=""
                                                        className="w-full object-contain"
                                                    />
                                                </Link>
                                                <div className="flex w-full flex-col gap-2">
                                                    <Link
                                                        to={`/product/${item?.product?.slug}`}
                                                        className="hover:text-[#d10202]"
                                                    >
                                                        {item?.product?.name}
                                                    </Link>
                                                    <span className="text-sm opacity-90">
                                                        Color: {item?.color?.name}
                                                    </span>
                                                    <TrashIcon
                                                        className="absolute right-0 top-0 size-5 cursor-pointer transition-colors hover:text-[#D10202]"
                                                        onClick={() => handleDeleteCartItem(item?._id)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between border-b border-dashed py-3 text-sm tracking-wide">
                                                <span className="text-sm text-gray-400">Price:</span>
                                                <span className="font-bold">
                                                    ${numberWithCommas(item?.itemPrice / item?.quantity)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between border-b border-dashed py-3 text-sm tracking-wide">
                                                <span className="text-sm text-gray-400">Quantity:</span>
                                                <CartItemQuantity
                                                    productId={item?.product?._id}
                                                    colorId={item?.color?._id}
                                                    quantity={item?.quantity}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between pt-3 text-sm tracking-wide">
                                                <span className="text-sm text-gray-400">Subtotal:</span>
                                                <span className="font-bold">${numberWithCommas(item?.itemPrice)}</span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="mt-4 flex flex-col items-center justify-between gap-4 lg:flex-row">
                                <Link to="/" className="hidden items-center gap-2 lg:flex">
                                    <ArrowLeftIcon className="size-4" />
                                    <span>Back to shop</span>
                                </Link>
                                <button
                                    className="float-right w-full border border-black bg-white px-4 py-2 text-black outline-none transition-colors hover:bg-black hover:text-white lg:w-fit"
                                    onClick={() => handleEmptyCart()}
                                >
                                    Empty cart
                                </button>
                            </div>
                        </div>
                        <div className="w-full bg-gray-100 p-6 lg:w-1/3">
                            <div>
                                <h4 className="mb-2 text-sm uppercase tracking-wider">Enter promo code</h4>
                                <div className="flex h-14 w-full items-center py-2 text-sm lg:text-base">
                                    <input
                                        type="text"
                                        className="h-full flex-1 border pl-3 uppercase outline-none"
                                        placeholder="Promo code"
                                        value={code}
                                        onChange={(e) => setCode(e.currentTarget.value)}
                                    />
                                    <button
                                        className="h-full basis-1/3 border border-black bg-black text-white"
                                        onClick={() => handleApplyPromoCode()}
                                    >
                                        Apply
                                    </button>
                                </div>
                                <div className="w-full pt-8">
                                    <div className="flex w-full items-center justify-between py-1 text-sm tracking-wide lg:text-base">
                                        <span>Subtotal: </span>
                                        <span className="font-bold">${cart?.subTotal}</span>
                                    </div>
                                    <div className="flex w-full items-center justify-between py-1 text-sm tracking-wide lg:text-base">
                                        <span>Discount: </span>
                                        <span>
                                            - ${discount}
                                            {promoCode?.type == 'coupon' && (
                                                <span className="text-green-400">({promoCode?.discount}%)</span>
                                            )}
                                        </span>
                                    </div>
                                    {promoCode?.code && (
                                        <span
                                            className="float-right cursor-pointer text-sm transition-all hover:text-red-400 hover:underline"
                                            onClick={() => setPromoCode({})}
                                        >
                                            Remove
                                        </span>
                                    )}
                                    <div className="flex w-full items-center justify-between py-1 text-sm tracking-wide lg:text-base">
                                        <span>Shipping cost: </span>
                                        <span>$10</span>
                                    </div>

                                    <div className="flex w-full items-center justify-between py-1 text-lg font-bold tracking-wide">
                                        <span>Estimated total: </span>
                                        <span>${numberWithCommas(total)}</span>
                                    </div>
                                </div>
                                <Link
                                    to="/checkout"
                                    className="mt-10 block w-full bg-black py-4 text-center text-xs font-bold uppercase tracking-wider text-white lg:text-sm"
                                >
                                    Check out
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h3 className="mb-6 text-center text-sm lg:text-base">Your cart is currently empty</h3>
                        <Link
                            to="/"
                            className="mx-auto flex w-fit items-center justify-center gap-2 border border-black  bg-white px-3 py-2 text-black transition-colors hover:bg-black hover:text-white"
                        >
                            <ArrowLeftIcon className="size-5" />
                            <span className="text-xs font-bold uppercase lg:text-sm">Return to shop</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

const CartItemQuantity = ({ productId, colorId, quantity }) => {
    const [qty, setQty] = useState(quantity || 1);
    const _qty = useDebounced(qty, 500);
    const { setCart } = useCartStore();
    const { token } = useAuthStore();

    useEffect(() => {
        if (_qty != quantity) {
            toast.promise(
                apiRequest.patch(
                    '/cart',
                    {
                        product: productId,
                        color: colorId,
                        quantity: _qty >= 0 ? _qty : 0,
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                    },
                ),
                {
                    loading: 'Update quantity...',
                    success: (res) => {
                        setCart(res.data.cart);
                        return res.data.message;
                    },
                    error: (err) => {
                        if (err?.response?.data?.cart) {
                            setCart(err?.response?.data?.cart);
                        }
                        return err?.response?.data?.error;
                    },
                },
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_qty]);

    return (
        <div className="flex w-[50%] max-w-20 border bg-[#EDEDED] py-1 [&>*]:flex-1 [&>*]:text-center [&>*]:text-xs">
            <span
                className="cursor-pointer"
                onClick={() => {
                    setQty(qty - 1 || 0);
                }}
            >
                <i className="fa-light fa-minus"></i>
            </span>
            <input
                type="number"
                className="w-1/2 border-none bg-transparent outline-none"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value) || 0)}
            />
            <span className="cursor-pointer" onClick={() => setQty(qty + 1)}>
                <i className="fa-light fa-plus"></i>
            </span>
        </div>
    );
};
CartItemQuantity.propTypes = {
    productId: PropTypes.string,
    colorId: PropTypes.string,
    quantity: PropTypes.number,
};

export default Cart;
