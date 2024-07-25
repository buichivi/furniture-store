import Tippy from '@tippyjs/react';
import SliderPrice from './SliderPrice';
import PropTypes from 'prop-types';
import useDataStore from '../store/dataStore';
import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const updateSelection = (categories, id, selected) => {
    // Hàm đệ quy để cập nhật trạng thái của tất cả các danh mục con
    const updateChildren = (categoryList, selected) => {
        return categoryList.map((category) => {
            category.selected = selected;
            if (category.child.length > 0) {
                category.child = updateChildren(category.child, selected);
            }
            return category;
        });
    };

    // Hàm chính để tìm và cập nhật trạng thái của danh mục cha và các danh mục con
    const updateRecursive = (categoryList) => {
        return categoryList.map((category) => {
            if (category._id === id) {
                // Cập nhật trạng thái cho danh mục được chọn
                category.selected = selected;
                if (category.child.length > 0) {
                    // Cập nhật trạng thái cho tất cả các danh mục con
                    category.child = updateChildren(category.child, selected);
                }
            } else if (category.child.length > 0) {
                // Tiếp tục đệ quy nếu không phải danh mục cần cập nhật
                category.child = updateRecursive(category.child);
            }
            return category;
        });
    };

    // Cập nhật danh sách danh mục từ gốc
    return updateRecursive(categories);
};

const updateParentSelection = (categories) => {
    return categories.map((category) => {
        if (category.child.length > 0) {
            category.child = updateParentSelection(category.child);
            const allChildrenSelected = category.child.every((child) => child.selected);
            category.selected = allChildrenSelected;
        }
        return category;
    });
};

const handleCategorySelect = (id, selected, categories) => {
    let updatedCategories = updateSelection(categories, id, selected);
    updatedCategories = updateParentSelection(updatedCategories);
    return updatedCategories;
};

function isDescendant(parent, childSlug) {
    if (parent?.slug == childSlug) return true;
    if (parent?.child?.length) {
        for (const child of parent.child) {
            if (isDescendant(child, childSlug)) return true;
        }
    }
    return false;
}

const Filter = ({ filters, setFilters, resetPrice, openState, setOpenState }) => {
    const { products, categories, categoryTree, setCategoryTree } = useDataStore();
    const { categorySlug } = useParams();
    const [priceRange, setPriceRange] = useState([0, 2000]);

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
            typeFilters: categoryTree,
            priceRange,
            colorsFilters: getListColors().map((color) => ({
                ...color,
                selected: false,
            })),
            materialFilters: getListMaterials().map((mt) => ({
                name: mt,
                selected: false,
            })),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products, categories, categorySlug, categoryTree]);

    useEffect(() => {
        setFilters((filters) => ({ ...filters, priceRange }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [priceRange]);

    useEffect(() => {
        console.log('CHANG PATH NAME');
        const resetCategoryTree = categoryTree;
        for (const cate of resetCategoryTree) {
            updateSelection(resetCategoryTree, cate._id, false);
        }
        setCategoryTree(resetCategoryTree);
    }, [location.pathname]);

    return (
        <div className="shrink-0 overflow-hidden transition-all duration-500">
            <div>
                <input
                    type="checkbox"
                    checked={openState[0].open}
                    onChange={(e) => {
                        setOpenState(
                            openState.map((op) => (op.name == 'type' ? { ...op, open: e.currentTarget.checked } : op)),
                        );
                    }}
                    className="hidden [&:checked+label+div]:grid-rows-[1fr] [&:checked+label_span:last-child>i:last-child]:opacity-0"
                    id="filter-option-1"
                />
                <label
                    htmlFor="filter-option-1"
                    className="flex cursor-pointer items-center justify-between bg-[#EFEFEF] px-4 py-2 text-sm lg:py-4 lg:text-base"
                >
                    <span className="font-bold uppercase tracking-wider">Type</span>
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
                                    return <TypeItem key={index} category={cate} />;
                                })}
                        </div>
                    </div>
                </div>
            </div>
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
                    className="flex cursor-pointer items-center justify-between bg-[#EFEFEF] px-4 py-2 text-sm lg:py-4 lg:text-base"
                >
                    <span className="font-bold uppercase tracking-wider">Colors</span>
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
                                                            cl._id == color._id
                                                                ? {
                                                                      ...cl,
                                                                      selected,
                                                                  }
                                                                : cl,
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
                    className="flex cursor-pointer items-center justify-between bg-[#EFEFEF] px-4 py-2 text-sm lg:py-4 lg:text-base"
                >
                    <span className="font-bold uppercase tracking-wider">Price</span>
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
                    className="flex cursor-pointer items-center justify-between bg-[#EFEFEF] px-4 py-2 text-sm lg:py-4 lg:text-base"
                >
                    <span className="font-bold uppercase tracking-wider">Material</span>
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
                                                            mt.name == material.name
                                                                ? {
                                                                      ...mt,
                                                                      selected,
                                                                  }
                                                                : mt,
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

const TypeItem = ({ category, isChild = false }) => {
    const { categorySlug } = useParams();
    const { categoryTree, setCategoryTree } = useDataStore();
    const isChildren = useMemo(() => {
        return isDescendant(category, categorySlug);
    }, [categorySlug, category]);

    return (
        <div className={`${isChild && 'ml-8 mt-2'}`}>
            <input
                type="checkbox"
                defaultChecked={categorySlug == category?.slug || isChildren}
                className="hidden [&:checked+div+div]:grid-rows-[1fr] [&:checked+div>div.expand-icon>svg]:rotate-180"
            />
            <div className="flex items-center justify-between">
                <label
                    key={category?._id}
                    className="flex w-fit shrink-0 cursor-pointer select-none items-center gap-4 capitalize [&:hover>span:last-child]:opacity-100 [&:hover>span]:ring-black"
                >
                    <input
                        checked={category.selected}
                        type="checkbox"
                        className="hidden [&:checked+span]:bg-black [&:checked+span]:ring-black [&:checked+span_path]:[stroke-dashoffset:0] [&:checked+span_path]:[stroke:#fff]"
                        onChange={(e) => {
                            const selected = e.currentTarget.checked;
                            setCategoryTree(handleCategorySelect(category._id, selected, categoryTree));
                        }}
                    />
                    <span className="inline-block size-4 bg-transparent ring-1 ring-[#b1b1b1] transition-all">
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
                    <span className="font-inter text-sm font-normal tracking-wide opacity-80 transition-colors">
                        {category.name}
                    </span>
                </label>
                <div
                    className="expand-icon flex flex-1 cursor-pointer items-center justify-end"
                    onClick={(e) => {
                        const ip = e.currentTarget.parentElement.previousElementSibling;
                        ip.checked = !ip.checked;
                    }}
                >
                    {category?.child?.length > 0 && (
                        <ChevronDownIcon className="size-3 text-gray-500 transition-all duration-500" />
                    )}
                </div>
            </div>
            <div className="grid grid-rows-[0fr] transition-all duration-500">
                <div className="overflow-hidden">
                    {category?.child?.map((childCate, index) => {
                        return <TypeItem key={index} category={childCate} isChild={true} />;
                    })}
                </div>
            </div>
        </div>
    );
};

Filter.propTypes = {
    filters: PropTypes.object,
    setFilters: PropTypes.func,
    resetPrice: PropTypes.bool,
    openState: PropTypes.array,
    setOpenState: PropTypes.func,
};

TypeItem.propTypes = {
    category: PropTypes.object,
    isChild: PropTypes.bool,
};

export default Filter;
