import { Link } from "react-router-dom";
import SliderProductImages from "./SliderProductImages";
import ReviewStars from "./ReviewStars";
import { forwardRef, useEffect, useState } from "react";
import { numberWithCommas } from "../utils";
import PropType from "prop-types";

const ProductQuickView = forwardRef(function ProductQuickView({ product = {} }, ref) {
    const [images, setImages] = useState([]);
    const [selectedColor, setSelectedColor] = useState();

    useEffect(() => {
        if (product?.colors.length > 0) {
            setImages(product?.colors[3]?.images);
        }
    }, [product]);

    return (
        <div>
            {/* Quick view */}
            <input
                type="checkbox"
                ref={ref}
                id={"product-quick-view-" + product?.id}
                className="hidden [&:checked+div>div:last-child]:-translate-y-1/2 [&:checked+div]:pointer-events-auto [&:checked+div]:opacity-100 [&:checked+div_div]:opacity-100"
            />
            <div className="pointer-events-none fixed left-0 top-0 z-[60] h-screen w-screen opacity-0 transition-all">
                <label
                    htmlFor={"product-quick-view-" + product?.id}
                    className="absolute left-0 top-0 block h-full w-full bg-[#000000ce]"
                ></label>
                <div className="absolute left-1/2 top-1/2 flex h-[600px] min-w-[940px] -translate-x-1/2 -translate-y-10 items-center gap-8 bg-white p-8 opacity-0 transition-all delay-300">
                    <label
                        htmlFor={"product-quick-view-" + product?.id}
                        className="absolute right-0 top-0 flex size-8 cursor-pointer items-center justify-center bg-black text-white"
                    >
                        <i className="fa-light fa-xmark"></i>
                    </label>
                    <div className="h-full basis-[55%]">
                        <SliderProductImages imageGallery={images} />
                    </div>
                    <div className="absolute bottom-[5%] right-0 top-[10%] max-h-full w-[42%] overflow-y-auto pr-8 [scrollbar-width:thin]">
                        <h3 className="mb-8 text-3xl tracking-wider">{product?.name}</h3>
                        <div className="mb-7 flex items-center gap-12">
                            <div className="flex items-center gap-2">
                                <ReviewStars stars={product?.review?.average_star} />
                                <span>({product?.review?.number_of_review})</span>
                            </div>
                            <div className="text-base">
                                <span>Stock: </span>
                                {product?.is_valid ? (
                                    <span className="text-green-400">In Stock</span>
                                ) : (
                                    <span className="text-red-400">Out Of Stock</span>
                                )}
                            </div>
                        </div>
                        <div className="mb-7 flex items-center gap-4">
                            <span className="text-2xl tracking-wide">
                                {product?.prices[0]?.currency}
                                {numberWithCommas(
                                    Math.floor((product?.prices[0]?.price * (100 - product?.discount)) / 100),
                                )}
                            </span>
                            <span className="text-lg font-light tracking-wide text-[#959595] line-through">
                                {product?.prices[0]?.currency}
                                {numberWithCommas(product?.prices[0]?.price)}
                            </span>
                            {product?.discount > 0 && (
                                <span className="text-lg text-red-500">(-{product?.discount}%)</span>
                            )}
                        </div>
                        <p className="mb-7 line-clamp-3 text-base text-[#959595]">{product?.short_description}</p>
                        {product?.colors.length > 0 && (
                            <div className="mb-10">
                                <h3 className="mb-5 text-lg font-semibold">COLOR:</h3>
                                <div className="flex items-center gap-2">
                                    {product?.colors.map((color, index) => (
                                        <div
                                            key={index}
                                            className={`relative size-10 cursor-pointer border border-[#969696] transition-all hover:border-black ${selectedColor?.name == color?.name && "!border-black"}`}
                                            onClick={() => {
                                                setSelectedColor(color);
                                                setImages(color?.images);
                                            }}
                                        >
                                            <img
                                                src={color?.color_thumb}
                                                alt={color?.name}
                                                className="absolute left-1/2 top-1/2 inline-block size-8 -translate-x-1/2 -translate-y-1/2 object-cover"
                                            ></img>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {product?.is_valid && (
                            <div className="flex h-[50px] w-full items-center gap-4">
                                <div className="flex h-full flex-1 items-center bg-[#ededed]">
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
                                    <button className="h-full w-full bg-black text-sm font-semibold uppercase text-white transition-colors hover:bg-[#d10202]">
                                        Add to cart
                                    </button>
                                </div>
                            </div>
                        )}

                        {product?.is_valid && (
                            <button className="mt-4 h-[50px] w-full border border-black bg-transparent text-sm font-semibold uppercase text-black transition-all hover:border-[#d10202] hover:text-[#d10202]">
                                Buy now
                            </button>
                        )}
                        <div className="mt-9 flex flex-col gap-[10px] text-sm tracking-wide">
                            <p>
                                SKU: <span className="text-[#848484]">001</span>
                            </p>
                            <p>
                                BRANDS:{" "}
                                <Link className="text-[#848484] transition-colors hover:text-[#d10202]">
                                    Creative Design
                                </Link>
                            </p>
                            <div className="flex gap-1">
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
            </div>
        </div>
    );
});

ProductQuickView.propTypes = {
    product: PropType.object,
};

export default ProductQuickView;
