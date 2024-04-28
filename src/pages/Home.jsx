import { Coupon, HomeBanner, ProductCard, Slider, SliderBlog, SliderCategory } from "../components";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <>
            <div className="mb-[70px] bg-main">
                <div className="container mx-auto h-screen px-5">
                    <Slider />
                </div>
            </div>
            <div className="container mx-auto mb-20 px-5">
                <h3 className="mb-[30px] text-xl font-bold uppercase">Shop by category</h3>
                <SliderCategory />
            </div>
            <div className="container mx-auto mb-[30px] px-5">
                <HomeBanner />
            </div>
            <div className="container mx-auto mb-20 px-5">
                <Coupon />
            </div>
            <div className="container mx-auto mb-10 px-5">
                <div className="mb-[30px] flex items-center justify-between">
                    <h4 className="text-center text-2xl font-medium">Best Modern Furniture</h4>
                    <div className="text-center">
                        <Link className="text-base transition-colors hover:text-[#D10202]">
                            See all {">"}
                            {">"}
                        </Link>
                    </div>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
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
                                number_of_review: 9,
                            },
                            colors: [
                                {
                                    name: "black",
                                    color_thumb:
                                        "https://demo.theme-sky.com/nooni/wp-content/uploads/2023/05/black-46x46.jpg",
                                    images: [
                                        "https://cdn.arhaus.com/product/StandardV2/201032CHMBLK_A210923.jpg?preset=ProductGrande",
                                        "https://cdn.arhaus.com/product/StandardV2/201032CHMBLK_B210923.jpg?preset=ProductGrande",
                                        "https://cdn.arhaus.com/product/StandardV2/201032CHMBLK_D210923.jpg?preset=ProductGrande",
                                        "https://cdn.arhaus.com/product/StandardV2/201032CHMBLK_CD210511.jpg?preset=ProductGrande",
                                    ],
                                },
                                {
                                    name: "green",
                                    color_thumb:
                                        "https://demo.theme-sky.com/nooni/wp-content/uploads/2023/05/green-46x46.jpg",
                                    images: [
                                        "https://cdn.arhaus.com/product/StandardV2/40HATTIECABEB_B210311.jpg?preset=ProductGrande",
                                        "https://cdn.arhaus.com/product/StandardV2/40HATTIECABEB_A210311.jpg?preset=ProductGrande",
                                        "https://cdn.arhaus.com/product/StandardV2/40HATTIECABEB_C210311.jpg?preset=ProductGrande",
                                        "https://cdn.arhaus.com/product/StandardV2/40HATTIECABEB_D210311.jpg?preset=ProductGrande",
                                    ],
                                },
                                {
                                    name: "gray",
                                    color_thumb:
                                        "https://demo.theme-sky.com/nooni/wp-content/uploads/2023/05/grey-46x46.jpg",
                                    images: [
                                        "https://cdn.arhaus.com/product/StandardV2/1072838SWBF_DS231016.jpg?preset=ProductGrande",
                                        "https://cdn.arhaus.com/product/StandardV2/1072838SWBF_DP231016.jpg?preset=ProductGrande",
                                        "https://cdn.arhaus.com/product/StandardV2/1072838SWBF_DQ231016.jpg?preset=ProductGrande",
                                        "https://cdn.arhaus.com/product/StandardV2/1072838SWBF_DT231016.jpg?preset=ProductGrande",
                                    ],
                                },
                                {
                                    name: "teak",
                                    color_thumb:
                                        "https://demo.theme-sky.com/nooni/wp-content/uploads/2023/05/teak-46x46.jpg",
                                    images: [
                                        "https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/2022/12/01-450x572.jpg",
                                        "https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/2023/04/01-2-450x572.jpg",
                                        "https://demo.theme-sky.com/nooni/wp-content/uploads/2023/04/01-3-450x572.jpg",
                                        "https://demo.theme-sky.com/nooni/wp-content/uploads/2023/04/01-5-450x572.jpg",
                                    ],
                                },
                            ],
                        },
                        {
                            id: 2,
                            is_trend: true,
                            is_valid: true,
                            name: "Wood Outdoor Adirondack Chair",
                            short_description: `Phasellus vitae imperdiet felis. Nam non condimentumerat. Lorem ipsum dolor sit amet, consecteturadipiscing elit. Nulla tortor arcu, consectetureleifend commodo at, consectetur eu justo.`,
                            discount: 50,
                            prices: [
                                {
                                    price: 2000,
                                    currency: "$",
                                },
                                {
                                    price: 22000000,
                                    currency: "vnd",
                                },
                            ],
                            review: {
                                average_star: 3.4,
                                number_of_review: 9,
                            },
                            colors: [
                                {
                                    name: "black",
                                    color_thumb:
                                        "https://demo.theme-sky.com/nooni/wp-content/uploads/2023/05/black-46x46.jpg",
                                    images: [
                                        "https://cdn.arhaus.com/product/StandardV2/201032CHMBLK_A210923.jpg?preset=ProductGrande",
                                        "https://cdn.arhaus.com/product/StandardV2/201032CHMBLK_B210923.jpg?preset=ProductGrande",
                                        "https://cdn.arhaus.com/product/StandardV2/201032CHMBLK_D210923.jpg?preset=ProductGrande",
                                        "https://cdn.arhaus.com/product/StandardV2/201032CHMBLK_CD210511.jpg?preset=ProductGrande",
                                    ],
                                },
                                {
                                    name: "green",
                                    color_thumb:
                                        "https://demo.theme-sky.com/nooni/wp-content/uploads/2023/05/green-46x46.jpg",
                                    images: [
                                        "https://cdn.arhaus.com/product/StandardV2/40HATTIECABEB_B210311.jpg?preset=ProductGrande",
                                        "https://cdn.arhaus.com/product/StandardV2/40HATTIECABEB_A210311.jpg?preset=ProductGrande",
                                        "https://cdn.arhaus.com/product/StandardV2/40HATTIECABEB_C210311.jpg?preset=ProductGrande",
                                        "https://cdn.arhaus.com/product/StandardV2/40HATTIECABEB_D210311.jpg?preset=ProductGrande",
                                    ],
                                },
                                {
                                    name: "gray",
                                    color_thumb:
                                        "https://demo.theme-sky.com/nooni/wp-content/uploads/2023/05/grey-46x46.jpg",
                                    images: [
                                        "https://cdn.arhaus.com/product/StandardV2/1072838SWBF_DS231016.jpg?preset=ProductGrande",
                                        "https://cdn.arhaus.com/product/StandardV2/1072838SWBF_DP231016.jpg?preset=ProductGrande",
                                        "https://cdn.arhaus.com/product/StandardV2/1072838SWBF_DQ231016.jpg?preset=ProductGrande",
                                        "https://cdn.arhaus.com/product/StandardV2/1072838SWBF_DT231016.jpg?preset=ProductGrande",
                                    ],
                                },
                                {
                                    name: "teak",
                                    color_thumb:
                                        "https://demo.theme-sky.com/nooni/wp-content/uploads/2023/05/teak-46x46.jpg",
                                    images: [
                                        "https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/2022/12/01-450x572.jpg",
                                        "https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/2023/04/01-2-450x572.jpg",
                                        "https://demo.theme-sky.com/nooni/wp-content/uploads/2023/04/01-3-450x572.jpg",
                                        "https://demo.theme-sky.com/nooni/wp-content/uploads/2023/04/01-5-450x572.jpg",
                                    ],
                                },
                            ],
                        },
                    ].map((product, index) => {
                        return <ProductCard key={index} product={product} />;
                    })}
                </div>
            </div>
            <div className="container mx-auto mb-20 px-5">
                <SliderBlog />
            </div>
        </>
    );
};

export default Home;
