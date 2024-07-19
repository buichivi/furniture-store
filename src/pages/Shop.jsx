import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Filter, Navigation, Pagination, ProductCard } from '../components';
import { Link, useParams } from 'react-router-dom';
import useDataStore from '../store/dataStore';
import {
    ChevronDownIcon,
    PlusIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import apiRequest from '../utils/apiRequest';
import Tippy from '@tippyjs/react';
import PropTypes from 'prop-types';

const FILTER_OPEN_STATE = [
    { name: 'type', open: true },
    { name: 'color', open: true },
    { name: 'price', open: true },
    { name: 'material', open: true },
];

const SORT_OPTIONS = [
    { name: 'Sort by latest', option: 'latest' },
    { name: 'Sort by price: Low to high', option: 'priceAsc' },
    { name: 'Sort by price: High to low', option: 'priceDesc' },
];

const PAGE_SIZE = Number(import.meta.env.VITE_PAGE_SIZE) || 12;

const getSelectedCategories = (categories) => {
    const selectedCategories = [];

    const traverse = (categoryList) => {
        categoryList.forEach((category) => {
            if (category.selected) {
                selectedCategories.push(category);
            }
            if (category.child.length > 0) {
                traverse(category.child);
            }
        });
    };

    traverse(categories);
    return selectedCategories;
};

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
            const allChildrenSelected = category.child.every(
                (child) => child.selected,
            );
            console.log(allChildrenSelected);
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

const Shop = () => {
    const { query, tag, brand, categorySlug } = useParams();
    const [isDisplayGrid, setIsDisplayGrid] = useState(true);
    const { products, categories, categoryTree, setCategoryTree } =
        useDataStore();
    const [filters, setFilters] = useState({
        typeFilters: [],
        colorsFilters: [],
        priceRange: [],
        materialFilters: [],
    });
    const [onSaleOnly, setOnSaleOnly] = useState(false);
    const [resetPrice, setResetPrice] = useState(false);
    const [key, setKey] = useState(0);
    const [openState, setOpenState] = useState(FILTER_OPEN_STATE);
    const [sort, setSort] = useState(SORT_OPTIONS[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(PAGE_SIZE);
    const [isLoadmore, setIsLoadmore] = useState(false);

    const [isCloseFilter, setIsCloseFilter] = useState(true);
    const contentRef = useRef();

    // Search page
    const [searchedProducts, setSearchedProducts] = useState([]);
    useEffect(() => {
        if (query) {
            apiRequest
                .get('/products/search/' + query)
                .then((res) =>
                    setSearchedProducts(
                        res.data?.products?.filter((prod) => prod.active),
                    ),
                )
                .catch((err) => console.log(err));
        }
    }, [query]);

    // Tag page
    const [productTags, setProductTags] = useState([]);
    useEffect(() => {
        if (tag) {
            apiRequest
                .get('/products/tag/' + tag)
                .then((res) =>
                    setProductTags(
                        res.data?.products?.filter((prod) => prod.active),
                    ),
                )
                .catch((err) => console.log(err));
        }
    }, [tag]);

    // Brand page
    const [productBrands, setProductBrand] = useState([]);
    useEffect(() => {
        if (brand) {
            apiRequest
                .get('/products/brand/' + brand)
                .then((res) =>
                    setProductBrand(
                        res.data?.products?.filter((prod) => prod.active),
                    ),
                )
                .catch((err) => console.log(err));
        }
    }, [brand]);

    // useEffect(() => {
    //     window.scrollTo({
    //         top: 0,
    //         behavior: 'smooth',
    //     });
    // }, [currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    useEffect(() => {
        const category = categories.find((cate) => cate.slug == categorySlug);
        if (category) {
            setCategoryTree(
                handleCategorySelect(category._id, true, categoryTree),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categorySlug, categories]);

    const filteredProducts = useMemo(() => {
        let listProducts = [];
        const { typeFilters, colorsFilters, priceRange, materialFilters } =
            filters;
        if (query) listProducts = searchedProducts;
        else if (tag) listProducts = productTags;
        else if (brand) listProducts = productBrands;
        else listProducts = products;

        return listProducts
            .filter((prod) => {
                const typeMatch =
                    getSelectedCategories(typeFilters).length == 0 ||
                    getSelectedCategories(typeFilters).find(
                        (type) => type._id == prod.category._id,
                    );
                const colorMatch =
                    colorsFilters.filter((color) => color.selected) == 0 ||
                    colorsFilters
                        .filter((color) => color.selected)
                        .some((color) =>
                            prod.colors.some((cl) => cl?.name == color?.name),
                        );
                const priceMatch =
                    prod.salePrice >= priceRange[0] &&
                    prod.salePrice <= priceRange[1];
                const materialMatch =
                    materialFilters.filter((mt) => mt.selected) == 0 ||
                    materialFilters
                        .filter((mt) => mt.selected)
                        .find((mt) => mt.name == prod.material);
                const onSaleMatch = !onSaleOnly || prod.discount;
                return (
                    typeMatch &&
                    colorMatch &&
                    priceMatch &&
                    materialMatch &&
                    onSaleMatch
                );
            })
            .sort((a, b) => {
                if (sort.option == 'latest') {
                    return a.createAt - b.createAt;
                } else if (sort.option == 'priceAsc') {
                    return a.salePrice - b.salePrice;
                } else if (sort.option == 'priceDesc') {
                    return b.salePrice - a.salePrice;
                }
            });
    }, [
        products,
        filters,
        onSaleOnly,
        sort,
        query,
        tag,
        brand,
        searchedProducts,
        productTags,
        productBrands,
        location.pathname,
    ]);

    const isFiltering = useMemo(() => {
        return (
            filters?.colorsFilters?.filter((color) => color.selected).length >
                0 ||
            filters?.materialFilters?.filter((mt) => mt.selected).length > 0 ||
            (filters?.priceRange?.length > 0 && filters?.priceRange[0] > 0) ||
            (filters?.priceRange?.length > 0 && filters?.priceRange[1] < 2000)
        );
    }, [filters]);

    const currentData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PAGE_SIZE;
        const lastPageIndex = firstPageIndex + PAGE_SIZE;
        return filteredProducts.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, filteredProducts]);

    const currentCategory = useMemo(() => {
        return categoryTree.find((cate) => cate.slug == categorySlug);
    }, [categorySlug, categoryTree]);

    console.log(filteredProducts);

    return (
        <div className="mt-content-top border-t">
            <div className="relative">
                {!query ? (
                    <Navigation
                        paths={location.pathname}
                        image="https://plus.unsplash.com/premium_photo-1683140425081-14c44089acd0?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    />
                ) : (
                    <Navigation
                        paths={`/search/Search results for "${query}"`}
                    />
                )}
            </div>
            <div className="container mx-auto h-fit border-t px-5 py-16">
                {!currentCategory?._id ? (
                    <React.Fragment>
                        <div className="flex">
                            <div
                                className={`shrink-0 transition-all duration-500 ${!isCloseFilter ? 'w-1/4' : 'w-[80px]'}`}
                            >
                                <Tippy
                                    content={
                                        isCloseFilter
                                            ? 'Open filters'
                                            : 'Close filters'
                                    }
                                    animation="shift-toward"
                                >
                                    <div
                                        className="flex w-fit cursor-pointer items-center gap-2 bg-gray-200 p-2"
                                        onClick={() =>
                                            setIsCloseFilter(!isCloseFilter)
                                        }
                                    >
                                        <span>Filter</span>
                                        <PlusIcon
                                            className={`size-5 transition-all duration-500 ${!isCloseFilter ? 'rotate-45' : 'rotate-0'}`}
                                        />
                                    </div>
                                </Tippy>
                            </div>
                            <div
                                className={`ml-8 flex flex-1 flex-col transition-all duration-500`}
                            >
                                <div className="mb-5 flex max-h-10 flex-1 items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span
                                            className={`cursor-pointer text-2xl ${!isDisplayGrid && 'text-[#D10202]'} transition-colors hover:text-[#D10202]`}
                                            onClick={() =>
                                                setIsDisplayGrid(false)
                                            }
                                        >
                                            <i className="fa-light fa-diagram-cells"></i>
                                        </span>
                                        <span
                                            className={`cursor-pointer text-2xl ${isDisplayGrid && 'text-[#D10202]'} transition-colors hover:text-[#D10202]`}
                                            onClick={() =>
                                                setIsDisplayGrid(true)
                                            }
                                        >
                                            <i className="fa-light fa-grid-2"></i>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <label className="flex cursor-pointer select-none items-center gap-4 bg-[#EFEFEF] px-4 py-2">
                                            <input
                                                type="checkbox"
                                                checked={onSaleOnly}
                                                onChange={(e) =>
                                                    setOnSaleOnly(
                                                        e.currentTarget.checked,
                                                    )
                                                }
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
                                            <span className="text-sm font-normal tracking-wide">
                                                Show only products on sale
                                            </span>
                                        </label>

                                        <div className="relative">
                                            <label
                                                htmlFor="sort"
                                                className="flex min-w-60 cursor-pointer items-center justify-between bg-[#EFEFEF] px-4 py-2 text-sm tracking-wide"
                                            >
                                                <span>{sort.name}</span>
                                                <ChevronDownIcon className="size-4 transition-all duration-500" />
                                            </label>
                                            <input
                                                type="checkbox"
                                                className="hidden [&:checked+div]:pointer-events-auto [&:checked+div]:translate-y-0 [&:checked+div]:opacity-100"
                                                id="sort"
                                                onChange={(e) => {
                                                    const sortIcon =
                                                        e.currentTarget
                                                            .previousElementSibling
                                                            .children[1];
                                                    if (e.currentTarget.checked)
                                                        sortIcon.classList.add(
                                                            'rotate-180',
                                                        );
                                                    else
                                                        sortIcon.classList.remove(
                                                            'rotate-180',
                                                        );
                                                }}
                                            />
                                            <div className="pointer-events-none absolute left-0 top-[115%] z-20 flex w-full translate-y-10 flex-col gap-2 border border-gray-100 bg-white px-4 py-2 opacity-0 shadow-lg transition-all duration-500 [&>*:hover]:cursor-pointer [&>*:hover]:opacity-50 [&>*]:text-sm [&>*]:transition-all">
                                                {SORT_OPTIONS.map(
                                                    (op, index) => {
                                                        return (
                                                            <span
                                                                key={index}
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    const input =
                                                                        e
                                                                            .currentTarget
                                                                            .parentElement
                                                                            .previousElementSibling;
                                                                    input.checked =
                                                                        !input.checked;
                                                                    setSort(op);
                                                                }}
                                                                className="py-1"
                                                            >
                                                                {op.name}
                                                            </span>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="flex h-fit overflow-hidden"
                            ref={contentRef}
                        >
                            <input
                                type="checkbox"
                                id="toggle-filter"
                                checked={isCloseFilter}
                                className="hidden [&:checked+div+div]:basis-full [&:checked+div+div_.shop-content]:grid-cols-4 [&:checked+div]:mr-0 [&:checked+div]:w-0"
                            />
                            <div className="mr-8 w-1/4 shrink-0 overflow-hidden transition-all duration-500">
                                <div
                                    style={{
                                        width:
                                            contentRef?.current?.innerWidth / 4,
                                    }}
                                >
                                    <Filter
                                        key={key}
                                        filters={filters}
                                        setFilters={setFilters}
                                        resetPrice={resetPrice}
                                        openState={openState}
                                        setOpenState={setOpenState}
                                    />
                                </div>
                            </div>
                            <div className="flex h-fit basis-3/4 flex-col transition-all duration-500">
                                <div className="mb-6 flex flex-wrap items-center gap-2">
                                    {filters?.colorsFilters?.filter(
                                        (color) => color.selected,
                                    ).length > 0 && (
                                        <div className="flex gap-2">
                                            {filters?.colorsFilters
                                                ?.filter(
                                                    (color) => color.selected,
                                                )
                                                .map((color, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex cursor-pointer items-center gap-2 bg-gray-200 px-2 py-1 transition-colors hover:bg-black hover:text-white"
                                                        onClick={() => {
                                                            setFilters(
                                                                (filters) => ({
                                                                    ...filters,
                                                                    colorsFilters:
                                                                        filters.colorsFilters.map(
                                                                            (
                                                                                cl,
                                                                            ) => {
                                                                                return cl._id ==
                                                                                    color._id
                                                                                    ? {
                                                                                          ...cl,
                                                                                          selected: false,
                                                                                      }
                                                                                    : cl;
                                                                            },
                                                                        ),
                                                                }),
                                                            );
                                                        }}
                                                    >
                                                        <span className="text-sm">
                                                            Color:{' '}
                                                        </span>
                                                        <span className="text-sm italic">
                                                            {color.name}
                                                        </span>
                                                        <XMarkIcon className="size-4" />
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                    {filters?.materialFilters?.filter(
                                        (mt) => mt.selected,
                                    ).length > 0 && (
                                        <div className="flex gap-2">
                                            {filters?.materialFilters
                                                ?.filter((mt) => mt.selected)
                                                .map((mt, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex cursor-pointer items-center gap-2 bg-gray-200 px-2 py-1 transition-colors hover:bg-black hover:text-white"
                                                        onClick={() => {
                                                            setFilters(
                                                                (filters) => ({
                                                                    ...filters,
                                                                    materialFilters:
                                                                        filters.materialFilters.map(
                                                                            (
                                                                                _mt,
                                                                            ) => {
                                                                                return _mt._id ==
                                                                                    mt._id
                                                                                    ? {
                                                                                          ..._mt,
                                                                                          selected: false,
                                                                                      }
                                                                                    : _mt;
                                                                            },
                                                                        ),
                                                                }),
                                                            );
                                                        }}
                                                    >
                                                        <span className="text-sm">
                                                            Material:{' '}
                                                        </span>
                                                        <span className="text-sm italic">
                                                            {mt.name}
                                                        </span>
                                                        <XMarkIcon className="size-4" />
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                    {filters?.priceRange?.length > 0 &&
                                        (filters?.priceRange[0] > 0 ||
                                            filters.priceRange[1] < 2000) && (
                                            <div
                                                className="flex cursor-pointer items-center gap-2 bg-gray-200 px-2 py-1 transition-colors hover:bg-black hover:text-white"
                                                onClick={() => {
                                                    setFilters((filters) => ({
                                                        ...filters,
                                                        priceRange: [0, 2000],
                                                    }));
                                                    setResetPrice(
                                                        (resetPrice) =>
                                                            !resetPrice,
                                                    );
                                                }}
                                            >
                                                <span className="text-sm">
                                                    Price range:{' '}
                                                </span>
                                                <span className="text-sm italic">
                                                    ${filters?.priceRange[0]} -
                                                    ${filters?.priceRange[1]}
                                                </span>
                                                <XMarkIcon className="size-4" />
                                            </div>
                                        )}
                                    {isFiltering && (
                                        <button
                                            className="hover-text-effect text-sm"
                                            onClick={() => {
                                                setKey(key + 1);
                                            }}
                                        >
                                            Clear all
                                        </button>
                                    )}
                                </div>
                                {currentData.length == 0 && (
                                    <div className="w-full bg-gray-200 px-2 py-4 text-sm">
                                        No products were found
                                    </div>
                                )}
                                <div
                                    className={`shop-content flex-1 transition-[grid-template-columns] duration-500 ${isDisplayGrid ? 'grid grid-cols-3 gap-8' : 'flex flex-col items-start gap-10'}`}
                                >
                                    {/* {currentData.map((product, index) => {
                                        return (
                                            <ProductCard
                                                key={index}
                                                product={product}
                                                isDisplayGrid={isDisplayGrid}
                                            />
                                        );
                                    })} */}
                                    {filteredProducts.map((product, index) => {
                                        if (index + 1 > limit) return null;
                                        return (
                                            <ProductCard
                                                key={index}
                                                product={product}
                                                isDisplayGrid={isDisplayGrid}
                                            />
                                        );
                                    })}
                                </div>
                                {limit < filteredProducts.length && (
                                    <div className="mt-20 text-center">
                                        <button
                                            className="w-[200px] border border-black bg-black px-4 py-3 text-sm tracking-wider text-white transition-all hover:bg-white hover:text-black"
                                            onClick={() => {
                                                setIsLoadmore(true); // Bắt đầu quá trình tải
                                                setTimeout(() => {
                                                    setIsLoadmore(false);
                                                    setLimit(limit + PAGE_SIZE);
                                                }, 1000);
                                            }}
                                        >
                                            {isLoadmore ? (
                                                <span>
                                                    <i className="fa-light fa-loader animate-spin text-lg"></i>
                                                </span>
                                            ) : (
                                                <span>Show more</span>
                                            )}
                                        </button>

                                        <p className="mt-2 text-sm tracking-wider text-gray-600">
                                            Showing {limit} of{' '}
                                            {filteredProducts.length} products
                                        </p>
                                    </div>
                                )}
                                {/* <Pagination
                                    className="pt-10"
                                    currentPage={currentPage}
                                    totalCount={filteredProducts.length}
                                    pageSize={PAGE_SIZE}
                                    onPageChange={(page) =>
                                        setCurrentPage(page)
                                    }
                                /> */}
                            </div>
                        </div>
                    </React.Fragment>
                ) : (
                    <div className="flex w-full flex-wrap justify-center gap-y-10">
                        {currentCategory?.child?.map((cate) => {
                            return (
                                <React.Fragment key={cate._id}>
                                    {!currentCategory?.child?.every(
                                        (child) => child?.child?.length == 0,
                                    ) ? (
                                        <React.Fragment>
                                            {cate.child.map((cat) => {
                                                return (
                                                    <CategoryItem
                                                        key={cat._id}
                                                        category={cat}
                                                    />
                                                );
                                            })}
                                        </React.Fragment>
                                    ) : (
                                        <CategoryItem category={cate} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

const CategoryItem = ({ category }) => {
    console.log(category);
    return (
        <div className="w-1/5 px-4 text-center [&:hover_img]:scale-110">
            <Link
                to={`/shop/${category?.slug}`}
                className="mx-auto inline-block aspect-square w-full overflow-hidden"
            >
                <img
                    src={category?.imageUrl}
                    alt=""
                    className="size-full object-cover object-center transition-all duration-500"
                />
            </Link>
            <Link
                to={`/shop/${category?.slug}`}
                className="hover-text-effect mt-4 inline-block text-sm font-semibold capitalize"
            >
                {category.name}
            </Link>
        </div>
    );
};

CategoryItem.propTypes = {
    category: PropTypes.object,
};

export default Shop;
