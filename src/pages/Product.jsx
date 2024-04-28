import { useState } from "react";
import { Navigation, RelatedProducts, ReviewStars, SliderProductImages, UserReview } from "../components";
import { numberWithCommas } from "../utils";
import { Link } from "react-router-dom";

const productDemo = {
    id: 1,
    is_trend: true,
    is_valid: true,
    name: "Wood Outdoor Adirondack Chair",
    short_description: `Phasellus vitae imperdiet felis. Nam non condimentumerat. Lorem ipsum dolor sit amet, consecteturadipiscing elit. Nulla tortor arcu, consectetureleifend commodo at, consectetur eu justo.`,
    discount: 50,
    prices: [
        {
            price: 1099,
            currency: "$",
        },
        {
            price: 22000000,
            currency: "vnd",
        },
    ],
    review: {
        average_star: 3.4,
        number_of_review: 3,
        reviews: [
            {
                username: "Marcel",
                user_img: "https://secure.gravatar.com/avatar/e37e05791ac775975aaffb62f352fe32?s=150&d=mm&r=g",
                user_review:
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi itaque omnis voluptate earum dolorum odit vitae reiciendis quo assumenda pariatur.",
                review_date: "May 31, 2023",
                user_rating: 5,
            },
            {
                username: "Marcel",
                user_img: "https://secure.gravatar.com/avatar/e37e05791ac775975aaffb62f352fe32?s=150&d=mm&r=g",
                user_review:
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi itaque omnis voluptate earum dolorum odit vitae reiciendis quo assumenda pariatur.",
                review_date: "May 31, 2023",
                user_rating: 5,
            },
            {
                username: "Marcel",
                user_img: "https://secure.gravatar.com/avatar/e37e05791ac775975aaffb62f352fe32?s=150&d=mm&r=g",
                user_review:
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi itaque omnis voluptate earum dolorum odit vitae reiciendis quo assumenda pariatur.",
                review_date: "May 31, 2023",
                user_rating: 5,
            },
        ],
    },
    colors: [
        {
            name: "black",
            color_thumb: "https://demo.theme-sky.com/nooni/wp-content/uploads/2023/05/black-46x46.jpg",
            images: [
                "https://cdn.arhaus.com/product/StandardV2/201032CHMBLK_A210923.jpg?preset=ProductGrande",
                "https://cdn.arhaus.com/product/StandardV2/201032CHMBLK_B210923.jpg?preset=ProductGrande",
                "https://cdn.arhaus.com/product/StandardV2/201032CHMBLK_D210923.jpg?preset=ProductGrande",
                "https://cdn.arhaus.com/product/StandardV2/201032CHMBLK_CD210511.jpg?preset=ProductGrande",
            ],
        },
        {
            name: "green",
            color_thumb: "https://demo.theme-sky.com/nooni/wp-content/uploads/2023/05/green-46x46.jpg",
            images: [
                "https://cdn.arhaus.com/product/StandardV2/40HATTIECABEB_B210311.jpg?preset=ProductGrande",
                "https://cdn.arhaus.com/product/StandardV2/40HATTIECABEB_A210311.jpg?preset=ProductGrande",
                "https://cdn.arhaus.com/product/StandardV2/40HATTIECABEB_C210311.jpg?preset=ProductGrande",
                "https://cdn.arhaus.com/product/StandardV2/40HATTIECABEB_D210311.jpg?preset=ProductGrande",
            ],
        },
        {
            name: "gray",
            color_thumb: "https://demo.theme-sky.com/nooni/wp-content/uploads/2023/05/grey-46x46.jpg",
            images: [
                "https://cdn.arhaus.com/product/StandardV2/1072838SWBF_DS231016.jpg?preset=ProductGrande",
                "https://cdn.arhaus.com/product/StandardV2/1072838SWBF_DP231016.jpg?preset=ProductGrande",
                "https://cdn.arhaus.com/product/StandardV2/1072838SWBF_DQ231016.jpg?preset=ProductGrande",
                "https://cdn.arhaus.com/product/StandardV2/1072838SWBF_DT231016.jpg?preset=ProductGrande",
            ],
        },
        {
            name: "teak",
            color_thumb: "https://demo.theme-sky.com/nooni/wp-content/uploads/2023/05/teak-46x46.jpg",
            images: [
                "https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/2022/12/01-450x572.jpg",
                "https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/2023/04/01-2-450x572.jpg",
                "https://demo.theme-sky.com/nooni/wp-content/uploads/2023/04/01-3-450x572.jpg",
                "https://demo.theme-sky.com/nooni/wp-content/uploads/2023/04/01-5-450x572.jpg",
            ],
        },
    ],
    details: `
        <p>Ankara Chair with Fabric Cushion 29.75″Wx28″Dx30.5″H</p>
        <ul>
        <li>Frame is benchmade with precision-cut solid ash with grey wash finish, hardwood plywood, and a cane seat</li>
        <li>Synthetic webbing suspension system</li>
        <li>Soy-based polyfoam cushion with fiber encased in downproof ticking</li>
        <li>Frame stained with grey wash finish and clear protective lacquer</li>
        <li>See product label or call customer service for additional details on product content</li>
        </ul>`,
    deliveryAndReturns: `
        <div class="custom-tab-content"><p class="heading"><strong>WHITE GLOVE SERVICE </strong></p>
        <p>Items are delivered to your room of choice by appointment, then unpacked and fully assembled by a skilled two-person team. Includes packaging removal and recycling Fee varies by location and order total. (Doorstep delivery does not include assembly)</p>
        <p class="heading"><strong>FLAT RATE DELIVERY </strong></p>
        <p>An unlimited number of eligible furniture and select non-furniture items can be delivered for one flat rate per shipping address. Your order will ship when all items are ready for delivery. Fee varies by location and order total.</p>
        <p class="heading"><strong>RETURN POLICY </strong></p>
        <p>You can return eligible items within 30 days of receiving an order or 7 days for Quick Ship upholstery items for a refund of the merchandise value. Made-to-Order furniture is not eligible for returns.</p></div>`,
};

