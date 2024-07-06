import { Navigation } from '../components';
import { Link } from 'react-router-dom';
import { CheckIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import useDataStore from '../store/dataStore';
import toast from 'react-hot-toast';
import apiRequest from '../utils/apiRequest';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

const Wishlist = () => {
    const { wishlist, setWishlist } = useDataStore();
    const { token } = useAuthStore();
    const { setCart } = useCartStore();

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
    const handleRemoveFromWishlist = (productId) => {
        toast.promise(
            apiRequest.delete('/wishlist/' + productId, {
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

    return (
        <div className="mt-content-top border-t">
            <div className="relative">
                <img
                    src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                    className="absolute left-0 top-0 -z-10 size-full object-cover"
                />
                <Navigation paths={`/wishlist`} />
            </div>
            <div className="container mx-auto mt-10 px-5 py-5">
                {wishlist?.length == 0 ? (
                    <p className="block h-20 py-4 text-center">
                        No products added to the wishlist
                    </p>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="w-1/3 py-2 pl-2" align="left">
                                    Product name
                                </th>
                                <th align="left">Price</th>
                                <th align="left">Stock status</th>
                                <th align="left">Added date</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {wishlist?.map((item, index) => {
                                return (
                                    <tr
                                        key={index}
                                        className={`${index < wishlist.length - 1 && 'border-b'}`}
                                    >
                                        <td className="py-2">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    to={`/product/${item?.product?.slug}`}
                                                    className="inline-block w-1/3 shrink-0"
                                                >
                                                    <img
                                                        src={
                                                            item?.product
                                                                ?.productImage
                                                        }
                                                        alt=""
                                                    />
                                                </Link>
                                                <Link
                                                    to={`/product/${item?.product?.slug}`}
                                                    className="transition-colors hover:text-[#d10202]"
                                                >
                                                    {item?.product?.name}
                                                </Link>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="mr-3 text-gray-400 line-through">
                                                ${item?.product?.price}
                                            </span>
                                            <span className="font-semibold">
                                                ${item?.product?.salePrice}
                                            </span>
                                        </td>
                                        <td>
                                            {item?.product?.isValid ? (
                                                <div className="flex items-center gap-2 text-green-500">
                                                    <CheckIcon className="size-4" />
                                                    <span>In stock</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-red-500">
                                                    <XMarkIcon className="size-4" />
                                                    <span>Out of stock</span>
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <span className="text-sm">
                                                {item?.addedAt}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-between gap-4">
                                                {item?.product?.colors
                                                    ?.length == 1 &&
                                                    item?.product?.isValid && (
                                                        <button
                                                            className="w-2/3 bg-black py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#d10202]"
                                                            onClick={() =>
                                                                handleAddToCart(
                                                                    item
                                                                        ?.product
                                                                        ?._id,
                                                                    item
                                                                        ?.product
                                                                        ?.colors[0]
                                                                        ._id,
                                                                    1,
                                                                )
                                                            }
                                                        >
                                                            Add to cart
                                                        </button>
                                                    )}
                                                {item?.product?.colors
                                                    ?.length >= 2 &&
                                                    item?.product?.isValid && (
                                                        <Link
                                                            to={`/product/${item?.product?.slug}`}
                                                            className="inline-block w-2/3 bg-black py-3 text-center text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#d10202]"
                                                        >
                                                            Select options
                                                        </Link>
                                                    )}
                                                {!item?.product?.isValid && (
                                                    <Link
                                                        to={`/product/${item?.product?.slug}`}
                                                        className="inline-block w-2/3 bg-black py-3 text-center text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#d10202]"
                                                    >
                                                        Read more
                                                    </Link>
                                                )}
                                                <TrashIcon
                                                    className="size-5 cursor-pointer transition-colors hover:text-[#d10202]"
                                                    onClick={() =>
                                                        handleRemoveFromWishlist(
                                                            item?.product?._id,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
