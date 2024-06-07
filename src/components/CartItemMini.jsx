import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useDebounced from '../utils/useDebounced';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import apiRequest from '../utils/apiRequest';
import useCartStore from '../store/cartStore';
import { numberWithCommas } from '../utils/format';
import { TrashIcon } from '@heroicons/react/24/outline';

const CartItemMini = ({ item = {} }) => {
    const [quantity, setQuantity] = useState(item?.quantity);
    const { setCart } = useCartStore();
    const qty = useDebounced(quantity, 500);

    useEffect(() => {
        if (qty != item?.quantity) {
            toast.promise(
                apiRequest.patch(
                    '/cart',
                    {
                        product: item?.product?._id,
                        color: item?.color?._id,
                        quantity: qty,
                    },
                    { withCredentials: true },
                ),
                {
                    loading: 'Update quantity...',
                    success: (res) => {
                        setCart(res.data.cart);
                        return res.data.message;
                    },
                    error: (err) => err?.response?.data?.error,
                },
            );
        }
    }, [qty]);

    useEffect(() => {
        setQuantity(item?.quantity);
    }, [item]);

    const handleDeleteCartItem = (id) => {
        toast.promise(
            apiRequest.delete('/cart/' + id, {
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

    return (
        <div className="flex h-auto w-full items-center justify-between gap-4">
            <Link to={`/shop/${item?.product?._id}`} className="inline-block shrink-0 basis-[35%]">
                <img src={item?.productImage} alt={item?.product?.name} className="w-full object-contain" />
            </Link>
            <div className="flex-1">
                <Link className="mb-4 inline-block text-base tracking-wide transition-colors hover:text-[#d10202]">
                    {item?.product?.name}
                </Link>
                <div className="mb-2 w-full">
                    <div className="flex w-[50%] border bg-[#EDEDED] py-1 [&>*]:flex-1 [&>*]:text-center [&>*]:text-xs">
                        <span
                            className="cursor-pointer"
                            onClick={() => {
                                setQuantity(quantity - 1 || 0);
                            }}
                        >
                            <i className="fa-light fa-minus"></i>
                        </span>
                        <input
                            type="number"
                            className="w-1/2 border-none bg-transparent outline-none"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                        <span className="cursor-pointer" onClick={() => setQuantity(quantity + 1)}>
                            <i className="fa-light fa-plus"></i>
                        </span>
                    </div>
                </div>
                <span>${numberWithCommas(item?.itemPrice)}</span>
            </div>
            <span
                className="cursor-pointer pr-2 text-xl transition-colors hover:text-[#d10202]"
                onClick={() => handleDeleteCartItem(item._id)}
            >
                {/* <i className="fa-light fa-trash-xmark"></i> */}
                <TrashIcon className="size-5" />
            </span>
        </div>
    );
};

CartItemMini.propTypes = {
    item: PropTypes.object,
};

export default CartItemMini;
