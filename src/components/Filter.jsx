import Tippy from '@tippyjs/react';
import SliderPrice from './SliderPrice';
import PropTypes from 'prop-types';
import useCategoryStore from '../store/navigationStore';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Filter = ({ filters, setFilters, products, resetPrice, openState, setOpenState }) => {
    const { categories } = useCategoryStore();
    const { parentCategorySlug, categorySlug } = useParams();
    const [priceRange, setPriceRange] = useState([0, 2000]);

    console.log('Filtering');

    const getListColors = () => {
        const colorsMap = new Map();

        products.forEach((product) => {
            product.colors.forEach((color) => {
                colorsMap.set(color.name, color);
            });
        });
        return Array.from(colorsMap.values());
    };

    const getListMaterials = () => {
        const materialsSet = new Set();
        products.forEach((product) => {
            product.material.split(',').map((material) => {
                materialsSet.add(material);
            });
        });
        return Array.from(materialsSet);
    };

    useEffect(() => {
        setFilters({
            typeFilters: categories
                ?.filter((cate) => {
                    if (parentCategorySlug) {
                        const parentCategory = categories.find((cate) => cate.slug == parentCategorySlug);
                        return cate.parentId == parentCategory._id;
                    }
                    return cate.parentId != '';
                })
                ?.map((cate) => ({
                    ...cate,
                    selected: false,
                })),
            priceRange,
            colorsFilters: getListColors().map((color) => ({ ...color, selected: false })),
            materialFilters: getListMaterials().map((mt) => ({ name: mt, selected: false })),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products, categories, parentCategorySlug]);

    useEffect(() => {
        setFilters((filters) => ({ ...filters, priceRange }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [priceRange]);

    return (
        <div className="shrink-0 overflow-hidden transition-all duration-500">
            {!categorySlug && (
                <div>
                    <input
                        type="checkbox"
                        checked={openState[0].open}
                        onChange={(e) => {
                            setOpenState(
                                openState.map((op) =>
                                    op.name == 'type' ? { ...op, open: e.currentTarget.checked } : op,
                                ),
                            );
                        }}
                        className="hidden [&:checked+label+div]:grid-rows-[1fr] [&:checked+label_span:last-child>i:last-child]:opacity-0"
                        id="filter-option-1"
                    />
                    <label
                        htmlFor="filter-option-1"
                        className="flex cursor-pointer items-center justify-between bg-[#EFEFEF] px-4 py-4"
                    >
                        <span className="text-base font-bold uppercase tracking-wider">Type</span>
                        <span className="relative">
                            <i className="fa-light fa-minus"></i>
                            <i className="fa-light fa-minus absolute left-0 top-1/2 -translate-y-1/2 rotate-90 transition-opacity"></i>
                        </span>
                    </label>
                    <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500">
                        <div className="overflow-hidden">
                            <div className="flex flex-col gap-4 border px-4 py-6">
                                {filters?.typeFilters?.length > 0 &&
                                    filters?.typeFilters?.map((cate, index) => {
                                        return (
                                            <label
                                                key={index}
                                                className="flex w-fit cursor-pointer select-none items-center gap-4 capitalize"
                                            >
                                                <input
                                                    checked={cate.selected}
                                                    type="checkbox"
                                                    className="hidden [&:checked+span]:bg-black [&:checked+span_path]:[stroke-dashoffset:0] [&:checked+span_path]:[stroke:#fff]"
                                                    onChange={(e) => {
                                                        const selected = e.currentTarget.checked;
                                                        setFilters((filters) => ({
                                                            ...filters,
                                                            typeFilters: filters.typeFilters.map((type) =>
                                                                type._id == cate._id ? { ...type, selected } : type,
                                                            ),
                                                        }));
                                                    }}
                                                />
                                                <span className="inline-block size-5 bg-transparent ring-1 ring-[#b1b1b1] transition-colors ">
                                                    <svg className="" viewBox="0 0 100 100" fill="none">
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
                                                <span className="font-inter text-sm font-normal tracking-wide hover:opacity-60">
                                                    {cate.name}
                                                </span>
                                            </label>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="border-t">
                <input
                    type="checkbox"
                    checked={openState[1].open}
                    onChange={(e) => {
                        setOpenState(
                            openState.map((op) => (op.name == 'color' ? { ...op, open: e.currentTarget.checked } : op)),
                        );
                    }}
                    className="hidden [&:checked+label+div]:grid-rows-[1fr] [&:checked+label_span:last-child>i:last-child]:opacity-0"
                    id="filter-option-2"
                />
                <label
                    htmlFor="filter-option-2"
                    className="flex cursor-pointer items-center justify-between bg-[#EFEFEF] px-4 py-4"
                >
                    <span className="text-base font-bold uppercase tracking-wider">Colors</span>
                    <span className="relative">
                        <i className="fa-light fa-minus"></i>
                        <i className="fa-light fa-minus absolute left-0 top-1/2 -translate-y-1/2 rotate-90 transition-opacity"></i>
                    </span>
                </label>
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500">
                    <div className="overflow-hidden">
                        <div className="grid grid-cols-7 gap-x-4 gap-y-4 border px-4 py-6">
                            {filters?.colorsFilters?.length > 0 &&
                                filters?.colorsFilters?.map((color, index) => {
                                    return (
                                        <div key={index}>
                                            <input
                                                type="checkbox"
                                                id={`color-filter-${index}`}
                                                checked={color.selected}
                                                className="hidden [&:checked+label>img]:scale-75 [&:checked+label]:border-black"
                                                onChange={(e) => {
                                                    const selected = e.currentTarget.checked;
                                                    setFilters((filters) => ({
                                                        ...filters,
                                                        colorsFilters: filters.colorsFilters.map((cl) =>
                                                            cl._id == color._id ? { ...cl, selected } : cl,
                                                        ),
                                                    }));
                                                }}
                                            />
                                            <Tippy content={color.name} animation="shift-toward">
                                                <label
                                                    htmlFor={`color-filter-${index}`}
                                                    className="inline-block size-8 cursor-pointer rounded-full border border-transparent transition-all hover:border-black [&:hover>img]:scale-75"
                                                >
                                                    <img
                                                        className={`inline-block size-full rounded-full transition-all duration-500`}
                                                        style={{
                                                            aspectRatio: 1,
                                                        }}
                                                        src={color.thumb}
                                                    />
                                                </label>
                                            </Tippy>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t">
                <input
                    type="checkbox"
                    checked={openState[2].open}
                    onChange={(e) => {
                        setOpenState(
                            openState.map((op) => (op.name == 'price' ? { ...op, open: e.currentTarget.checked } : op)),
                        );
                    }}
                    className="hidden [&:checked+label+div]:grid-rows-[1fr] [&:checked+label_span:last-child>i:last-child]:opacity-0"
                    id="filter-option-3"
                />
                <label
                    htmlFor="filter-option-3"
                    className="flex cursor-pointer items-center justify-between bg-[#EFEFEF] px-4 py-4"
                >
                    <span className="text-base font-bold uppercase tracking-wider">Price</span>
                    <span className="relative">
                        <i className="fa-light fa-minus"></i>
                        <i className="fa-light fa-minus absolute left-0 top-1/2 -translate-y-1/2 rotate-90 transition-opacity"></i>
                    </span>
                </label>
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500">
                    <div className="overflow-hidden">
                        <div className="border px-4 py-6">
                            <SliderPrice
                                min={0}
                                max={2000}
                                onChange={({ min, max }) => {
                                    setPriceRange([min, max]);
                                }}
                                resetPrice={resetPrice}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t">
                <input
                    type="checkbox"
                    checked={openState[3].open}
                    onChange={(e) => {
                        setOpenState(
                            openState.map((op) =>
                                op.name == 'material' ? { ...op, open: e.currentTarget.checked } : op,
                            ),
                        );
                    }}
                    className="hidden [&:checked+label+div]:grid-rows-[1fr] [&:checked+label_span:last-child>i:last-child]:opacity-0"
                    id="filter-option-4"
                />
                <label
                    htmlFor="filter-option-4"
                    className="flex cursor-pointer items-center justify-between bg-[#EFEFEF] px-4 py-4"
                >
                    <span className="text-base font-bold uppercase tracking-wider">Material</span>
                    <span className="relative">
                        <i className="fa-light fa-minus"></i>
                        <i className="fa-light fa-minus absolute left-0 top-1/2 -translate-y-1/2 rotate-90 transition-opacity"></i>
                    </span>
                </label>
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500">
                    <div className="overflow-hidden">
                        <div className="flex flex-col gap-4 border px-4 py-6">
                            {filters?.materialFilters?.length > 0 &&
                                filters?.materialFilters?.map((material, index) => {
                                    return (
                                        <label
                                            key={index}
                                            className="flex w-fit cursor-pointer select-none items-center gap-4 capitalize"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={material.selected}
                                                className="hidden [&:checked+span]:bg-black [&:checked+span_path]:[stroke-dashoffset:0] [&:checked+span_path]:[stroke:#fff]"
                                                onChange={(e) => {
                                                    const selected = e.currentTarget.checked;
                                                    setFilters((filters) => ({
                                                        ...filters,
                                                        materialFilters: filters.materialFilters.map((mt) =>
                                                            mt.name == material.name ? { ...mt, selected } : mt,
                                                        ),
                                                    }));
                                                }}
                                            />
                                            <span className="inline-block size-5 bg-transparent ring-1 ring-[#b1b1b1] transition-colors ">
                                                <svg className="" viewBox="0 0 100 100" fill="none">
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
                                            <span className="font-inter text-sm font-normal capitalize tracking-wide hover:opacity-60">
                                                {material.name}
                                            </span>
                                        </label>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Filter.propTypes = {
    filters: PropTypes.object,
    setFilters: PropTypes.func,
    products: PropTypes.array,
    resetPrice: PropTypes.bool,
    openState: PropTypes.array,
    setOpenState: PropTypes.func,
};

export default Filter;
