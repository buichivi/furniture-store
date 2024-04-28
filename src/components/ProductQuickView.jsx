import { Link } from "react-router-dom";
import SliderProductImages from "./SliderProductImages";
import ReviewStars from "./ReviewStars";
import { forwardRef, useEffect, useState } from "react";
import { numberWithCommas } from "../utils";
import PropType from "prop-types";
import { useProductQuickViewStore } from "../store/productQuickViewStore";

const ProductQuickView = forwardRef(function ProductQuickView() {
    const [selectedColor, setSelectedColor] = useState();
    const { product, isOpen, toggleOpen } = useProductQuickViewStore();

    useEffect(() => {
        setSelectedColor();
    }, [isOpen]);

    return (
        <>
            {/* Quick view */}
            <div
                className={`fixed left-0 top-0 z-[60] h-screen w-screen ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} transition-all`}
            >
                <span
                    className="absolute left-0 top-0 block h-full w-full bg-[#000000ce]"
                    onClick={() => toggleOpen(false)}
                ></span>
                <div
                    className={`absolute left-1/2 top-1/2 flex h-[600px] min-w-[1000px] -translate-x-1/2 ${isOpen ? "-translate-y-1/2 opacity-100" : "-translate-y-10 opacity-0"} items-center gap-8 bg-white p-8  transition-all delay-300`}
                >
                    <span
                        className="absolute right-0 top-0 flex size-8 cursor-pointer items-center justify-center bg-black text-white"
                        onClick={() => toggleOpen(false)}
                    >
                        <i className="fa-light fa-xmark"></i>
                    </span>
                    <div className="h-full basis-[55%]">
                        <SliderProductImages
                            imageGallery={selectedColor?.images || product?.colors[3]?.images}
                            viewFullScreen={false}
                        />
                    </div>
                    <div className="absolute bottom-[5%] right-0 top-[10%] max-h-full w-[42%] overflow-y-auto pr-8 [scrollbar-width:thin]">
                        <h3 className="mb-8 text-3xl tracking-wider">{product?.name}</h3>
                        <div className="mb-7 flex items-center gap-12">
                            <div className="flex items-center gap-2">
                                <ReviewStars stars={product?.review?.average_star} size="15px" />
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
                            <div className={`mb-10 ${selectedColor && "mb-8"}`}>
                                <div className="mb-5 flex items-center gap-2">
                                    <h3 className="text-lg font-semibold">COLOR:</h3>
                                    {selectedColor && (
                                        <span className="font-light capitalize">{selectedColor?.name}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {product?.colors.map((color, index) => (
                                        <div
                                            key={index}
                                            className={`relative size-10 cursor-pointer border border-[#c5c5c5] transition-all hover:border-black ${selectedColor?.name == color?.name && "!border-black"}`}
                                            onClick={() => {
                                                setSelectedColor(color);
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
                                {selectedColor && (
                                    <button
                                        className="text-sm font-normal text-[#d10202]"
                                        onClick={() => setSelectedColor()}
                                    >
                                        Clear
                                    </button>
                                )}
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
                                    <button
                                        className={`h-full w-full bg-black text-sm font-semibold uppercase text-white transition-colors hover:bg-[#d10202] ${!selectedColor && "cursor-not-allowed opacity-50"}`}
                                    >
                                        Add to cart
                                    </button>
                                </div>
                            </div>
                        )}

                        {product?.is_valid && (
                            <button
                                className={`mt-4 h-[50px] w-full border border-black bg-transparent text-sm font-semibold uppercase text-black transition-all hover:border-[#d10202] hover:text-[#d10202] ${!selectedColor && "cursor-not-allowed opacity-40"}`}
                            >
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
        </>
    );
});

ProductQuickView.propTypes = {
    product: PropType.object,
};

export default ProductQuickView;
