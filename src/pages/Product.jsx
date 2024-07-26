import { useEffect, useMemo, useState, Suspense, lazy } from 'react';
import SliderProductImages from '../components/SliderProductImages';
import ReviewStars from '../components/ReviewStars';
import Navigation from '../components/Navigation';
import { numberWithCommas } from '../utils/format';
import { Link, useLoaderData, useNavigate, useParams } from 'react-router-dom';
import apiRequest from '../utils/apiRequest';
import toast from 'react-hot-toast';
import useCartStore from '../store/cartStore';
import useDataStore from '../store/dataStore';
import useAuthStore from '../store/authStore';
import { useCompareProductsStore } from '../store/compareProductsStore';
import Tippy from '@tippyjs/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

const SliderProducts = lazy(() => import('../components/SliderProducts'));
const UserReview = lazy(() => import('../components/UserReview'));

function getRandomProducts(products, product, count) {
    // Lọc ra các sản phẩm ngoại trừ sản phẩm có id là product
    const filteredProducts = products.filter(
        (prod) => prod._id !== product?._id && prod?.category?._id == product?.category?._id,
    );

    // Sử dụng hàm ngẫu nhiên để xáo trộn danh sách
    const shuffledProducts = filteredProducts.sort(() => 0.5 - Math.random());

    // Lấy ra count sản phẩm ngẫu nhiên từ danh sách đã xáo trộn
    return shuffledProducts.slice(0, count);
}

