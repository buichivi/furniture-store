import { useEffect, useMemo, useState } from 'react';
import { Navigation, RelatedProducts, ReviewStars, SliderProductImages, UserReview } from '../components';
import { numberWithCommas } from '../utils/format';
import { Link, useNavigation, useParams } from 'react-router-dom';
import apiRequest from '../utils/apiRequest';
import toast from 'react-hot-toast';
import useCartStore from '../store/cartStore';
import useDataStore from '../store/dataStore';
import useAuthStore from '../store/authStore';

export const loader = async ({ params }) => {
    const { productSlug } = params;
    try {
        return (await apiRequest.get('/products/' + productSlug)).data.product;
    } catch (err) {
        return {};
    }
};

const Product = () => {
    const { productSlug } = useParams();
    const { setCart } = useCartStore();
    const { getNavigationPath } = useDataStore();
    const { token } = useAuthStore();

    const [selectedColor, setSelectedColor] = useState();
    const [selectedTab, setSelectedTab] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState({});

    const navigation = useNavigation();

    useEffect(() => {
        // nProgress.done();
        apiRequest
            .get('/products/' + productSlug)
            .then((res) => {
                if (res.data.product?.colors?.length == 1) {
                    setSelectedColor(res.data.product?.colors[0]);
                }
                setProduct(res.data.product);
            })
            .catch((err) => console.log(err));
    }, [productSlug]);

    const averageRating = useMemo(() => {
        const totalRating = product?.reviews?.reduce((acc, cur) => acc + cur?.rating, 0);
        const totalReview = product?.reviews?.length;
        return totalReview ? totalRating / totalReview : 0;
    }, [product]);

    const handleAddToCart = (productId, colorId, quantity) => {
        toast.promise(
            apiRequest.post(
                '/cart',
                {
                    product: productId,
                    color: colorId,
                    quantity,
                },
                { headers: { Authorization: `Bearer ${token}` }, withCredentials: true },
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
        <div className="mt-[90px] border-t">
            <Navigation isShowPageName={false} paths={getNavigationPath(product, 'product')} />
            <div className="container mx-auto px-5">
                <div className="mb-32 flex gap-12">
                    <div className="basis-[55%]">
                        <SliderProductImages
                            isValid={product?.isValid}
                            discount={product?.discount}
                            thumbWidth="12%"
                            imageGallery={
                                selectedColor?.images || (product?.colors?.length && product?.colors[0]?.images)
                            }
                        />
                    </div>
                    <div className="flex-1">
                        <h1 className="mb-6 text-3xl font-normal">{product?.name}</h1>
                        <div className="mb-10 flex items-center gap-10">
                            <div className="flex items-center gap-2">
                                <ReviewStars stars={averageRating} size="15px" />
                                <span>({product?.reviews?.length})</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {navigation.state == 'loading' && <h1>Loaded</h1>}
                                <span>Stock: </span>
                                {product?.isValid ? (
                                    <span className="text-green-500">In stock</span>
                                ) : (
                                    <span className="text-red-500">Out of stock</span>
                                )}
                            </div>
                        </div>
                        <div className="mb-4 flex items-center gap-4">
                            <div className="flex gap-0 text-3xl">
                                <span>$</span>
                                <span>{numberWithCommas(product?.salePrice)}</span>
                            </div>
                            <div className="flex gap-0 text-xl text-[#959595] line-through">
                                <span>$</span>
                                <span>{numberWithCommas(product?.price)}</span>
                            </div>
                        </div>
                        <p
                            className="mb-10 line-clamp-3 text-base text-[#959595]"
                            dangerouslySetInnerHTML={{ __html: product?.description }}
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
                                            <div
                                                key={index}
                                                className={`relative size-10 cursor-pointer border hover:border-black ${color?.name == selectedColor?.name && 'border-black'}`}
                                                onClick={() => setSelectedColor(color)}
                                            >
                                                <img
                                                    className="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2"
                                                    src={color?.thumb}
                                                    alt={color?.name}
                                                ></img>
                                            </div>
                                        );
                                    })}
                                </div>
                                {selectedColor && (
                                    <button
                                        className="absolute left-0 top-full text-[#d10202]"
                                        onClick={() => setSelectedColor()}
                                    >
                                        Clear
                                    </button>
                                )}
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
                        >
                            Buy now
                        </button>
                        <div className="mt-6 flex items-center text-sm">
                            <div className="flex flex-1 items-center gap-10 text-sm">
                                <button className="tracking-wider transition-colors hover:text-[#d10202]">
                                    <i className="fa-light fa-heart text-base"></i>
                                    <span className="ml-2">Add to wishlist</span>
                                </button>
                                <button className="tracking-wider transition-colors hover:text-[#d10202]">
                                    <i className="fa-light fa-code-compare text-base"></i>
                                    <span className="ml-2">Compare</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-4 text-base">
                                <span className="cursor-pointer transition-colors hover:text-[#d10202]">
                                    <i className="fa-brands fa-facebook-f"></i>
                                </span>
                                <span className="ml-2 cursor-pointer transition-colors hover:text-[#d10202]">
                                    <i className="fa-brands fa-x-twitter"></i>
                                </span>
                                <span className="ml-2 cursor-pointer transition-colors hover:text-[#d10202]">
                                    <i className="fa-brands fa-pinterest-p"></i>
                                </span>
                            </div>
                        </div>
                        <div className="mt-5 flex flex-col gap-1 border-t pt-6">
                            <p className="text-sm">
                                SKU: <span className="text-[#848484]">{product?.SKU}</span>
                            </p>
                            <p className="text-sm">
                                BRAND:{' '}
                                <Link className="text-[#848484] transition-colors hover:text-[#d10202]">
                                    {product?.brand?.name}
                                </Link>
                            </p>
                            <div className="flex gap-1 text-sm">
                                TAGS:{' '}
                                <div className="flex items-center gap-1">
                                    {product?.tags?.map((tag, index) => (
                                        <div key={index}>
                                            <Link className="capitalize text-[#848484] transition-colors hover:text-[#d10202]">
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
                    <div className="mb-14 flex items-end justify-center gap-2 border-b [&_span]:text-xl">
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
                            className={`cursor-pointer px-10 py-5 text-center capitalize transition-all hover:bg-[#efefef] ${selectedTab == 3 && 'bg-[#efefef] font-bold'}`}
                            onClick={() => setSelectedTab(3)}
                        >
                            Reviews<span className="ml-1">({product?.reviews?.length})</span>
                        </span>
                    </div>
                    <div>
                        {selectedTab == 1 && <div dangerouslySetInnerHTML={{ __html: product?.description }}></div>}
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
                        {selectedTab == 3 && <UserReview product={product} averageRating={averageRating} />}
                    </div>
                </div>
                <div className="mb-20">
                    <RelatedProducts />
                </div>
            </div>
        </div>
    );
};

export default Product;
