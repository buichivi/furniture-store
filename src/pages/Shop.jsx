import { useState } from "react";
import { Navigation, ProductCard, SliderCategory } from "../components";
import MultiRangeSlider from "../components/MultipleRange";

const Shop = () => {
    const [isDisplayGrid, setIsDisplayGrid] = useState(true);
    const [price, setPrice] = useState([0, 1000]);
    return (
        <div className="mt-[90px] border-t">
            <div className="container mx-auto px-5">
                <Navigation />
                <div className="mb-16">
                    <SliderCategory />
                </div>
                <div className="flex gap-8 border-t py-16">
                    <div className="shrink-0 basis-1/4">
                        <span className="mb-16 flex max-h-10 w-fit items-center gap-2 bg-[#EFEFEF] px-4 py-2 text-[15px]">
                            <span className="mr-1">Filter</span>
                            <i className="fa-sharp fa-light fa-sliders text-2xl"></i>
                        </span>
                        <div className="shrink-0 overflow-hidden transition-all duration-500">
                            <div>
                                <input
                                    type="checkbox"
                                    className="hidden [&:checked+label+div]:grid-rows-[1fr] [&:checked+label_span:last-child>i:last-child]:opacity-0"
                                    id="filter-option-1"
                                />
                                <label
                                    htmlFor="filter-option-1"
                                    className="flex cursor-pointer items-center justify-between bg-[#EFEFEF] px-4 py-4"
                                >
                                    <span className="">Type</span>
                                    <span className="relative">
                                        <i className="fa-light fa-minus"></i>
                                        <i className="fa-light fa-minus absolute left-0 top-1/2 -translate-y-1/2 rotate-90 transition-opacity"></i>
                                    </span>
                                </label>
                                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500">
                                    <div className="overflow-hidden">
                                        <div className="flex flex-col gap-4 border px-4 py-6">
                                            {[
                                                "bed",
                                                "bedroom furniture",
                                                "chair",
                                                "table",
                                                "cabinet",
                                                "home office",
                                                "lamp",
                                                "living room",
                                            ].map((type, index) => {
                                                return (
                                                    <label
                                                        key={index}
                                                        className="flex w-fit cursor-pointer select-none items-center gap-4 capitalize"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="hidden [&:checked+span]:bg-black [&:checked+span_path]:[stroke-dashoffset:0] [&:checked+span_path]:[stroke:#fff]"
                                                        />
                                                        <span className="inline-block size-5 bg-transparent ring-1 ring-[#b1b1b1] transition-colors ">
                                                            <svg
                                                                className=""
                                                                viewBox="0 0 100 100"
                                                                fill="none"
                                                            >
                                                                <path
                                                                    d="m 20 55 l 20 20 l 41 -50"
                                                                    stroke="#000"
                                                                    strokeWidth="8"
                                                                    className="transition-all"
                                                                    strokeDasharray="100"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeDashoffset="100"
                                                                ></path>
                                                            </svg>
                                                        </span>
                                                        <span className="text-[15px] font-normal tracking-wide hover:opacity-60">
                                                            {type}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t">
                                <input
                                    type="checkbox"
                                    className="hidden [&:checked+label+div]:grid-rows-[1fr] [&:checked+label_span:last-child>i:last-child]:opacity-0"
                                    id="filter-option-2"
                                />
                                <label
                                    htmlFor="filter-option-2"
                                    className="flex cursor-pointer items-center justify-between bg-[#EFEFEF] px-4 py-4"
                                >
                                    <span className="">Colors</span>
                                    <span className="relative">
                                        <i className="fa-light fa-minus"></i>
                                        <i className="fa-light fa-minus absolute left-0 top-1/2 -translate-y-1/2 rotate-90 transition-opacity"></i>
                                    </span>
                                </label>
                                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500">
                                    <div className="overflow-hidden">
                                        <div className="grid grid-cols-7 gap-x-4 gap-y-4 border px-4 py-6">
                                            {[
                                                "red",
                                                "blue",
                                                "green",
                                                "gray",
                                                "pink",
                                                "yellow",
                                                "red",
                                                "blue",
                                                "green",
                                                "gray",
                                                "pink",
                                                "yellow",
                                            ].map((color, index) => {
                                                return (
                                                    <span
                                                        key={index}
                                                        className={`w-full cursor-pointer rounded-full`}
                                                        style={{
                                                            backgroundColor:
                                                                color,
                                                            aspectRatio: 1,
                                                        }}
                                                    ></span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t">
                                <input
                                    type="checkbox"
                                    className="hidden [&:checked+label+div]:grid-rows-[1fr] [&:checked+label_span:last-child>i:last-child]:opacity-0"
                                    id="filter-option-3"
                                />
                                <label
                                    htmlFor="filter-option-3"
                                    className="flex cursor-pointer items-center justify-between bg-[#EFEFEF] px-4 py-4"
                                >
                                    <span className="">Price</span>
                                    <span className="relative">
                                        <i className="fa-light fa-minus"></i>
                                        <i className="fa-light fa-minus absolute left-0 top-1/2 -translate-y-1/2 rotate-90 transition-opacity"></i>
                                    </span>
                                </label>
                                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500">
                                    <div className="overflow-hidden">
                                        <div className="border px-4 py-6">
                                            <MultiRangeSlider
                                                min={0}
                                                max={1000}
                                                onChange={(props) => {
                                                    console.log(props);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col">
                        <div className="mb-16 flex max-h-10 flex-1 items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span
                                    className={`cursor-pointer text-3xl ${!isDisplayGrid && "text-[#D10202]"} transition-colors hover:text-[#D10202]`}
                                    onClick={() => setIsDisplayGrid(false)}
                                >
                                    <i className="fa-light fa-diagram-cells"></i>
                                </span>
                                <span
                                    className={`cursor-pointer text-3xl ${isDisplayGrid && "text-[#D10202]"} transition-colors hover:text-[#D10202]`}
                                    onClick={() => setIsDisplayGrid(true)}
                                >
                                    <i className="fa-light fa-grid-2"></i>
                                </span>
                            </div>
                            <div className="flex items-center gap-6">
                                <label className="flex cursor-pointer select-none items-center gap-4 bg-[#EFEFEF] px-4 py-2">
                                    <input
                                        type="checkbox"
                                        className="hidden [&:checked+span]:bg-black [&:checked+span_path]:[stroke-dashoffset:0] [&:checked+span_path]:[stroke:#fff]"
                                    />
                                    <span className="inline-block size-5 bg-transparent ring-1 ring-[#b1b1b1] transition-colors ">
                                        <svg
                                            className=""
                                            viewBox="0 0 100 100"
                                            fill="none"
                                        >
                                            <path
                                                d="m 20 55 l 20 20 l 41 -50"
                                                stroke="#000"
                                                strokeWidth="8"
                                                className="transition-all"
                                                strokeDasharray="100"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeDashoffset="100"
                                            ></path>
                                        </svg>
                                    </span>
                                    <span className="text-[15px] font-normal tracking-wide">
                                        Show only products on sale
                                    </span>
                                </label>
                                <div className="bg-[#EFEFEF] px-4 py-2 text-[15px] tracking-wide">
                                    Sort by latest
                                </div>
                            </div>
                        </div>
                        <div
                            className={`flex-1 ${isDisplayGrid ? "grid grid-cols-3 gap-8" : "flex flex-col items-start gap-10"}`}
                        >
                            {[1, 2, 3, 4, 5, 6].map((product, index) => {
                                return (
                                    <ProductCard
                                        key={index}
                                        isDisplayGrid={isDisplayGrid}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