const Product = () => {
    const [selectedColor, setSelectedColor] = useState();
    const [selectedTab, setSelectedTab] = useState(1);

    return (
        <div className="mt-[90px] border-t">
            <Navigation isShowPageName={false} />
            <div className="container mx-auto px-5">
                <div className="mb-32 flex gap-12">
                    <div className="basis-[55%]">
                        <SliderProductImages
                            thumbWidth="12%"
                            imageGallery={selectedColor?.images || productDemo?.colors[3]?.images}
                        />
                    </div>
                    <div className="flex-1">
                        <h1 className="mb-6 text-3xl font-normal">{productDemo?.name}</h1>
                        <div className="mb-10 flex items-center gap-10">
                            <div className="flex items-center gap-2">
                                <ReviewStars stars={productDemo?.review?.average_star} size="15px" />
                                <span>({productDemo?.review?.number_of_review})</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span>Stock: </span>
                                {productDemo?.is_valid ? (
                                    <span className="text-green-500">In stock</span>
                                ) : (
                                    <span className="text-red-500">Out of stock</span>
                                )}
                            </div>
                        </div>
                        <div className="mb-4 flex items-center gap-4">
                            <div className="flex gap-0 text-4xl">
                                <span>{productDemo?.prices[0].currency}</span>
                                <span>{numberWithCommas(productDemo?.prices[0].price)}</span>
                            </div>
                            <div className="flex gap-0 text-xl text-[#959595] line-through">
                                <span>{productDemo?.prices[0].currency}</span>
                                <span>
                                    {numberWithCommas(
                                        Math.floor(
                                            (productDemo?.prices[0].price * (100 - productDemo?.discount)) / 100,
                                        ),
                                    )}
                                </span>
                            </div>
                        </div>
                        <p className="mb-10 line-clamp-3 text-base text-[#959595]">{productDemo?.short_description}</p>
                        <div className="relative mb-9 pb-1">
                            <div className="mb-5 flex items-center gap-2">
                                <span className="inline-block font-semibold">COLOR: </span>
                                {selectedColor && <span className="capitalize">{selectedColor?.name}</span>}
                            </div>
                            <div className="flex items-center gap-2">
                                {productDemo?.colors?.map((color, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={`relative size-10 cursor-pointer border hover:border-black ${color?.name == selectedColor?.name && "border-black"}`}
                                            onClick={() => setSelectedColor(color)}
                                        >
                                            <img
                                                className="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2"
                                                src={color?.color_thumb}
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
                        <div className="flex h-[50px] w-full items-center gap-4">
                            <div className="flex h-full basis-[30%] items-center bg-[#ededed]">
                                <i className="fa-light fa-minus flex-1 shrink-0 cursor-pointer text-center text-sm"></i>
                                <input
                                    type="number"
                                    min={1}
                                    defaultValue={1}
                                    className="w-5 flex-1 shrink-0 border-none bg-transparent px-4 text-center text-sm outline-none"
                                />
                                <i className="fa-light fa-plus flex-1 shrink-0 cursor-pointer text-center text-sm"></i>
                            </div>
                            <div className="h-full flex-1 shrink-0">
                                <button
                                    className={`h-full w-full bg-black text-sm font-semibold uppercase text-white transition-colors hover:bg-[#d10202] ${!selectedColor && "cursor-not-allowed opacity-50"}`}
                                >
                                    Add to cart
                                </button>
                            </div>
                        </div>
                        <button
                            className={`mt-4 h-[50px] w-full border border-black bg-transparent text-sm font-semibold uppercase text-black transition-all hover:border-[#d10202] hover:text-[#d10202] ${!selectedColor && "cursor-not-allowed opacity-40"}`}
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
                                SKU: <span className="text-[#848484]">001</span>
                            </p>
                            <p className="text-sm">
                                BRANDS:{" "}
                                <Link className="text-[#848484] transition-colors hover:text-[#d10202]">
                                    Creative Design
                                </Link>
                            </p>
                            <div className="flex gap-1 text-sm">
                                TAGS:{" "}
                                <div className="flex items-center gap-1">
                                    {["furniture", "trending", "wood"].map((tag, index) => (
                                        <div key={index}>
                                            <Link className="capitalize text-[#848484] transition-colors hover:text-[#d10202]">
                                                {tag}
                                            </Link>
                                            {index <= 1 && <span>,</span>}
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
                            className={`cursor-pointer px-10 py-5 capitalize transition-all hover:bg-[#efefef] ${selectedTab == 1 && "bg-[#efefef] font-bold"}`}
                            onClick={() => setSelectedTab(1)}
                        >
                            Details
                        </span>
                        <span
                            className={`cursor-pointer px-10 py-5 capitalize transition-all hover:bg-[#efefef] ${selectedTab == 2 && "bg-[#efefef] font-bold"}`}
                            onClick={() => setSelectedTab(2)}
                        >
                            Delivery & returns
                        </span>
                        <span
                            className={`cursor-pointer px-10 py-5 text-center capitalize transition-all hover:bg-[#efefef] ${selectedTab == 3 && "bg-[#efefef] font-bold"}`}
                            onClick={() => setSelectedTab(3)}
                        >
                            Reviews<span className="ml-1">({productDemo?.review?.number_of_review})</span>
                        </span>
                    </div>
                    <div>
                        {selectedTab == 1 && <div dangerouslySetInnerHTML={{ __html: productDemo?.details }}></div>}
                        {selectedTab == 2 && (
                            <div dangerouslySetInnerHTML={{ __html: productDemo?.deliveryAndReturns }}></div>
                        )}
                        {selectedTab == 3 && <UserReview product={productDemo} />}
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
