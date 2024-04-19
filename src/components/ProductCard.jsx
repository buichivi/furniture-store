import { Link } from "react-router-dom";
import Tippy from "@tippyjs/react";

const ProductCard = ({ isDisplayGrid = true }) => {
    return (
        <div
            className={`group/product w-full ${!isDisplayGrid && "flex items-center gap-[50px]"}`}
        >
            <Link
                to="/product"
                className={`group/product-img relative w-full shrink-0 overflow-hidden ${!isDisplayGrid && "basis-[40%]"}`}
            >
                <img
                    src="https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/2022/12/01-450x572.jpg"
                    alt=""
                    className="w-full object-contain transition-all duration-500 group-hover/product-img:opacity-0"
                />
                <img
                    src="https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/2023/04/01-2-450x572.jpg"
                    alt=""
                    className="absolute left-0 top-0 -z-10 w-full object-contain"
                />
                <div className="absolute left-0 top-0 z-10 h-full w-full p-4">
                    <span className="mr-1 bg-[#D10202] px-3 py-[2px] text-sm uppercase text-white">
                        Hot
                    </span>
                    <span className="mr-1 bg-[#000] px-3 py-[2px] text-sm uppercase text-white">
                        Sale
                    </span>
                    <span className="bg-[#919191] px-3 py-[2px] text-sm uppercase text-white">
                        Sold out
                    </span>
                </div>
                <div className="absolute right-0 top-0 z-10 h-full w-full">
                    <div className="absolute left-0 top-0 flex h-full w-full flex-col">
                        <div className="flex flex-1 flex-col items-end justify-end gap-4 p-4">
                            <Tippy
                                content="Quick view"
                                placement="left"
                                className="!bg-[#D10202] px-3 !text-base [&.tippy-box[data-placement^=left]>.tippy-arrow:before]:border-l-[#D10202]"
                            >
                                <div
                                    className="flex size-10 translate-y-3 cursor-pointer items-center justify-center rounded-full bg-white text-xl opacity-0 transition-all delay-100  hover:bg-[#D10202] hover:text-white group-hover/product:translate-y-0 group-hover/product:opacity-100"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <i className="fa-light fa-magnifying-glass"></i>
                                </div>
                            </Tippy>
                            <Tippy
                                content="Compare"
                                placement="left"
                                className="!bg-[#D10202] px-3 !text-base [&.tippy-box[data-placement^=left]>.tippy-arrow:before]:border-l-[#D10202]"
                            >
                                <div
                                    className="flex size-10 translate-y-3 cursor-pointer items-center justify-center rounded-full bg-white text-xl opacity-0 transition-all delay-[50]  hover:bg-[#D10202] hover:text-white group-hover/product:translate-y-0 group-hover/product:opacity-100"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <i className="fa-light fa-code-compare"></i>
                                </div>
                            </Tippy>
                            <Tippy
                                content="Wishlist"
                                placement="left"
                                className="!bg-[#D10202] px-3 !text-base [&.tippy-box[data-placement^=left]>.tippy-arrow:before]:border-l-[#D10202]"
                            >
                                <div
                                    className="flex size-10 translate-y-3 cursor-pointer items-center justify-center rounded-full bg-white text-xl opacity-0 transition-all  hover:bg-[#D10202] 
                            hover:text-white group-hover/product:translate-y-0 group-hover/product:opacity-100"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <i className="fa-sharp fa-light fa-heart"></i>
                                </div>
                            </Tippy>
                        </div>
                        <div
                            to="/product"
                            className={`w-full translate-y-3 bg-white py-4 text-center text-base font-medium uppercase text-black opacity-0 transition-all ease-out hover:bg-[#D10202] hover:text-white group-hover/product:translate-y-0 group-hover/product:opacity-100 ${!isDisplayGrid && "hidden"}`}
                            onClick={(e) => e.preventDefault()}
                        >
                            Select options
                        </div>
                    </div>
                    <div
                        className={`absolute bottom-0 right-4 flex size-10 items-center justify-center text-xl opacity-100 transition-all duration-500 group-hover/product:pointer-events-none group-hover/product:opacity-0 ${!isDisplayGrid && "bottom-4"}`}
                    >
                        <i className="fa-sharp fa-light fa-heart "></i>
                    </div>
                </div>
            </Link>
            <div className="mt-4">
                <Link
                    className={`mb-3 inline-block cursor-pointer text-lg tracking-wide transition-colors hover:text-[#D10202] ${!isDisplayGrid && "!text-2xl font-medium"}`}
                >
                    Wood Outdoor Adirondack Chair
                </Link>
                <div
                    className={`flex items-center gap-4 text-lg tracking-wide ${!isDisplayGrid && "text-xl"}`}
                >
                    <span className="font-bold">$1,009</span>
                    <span className="text-[#959595] line-through">$1,259</span>
                </div>
                {!isDisplayGrid && (
                    <>
                        <p className="mt-6 text-[#848484]">
                            Phasellus vitae imperdiet felis. Nam non condimentum
                            erat. Lorem ipsum dolor sit amet, consectetur
                            adipiscing elit. Nulla tortor arcu, consectetur
                            eleifend commodo at, consectetur eu justo.
                        </p>
                        <button className="mt-6 bg-black px-24 py-4 text-base font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#D10202]">
                            Add to cart
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
