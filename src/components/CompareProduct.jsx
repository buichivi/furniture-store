import { TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCompareProductsStore } from '../store/compareProductsStore';
import toast from 'react-hot-toast';
import apiRequest from '../utils/apiRequest';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';

const CompareProduct = () => {
    const { isOpen, toggleOpen, compareProducts, setCompares } = useCompareProductsStore();
    const { setCart } = useCartStore();
    const { token } = useAuthStore();
    const compareTableWrapper = useRef();

    useEffect(() => {
        compareTableWrapper.current.scrollTop = 0;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

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
        <React.Fragment>
            <input
                type="checkbox"
                id="compare-products"
                checked={isOpen}
                onChange={(e) => toggleOpen(e.currentTarget.checked)}
                className="hidden [&:checked+div>div]:scale-100 [&:checked+div>div]:opacity-100 [&:checked+div]:pointer-events-auto [&:checked+div]:opacity-100"
            />
            <div className="pointer-events-none fixed left-0 top-0 z-50 flex size-full items-center justify-center opacity-0 transition-all">
                <span
                    className="absolute left-0 top-0 -z-10 size-full bg-[#000000c7]"
                    onClick={() => {
                        toggleOpen(!isOpen);
                    }}
                ></span>
                <div className="container relative flex h-[90%] scale-110 flex-col items-center bg-white opacity-0 transition-all delay-100">
                    <span
                        className="absolute right-0 top-0 flex size-10 cursor-pointer items-center justify-center bg-black text-white"
                        onClick={() => {
                            toggleOpen(!isOpen);
                        }}
                    >
                        <XMarkIcon className="size-5" />
                    </span>
                    <h4 className="h-10 w-full border-b text-center text-sm font-bold uppercase leading-10 tracking-wider">
                        Compare products
                    </h4>
                    <div
                        ref={compareTableWrapper}
                        className="w-full flex-1 overflow-x-scroll overflow-y-scroll [scrollbar-width:thin]"
                    >
                        {compareProducts?.length > 0 ? (
                            <table className="min-w-full [&_td]:border [&_tr:first-child_td]:border-t-0">
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td></td>
                                        {compareProducts.map((product, index) => {
                                            return (
                                                <td
                                                    key={index}
                                                    className="h-[300px] w-[360px] min-w-[360px] px-3 py-4"
                                                    align="center"
                                                >
                                                    <div className="flex h-full flex-col items-center justify-between">
                                                        <span
                                                            className="inline-flex shrink-0 cursor-pointer transition-colors hover:text-[#d10202]"
                                                            onClick={() =>
                                                                setCompares(
                                                                    compareProducts.filter(
                                                                        (prod) => prod?._id != product?._id,
                                                                    ),
                                                                )
                                                            }
                                                        >
                                                            <TrashIcon className="size-5 opacity-70" />
                                                        </span>
                                                        <Link
                                                            to={`/product/${product?.slug}`}
                                                            className="inline-block min-h-[300px] w-[80%] flex-1 shrink-0 py-2"
                                                        >
                                                            <img
                                                                src={
                                                                    product?.colors?.length &&
                                                                    product?.colors[0]?.images[0]
                                                                }
                                                                alt={product?.name}
                                                                className="size-full object-contain"
                                                            />
                                                        </Link>
                                                        <div className="w-full shrink-0">
                                                            <Link
                                                                to={`/product/${product?.slug}`}
                                                                className="inline-block py-2 transition-colors hover:text-[#d10202]"
                                                            >
                                                                {product?.name}
                                                            </Link>
                                                            <div className="flex items-center justify-center gap-2 pb-2">
                                                                <span className="font-bold">${product?.salePrice}</span>
                                                                <span className="text-gray-400 line-through">
                                                                    ${product?.price}
                                                                </span>
                                                            </div>
                                                            {product?.colors?.length == 1 && product?.isValid && (
                                                                <button
                                                                    className="w-2/3 border border-black bg-black py-3 text-sm font-semibold uppercase text-white transition-colors hover:bg-white hover:text-black"
                                                                    onClick={() =>
                                                                        handleAddToCart(
                                                                            product?._id,
                                                                            product?.colors[0]?._id,
                                                                            1,
                                                                        )
                                                                    }
                                                                >
                                                                    Add to cart
                                                                </button>
                                                            )}
                                                            {product?.colors?.length > 1 && product?.isValid && (
                                                                <Link
                                                                    to={`/product/${product?.slug}`}
                                                                    className="inline-block w-2/3 border border-black bg-black py-3 text-sm font-semibold uppercase text-white transition-colors hover:bg-white hover:text-black"
                                                                >
                                                                    Select options
                                                                </Link>
                                                            )}
                                                            {!product?.isValid && (
                                                                <Link
                                                                    to={`/product/${product?.slug}`}
                                                                    className="inline-block w-2/3 border border-black bg-black py-3 text-sm font-semibold uppercase text-white transition-colors hover:bg-white hover:text-black"
                                                                >
                                                                    Read more
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    <tr>
                                        <td className="px-4 text-[15px] font-bold uppercase">Description</td>
                                        {compareProducts.map((product, index) => {
                                            return (
                                                <td key={index} className="px-3 py-3 text-center">
                                                    <div
                                                        className="line-clamp-3 flex flex-col items-center justify-center"
                                                        dangerouslySetInnerHTML={{ __html: product?.description }}
                                                        style={{
                                                            overflow: 'hidden',
                                                            padding: '8px 0',
                                                            height: '80px',
                                                            textOverflow: 'ellipsis',
                                                            display: '-webkit-box',
                                                        }}
                                                    ></div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    <tr>
                                        <td className="px-4 text-[15px] font-bold uppercase">SKU</td>
                                        {compareProducts.map((product, index) => {
                                            return (
                                                <td key={index} className="px-3 py-3 text-center">
                                                    <span>{product?.SKU}</span>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    <tr>
                                        <td className="px-4 text-[15px] font-bold uppercase">AVAILABILITY</td>
                                        {compareProducts.map((product, index) => {
                                            return (
                                                <td key={index} className="px-3 py-3 text-center">
                                                    {product?.isValid ? (
                                                        <span className="text-green-500">In stock</span>
                                                    ) : (
                                                        <span className="text-red-500">Out of stock</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    <tr>
                                        <td className="px-4 text-[15px] font-bold uppercase">WEIGHT</td>
                                        {compareProducts.map((product, index) => {
                                            return (
                                                <td key={index} className="px-3 py-3 text-center">
                                                    {product?.weight}kg
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    <tr>
                                        <td className="px-4 text-[15px] font-bold uppercase">DIMENSIONS</td>
                                        {compareProducts.map((product, index) => {
                                            return (
                                                <td key={index} className="px-3 py-3 text-center text-sm">
                                                    <span>
                                                        {product?.dimensions?.width}cm W x {product?.dimensions?.depth}
                                                        cm D x {product?.dimensions?.height}cm H
                                                    </span>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    <tr>
                                        <td className="px-4 text-[15px] font-bold uppercase">COLOR</td>
                                        {compareProducts.map((product, index) => {
                                            return (
                                                <td key={index} className="px-3 py-3 text-center text-sm">
                                                    {product?.colors?.map((color, idx) => {
                                                        return (
                                                            <span key={idx}>
                                                                {color?.name}
                                                                {idx <= product?.colors?.length - 2 && ', '}
                                                            </span>
                                                        );
                                                    })}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    <tr>
                                        <td className="px-4 text-[15px] font-bold uppercase">MATERIAL</td>
                                        {compareProducts.map((product, index) => {
                                            return (
                                                <td key={index} className="px-3 py-3 text-center text-sm">
                                                    {product?.material}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        ) : (
                            <p className="border-b px-4 py-4">.No products added in the compare table.</p>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default CompareProduct;