const Product = () => {
    const productData = useLoaderData();
    const { productSlug } = useParams();
    const { setCart } = useCartStore();
    const { products, setWishlist } = useDataStore();
    const [isInWishlist, setIsInWishlist] = useState(false);
    const { token } = useAuthStore();

    const [selectedColor, setSelectedColor] = useState();
    const [selectedTab, setSelectedTab] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(productData);
    const navigate = useNavigate();
    const { toggleOpen, setCompares, compareProducts } = useCompareProductsStore();
    const [isOpenTabsMobile, setIsOpenTabsMobile] = useState({ description: false, returns: false, reviews: false });

    const averageRating = useMemo(() => {
        const totalRating = product?.reviews?.reduce((acc, cur) => acc + cur?.rating, 0);
        const totalReview = product?.reviews?.length;
        return totalReview ? totalRating / totalReview : 0;
    }, [product]);

    useEffect(() => {
        apiRequest
            .get('/products/' + productSlug)
            .then((res) => {
                setProduct(res.data.product);
            })
            .catch((err) => console.log(err));
    }, [productSlug]);

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

    useEffect(() => {
        const _product = products.find((prod) => prod._id == product?._id);
        if (_product) {
            setIsInWishlist(_product?.isInWishlist);
        }
    }, [products, product]);

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
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                },
            ),
            {
                loading: 'Adding to cart...',
                success: (res) => {
                    if (buyNow) {
                        navigate('/cart');
                    }
                    setCart(res.data.cart);
                    return res.data.message;
                },
                error: (err) => err.response.data?.error,
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

    const handleAddToWishlist = () => {
        toast.promise(
            apiRequest.post('/wishlist', { product: product?._id }, { headers: { Authorization: 'Bearer ' + token } }),
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

    return (
        <div className="mt-16 lg:mt-content-top lg:border-t">
            <Navigation isShowPageName={false} paths={`/product/${product?.slug}`} />
            <div className="container mx-auto px-5">
                <div className="mb-10 flex flex-col lg:mb-20 lg:flex-row lg:gap-12">
                    <div className="mb-4 lg:aspect-square lg:basis-[55%]">
                        <SliderProductImages
                            isNew={product?.isNew}
                            isValid={product?.isValid}
                            discount={product?.discount}
                            thumbWidth="12%"
                            imageGallery={
                                selectedColor?.images || (product?.colors?.length && product?.colors[0]?.images)
                            }
                            model3D={selectedColor?.model3D}
                        />
                    </div>
                    <div className="flex-1">
                        <h1 className="mb-6 font-lora text-4xl font-medium tracking-wider">{product?.name}</h1>
                        <div className="mb-6 flex items-center gap-10">
                            <div className="flex items-center gap-2">
                                <ReviewStars stars={averageRating} size="15px" />
                                <span>({product?.reviews?.length})</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span>Stock: </span>
                                {product?.isValid ? (
                                    <span className="text-green-500">{selectedColor?.stock} In stock</span>
                                ) : (
                                    <span className="text-red-500">Out of stock</span>
                                )}
                            </div>
                        </div>
                        <div className="mb-4 flex items-center gap-4">
                            <div className="flex gap-0 font-lora text-3xl font-semibold">
                                <span>$</span>
                                <span>{numberWithCommas(product?.salePrice)}</span>
                            </div>
                            {product?.discount > 0 && (
                                <div className="flex gap-0 font-lora text-xl text-[#959595] line-through">
                                    <span>$</span>
                                    <span>{numberWithCommas(product?.price)}</span>
                                </div>
                            )}
                            {product?.discount > 0 && (
                                <span className="text-lg text-green-500">(-{product?.discount}%)</span>
                            )}
                        </div>
                        <p
                            className="mb-10 line-clamp-3 text-base text-[#959595]"
                            dangerouslySetInnerHTML={{
                                __html: product?.description,
                            }}
                        ></p>
                        {product?.colors?.length > 1 && (
                            <div className="relative mb-9 pb-1">
                                <div className="mb-5 flex items-center gap-2">
                                    <span className="inline-block font-semibold">COLOR: </span>
                                    {selectedColor && <span className="capitalize">{selectedColor?.name}</span>}
                                </div>
                                <div className="flex items-center gap-2">
                                    {product?.colors?.map((color, index) => {
                                        return (
                                            <Tippy
                                                key={index}
                                                content={<span className="capitalize">{color?.name}</span>}
                                                animation="shift-toward"
                                            >
                                                <div
                                                    className={`relative size-10 cursor-pointer border hover:border-black ${color?.name == selectedColor?.name && 'border-black'}`}
                                                    onClick={() => setSelectedColor(color)}
                                                >
                                                    <img
                                                        className="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2"
                                                        src={color?.thumb}
                                                        alt={color?.name}
                                                    ></img>
                                                </div>
                                            </Tippy>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        <div className="flex h-[50px] w-full items-center gap-4">
                            <div className="flex h-full basis-[30%] items-center bg-[#ededed]">
                                <i
                                    className="fa-light fa-minus flex-1 shrink-0 cursor-pointer text-center text-sm"
                                    onClick={() => setQuantity((quantity) => (quantity >= 2 ? quantity - 1 : 1))}
                                ></i>
                                <input
                                    type="number"
                                    min={1}
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="w-5 flex-1 shrink-0 border-none bg-transparent px-4 text-center text-sm outline-none"
                                />
                                <i
                                    className="fa-light fa-plus flex-1 shrink-0 cursor-pointer text-center text-sm"
                                    onClick={() => setQuantity((quantity) => quantity + 1)}
                                ></i>
                            </div>
                            <div className="h-full flex-1 shrink-0">
                                <button
                                    className={`h-full w-full select-none bg-black text-sm font-semibold uppercase text-white transition-colors hover:bg-[#d10202] ${(!selectedColor || !product?.isValid) && 'pointer-events-none cursor-not-allowed opacity-50'}`}
                                    onClick={() => handleAddToCart(product?._id, selectedColor?._id, quantity)}
                                >
                                    Add to cart
                                </button>
                            </div>
                        </div>
                        <button
                            className={`mt-4 h-[50px] w-full select-none border border-black bg-transparent text-sm font-semibold uppercase text-black transition-all hover:border-[#d10202] hover:text-[#d10202] ${!selectedColor && 'pointer-events-none cursor-not-allowed opacity-40'}`}
                            onClick={() => handleAddToCart(product?._id, selectedColor?._id, quantity, true)}
                        >
                            Buy now
                        </button>
                        <div className="mt-6 flex items-center text-sm">
                            <div className="flex flex-1 items-center justify-start gap-4 text-sm lg:gap-10 [&>button]:text-sm lg:[&>button]:text-base">
                                <button
                                    className="tracking-wider transition-colors hover:text-[#d10202]"
                                    onClick={() => {
                                        if (!isInWishlist) {
                                            handleAddToWishlist();
                                        } else {
                                            handleRemoveFromWishlist();
                                        }
                                    }}
                                >
                                    <i className={`fa-${isInWishlist ? 'solid' : 'light'} fa-heart mr-2 text-base`}></i>
                                    {!isInWishlist ? <span>Add to wishlist</span> : <Link>Remove from wishlist</Link>}
                                </button>
                                <button
                                    className="tracking-wider transition-colors hover:text-[#d10202]"
                                    onClick={() => {
                                        const existedProd = compareProducts.find((prod) => prod?._id == product?._id);
                                        if (!existedProd) {
                                            setCompares([...compareProducts, product]);
                                        }
                                        toggleOpen(true);
                                    }}
                                >
                                    <i className="fa-light fa-code-compare text-base"></i>
                                    <span className="ml-2">Compare</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-4 text-base">
                                <div
                                    className="cursor-pointer transition-colors hover:text-[#d10202]"
                                    onClick={() => {
                                        window.open(
                                            `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}'&amp;src=sdkpreparse`,
                                            'facebook-share-dialog',
                                            `width=${window.innerWidth / 2}, height=${window.innerHeight * 0.8}`,
                                        );
                                    }}
                                >
                                    <i className="fa-brands fa-facebook-f"></i>
                                </div>
                                <div
                                    className="ml-2 cursor-pointer transition-colors hover:text-[#d10202]"
                                    onClick={() => {
                                        window.open(
                                            `https://twitter.com/intent/tweet?text=${window.location.href}`,
                                            'twitter-share-dialog',
                                            `width=${window.innerWidth / 2}, height=${window.innerHeight * 0.8}`,
                                        );
                                    }}
                                >
                                    <i className="fa-brands fa-x-twitter"></i>
                                </div>
                                <div
                                    className="ml-2 cursor-pointer transition-colors hover:text-[#d10202]"
                                    onClick={() => {
                                        window.open(
                                            `https://pinterest.com/pin/create/button/?media=${selectedColor?.images[0]}`,
                                            'twitter-share-dialog',
                                            `width=${window.innerWidth / 2}, height=${window.innerHeight * 0.8}`,
                                        );
                                    }}
                                >
                                    <i className="fa-brands fa-pinterest-p"></i>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 flex flex-col gap-1 border-t pt-6">
                            <p className="text-sm">
                                SKU: <span className="text-[#848484]">{product?.SKU}</span>
                            </p>
                            <p className="text-sm">
                                BRAND:
                                <Link
                                    to={`/brand/${product?.brand?.name}`}
                                    className="ml-1 text-[#848484] transition-colors hover:text-[#d10202]"
                                >
                                    {product?.brand?.name}
                                </Link>
                            </p>
                            <div className="flex gap-1 text-sm">
                                TAGS:
                                <div className="flex items-center gap-1">
                                    {product?.tags?.map((tag, index) => (
                                        <div key={index}>
                                            <Link
                                                to={`/tag/${tag?.name}`}
                                                className="capitalize text-[#848484] transition-colors hover:text-[#d10202]"
                                            >
                                                {tag.name}
                                            </Link>
                                            {index <= product?.tags?.length - 2 && <span>,</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-28">
                    <div className="mb-14 hidden w-full flex-col items-end justify-center gap-2 border-b lg:flex lg:flex-row [&_span]:w-full [&_span]:text-left [&_span]:text-base lg:[&_span]:w-fit lg:[&_span]:text-center lg:[&_span]:text-xl">
                        <span
                            className={`cursor-pointer px-10 py-5 capitalize transition-all hover:bg-[#efefef] ${selectedTab == 1 && 'bg-[#efefef] font-bold'}`}
                            onClick={() => setSelectedTab(1)}
                        >
                            Description
                        </span>
                        <span
                            className={`cursor-pointer px-10 py-5 capitalize transition-all hover:bg-[#efefef] ${selectedTab == 2 && 'bg-[#efefef] font-bold'}`}
                            onClick={() => setSelectedTab(2)}
                        >
                            Delivery & returns
                        </span>
                        <span
                            className={`cursor-pointer px-10 py-5 capitalize transition-all hover:bg-[#efefef] ${selectedTab == 3 && 'bg-[#efefef] font-bold'}`}
                            onClick={() => setSelectedTab(3)}
                        >
                            Reviews
                            <span className="ml-1">({product?.reviews?.length})</span>
                        </span>
                    </div>
                    <div className="hidden lg:block">
                        {selectedTab == 1 && (
                            <div>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: product?.description,
                                    }}
                                ></div>
                                <div className="mt-2">
                                    <span className="text-base font-bold">OVERALL: </span>
                                    <span>
                                        {product?.dimensions?.width}cm w {product?.dimensions?.height}cm h{' '}
                                        {product?.dimensions?.depth}cm d
                                    </span>
                                </div>
                                <div>
                                    <span className="text-base font-bold">WEIGHT: </span>
                                    <span>{product?.weight}kg</span>
                                </div>
                            </div>
                        )}
                        {selectedTab == 2 && (
                            <div>
                                <div className="custom-tab-content">
                                    <p className="heading">
                                        <strong>WHITE GLOVE SERVICE </strong>
                                    </p>
                                    <p>
                                        Items are delivered to your room of choice by appointment, then unpacked and
                                        fully assembled by a skilled two-person team. Includes packaging removal and
                                        recycling Fee varies by location and order total. (Doorstep delivery does not
                                        include assembly)
                                    </p>
                                    <p className="heading">
                                        <strong>FLAT RATE DELIVERY </strong>
                                    </p>
                                    <p>
                                        An unlimited number of eligible furniture and select non-furniture items can be
                                        delivered for one flat rate per shipping address. Your order will ship when all
                                        items are ready for delivery. Fee varies by location and order total.
                                    </p>
                                    <p className="heading">
                                        <strong>RETURN POLICY </strong>
                                    </p>
                                    <p>
                                        You can return eligible items within 30 days of receiving an order or 7 days for
                                        Quick Ship upholstery items for a refund of the merchandise value. Made-to-Order
                                        furniture is not eligible for returns.
                                    </p>
                                </div>
                            </div>
                        )}
                        {selectedTab == 3 && (
                            <Suspense fallback={null}>
                                <UserReview product={product} averageRating={averageRating} setProduct={setProduct} />
                            </Suspense>
                        )}
                    </div>
                    <ul className="lg:hidden [&>li:nth-child(n+1)]:mt-2 [&>li>div:first-child]:bg-gray-200 [&>li_span:first-child]:font-semibold [&>li_span]:text-sm">
                        <li>
                            <div
                                className="flex items-center justify-between px-5 py-2"
                                onClick={() =>
                                    setIsOpenTabsMobile({
                                        ...isOpenTabsMobile,
                                        description: !isOpenTabsMobile.description,
                                    })
                                }
                            >
                                <span className="font-bold uppercase">Description</span>
                                {!isOpenTabsMobile?.description ? (
                                    <PlusIcon className="size-5" />
                                ) : (
                                    <MinusIcon className="size-5" />
                                )}
                            </div>
                            <input
                                type="checkbox"
                                checked={isOpenTabsMobile.description}
                                onChange={(e) =>
                                    setIsOpenTabsMobile({ ...isOpenTabsMobile, description: e.currentTarget.checked })
                                }
                                className="hidden [&:checked+div]:grid-rows-[1fr]"
                            />
                            <div className="grid grid-rows-[0fr] transition-all duration-500">
                                <div className="overflow-hidden">
                                    <div className="p-5">
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: product?.description,
                                            }}
                                        ></div>
                                        <div className="mt-2">
                                            <span className="text-sm font-bold lg:text-base">OVERALL: </span>
                                            <span>
                                                {product?.dimensions?.width}cm w {product?.dimensions?.height}cm h{' '}
                                                {product?.dimensions?.depth}cm d
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-bold lg:text-base">WEIGHT: </span>
                                            <span>{product?.weight}kg</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div
                                className="flex items-center justify-between px-5 py-2"
                                onClick={() =>
                                    setIsOpenTabsMobile({
                                        ...isOpenTabsMobile,
                                        returns: !isOpenTabsMobile.returns,
                                    })
                                }
                            >
                                <span className="font-bold uppercase">Delivery & returns</span>
                                {!isOpenTabsMobile?.returns ? (
                                    <PlusIcon className="size-5" />
                                ) : (
                                    <MinusIcon className="size-5" />
                                )}
                            </div>
                            <input
                                type="checkbox"
                                checked={isOpenTabsMobile.returns}
                                onChange={(e) =>
                                    setIsOpenTabsMobile({ ...isOpenTabsMobile, returns: e.currentTarget.checked })
                                }
                                className="hidden [&:checked+div]:grid-rows-[1fr]"
                            />
                            <div className="grid grid-rows-[0fr] transition-all duration-500">
                                <div className="overflow-hidden">
                                    <div className="p-5">
                                        <div className="custom-tab-content">
                                            <p className="heading">
                                                <strong>WHITE GLOVE SERVICE </strong>
                                            </p>
                                            <p>
                                                Items are delivered to your room of choice by appointment, then unpacked
                                                and fully assembled by a skilled two-person team. Includes packaging
                                                removal and recycling Fee varies by location and order total. (Doorstep
                                                delivery does not include assembly)
                                            </p>
                                            <p className="heading">
                                                <strong>FLAT RATE DELIVERY </strong>
                                            </p>
                                            <p>
                                                An unlimited number of eligible furniture and select non-furniture items
                                                can be delivered for one flat rate per shipping address. Your order will
                                                ship when all items are ready for delivery. Fee varies by location and
                                                order total.
                                            </p>
                                            <p className="heading">
                                                <strong>RETURN POLICY </strong>
                                            </p>
                                            <p>
                                                You can return eligible items within 30 days of receiving an order or 7
                                                days for Quick Ship upholstery items for a refund of the merchandise
                                                value. Made-to-Order furniture is not eligible for returns.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div
                                className="flex items-center justify-between px-5 py-2"
                                onClick={() =>
                                    setIsOpenTabsMobile({
                                        ...isOpenTabsMobile,
                                        reviews: !isOpenTabsMobile.reviews,
                                    })
                                }
                            >
                                <div>
                                    <span className="font-bold uppercase">Reviews</span>
                                    <span className="ml-1">({product?.reviews?.length})</span>
                                </div>
                                {!isOpenTabsMobile?.reviews ? (
                                    <PlusIcon className="size-5" />
                                ) : (
                                    <MinusIcon className="size-5" />
                                )}
                            </div>
                            <input
                                type="checkbox"
                                checked={isOpenTabsMobile.reviews}
                                onChange={(e) =>
                                    setIsOpenTabsMobile({ ...isOpenTabsMobile, reviews: e.currentTarget.checked })
                                }
                                className="hidden [&:checked+div]:grid-rows-[1fr]"
                            />
                            <div className="grid grid-rows-[0fr] transition-all duration-500">
                                <div className="overflow-hidden">
                                    <div className="p-5">
                                        <Suspense fallback={null}>
                                            <UserReview
                                                product={product}
                                                averageRating={averageRating}
                                                setProduct={setProduct}
                                            />
                                        </Suspense>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="mb-20">
                    <Suspense fallback={null}>
                        <SliderProducts title="Related Products" products={getRandomProducts(products, product, 5)} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default Product;
