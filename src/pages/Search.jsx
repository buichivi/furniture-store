import { useEffect, useMemo, useState } from 'react';
import { Filter, Navigation, Pagination, ProductCard } from '../components';
import { useParams } from 'react-router-dom';
import useDataStore from '../store/dataStore';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import apiRequest from '../utils/apiRequest';

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

const PAGE_SIZE = 4;

const Search = () => {
    const { query } = useParams();
    const [isDisplayGrid, setIsDisplayGrid] = useState(true);
    const { categories, getNavigationPath } = useDataStore();
    const { parentCategorySlug, categorySlug } = useParams();
    const [filters, setFilters] = useState({ typeFilters: [], colorsFilters: [], priceRange: [], materialFilters: [] });
    const [onSaleOnly, setOnSaleOnly] = useState(false);
    const [resetPrice, setResetPrice] = useState(false);
    const [key, setKey] = useState(0);
    const [openState, setOpenState] = useState(FILTER_OPEN_STATE);
    const [sort, setSort] = useState(SORT_OPTIONS[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchedProducts, setSearchedProducts] = useState([]);

    useEffect(() => {
        if (query) {
            apiRequest
                .get('/products/search/' + query)
                .then((res) => setSearchedProducts(res.data?.products))
                .catch((err) => console.log(err));
        }
    }, [query]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    const filteredProducts = useMemo(() => {
        const { typeFilters, colorsFilters, priceRange, materialFilters } = filters;
        return searchedProducts
            .filter((prod) => {
                if (parentCategorySlug && !categorySlug) {
                    const parentCategory = categories.find((cate) => cate.slug == parentCategorySlug);
                    return prod.category.parentId == parentCategory._id;
                } else if (categorySlug) {
                    return prod.category.slug == categorySlug;
                }
                return prod;
            })
            .filter((prod) => {
                const typeMatch =
                    typeFilters.filter((type) => type.selected) == 0 ||
                    typeFilters.filter((type) => type.selected).find((type) => type._id == prod.category._id);
                const colorMatch =
                    colorsFilters.filter((color) => color.selected) == 0 ||
                    colorsFilters
                        .filter((color) => color.selected)
                        .some((color) => prod.colors.some((cl) => cl._id == color._id));
                const priceMatch = prod.salePrice >= priceRange[0] && prod.salePrice <= priceRange[1];
                const materialMatch =
                    materialFilters.filter((mt) => mt.selected) == 0 ||
                    materialFilters.filter((mt) => mt.selected).find((mt) => mt.name == prod.material);
                const onSaleMatch = !onSaleOnly || prod.discount;
                return typeMatch && colorMatch && priceMatch && materialMatch && onSaleMatch;
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
    }, [searchedProducts, filters, onSaleOnly, sort, categories, parentCategorySlug, categorySlug]);

    const isFiltering = useMemo(() => {
        return (
            filters?.typeFilters?.filter((type) => type.selected).length > 0 ||
            filters?.colorsFilters?.filter((color) => color.selected).length > 0 ||
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

    return (
        <div className="mt-[90px] border-t">
            <div className="relative">
                <img
                    src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                    className="absolute left-0 top-0 -z-10 size-full object-cover"
                />
                <Navigation paths={`/shop/Search results for “${query}”`} isSearchPage={true} />
            </div>
            <div className="container mx-auto px-5">
                <div className="flex gap-8 border-t py-16">
                    <div className="shrink-0 basis-1/4">
                        <Filter
                            key={key}
                            filters={filters}
                            setFilters={setFilters}
                            resetPrice={resetPrice}
                            openState={openState}
                            setOpenState={setOpenState}
                        />
                    </div>
                    <div className="flex flex-1 flex-col">
                        <div className="mb-10 flex max-h-10 flex-1 items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span
                                    className={`cursor-pointer text-2xl ${!isDisplayGrid && 'text-[#D10202]'} transition-colors hover:text-[#D10202]`}
                                    onClick={() => setIsDisplayGrid(false)}
                                >
                                    <i className="fa-light fa-diagram-cells"></i>
                                </span>
                                <span
                                    className={`cursor-pointer text-2xl ${isDisplayGrid && 'text-[#D10202]'} transition-colors hover:text-[#D10202]`}
                                    onClick={() => setIsDisplayGrid(true)}
                                >
                                    <i className="fa-light fa-grid-2"></i>
                                </span>
                            </div>
                            <div className="flex items-center gap-6">
                                <label className="flex cursor-pointer select-none items-center gap-4 bg-[#EFEFEF] px-4 py-2">
                                    <input
                                        type="checkbox"
                                        checked={onSaleOnly}
                                        onChange={(e) => setOnSaleOnly(e.currentTarget.checked)}
                                        className="hidden [&:checked+span]:bg-black [&:checked+span_path]:[stroke-dashoffset:0] [&:checked+span_path]:[stroke:#fff]"
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
                                            const sortIcon = e.currentTarget.previousElementSibling.children[1];
                                            if (e.currentTarget.checked) sortIcon.classList.add('rotate-180');
                                            else sortIcon.classList.remove('rotate-180');
                                        }}
                                    />
                                    <div className="pointer-events-none absolute left-0 top-[115%] z-20 flex w-full translate-y-10 flex-col gap-2 border border-gray-100 bg-white px-4 py-2 opacity-0 shadow-lg transition-all duration-500 [&>*:hover]:cursor-pointer [&>*:hover]:opacity-50 [&>*]:text-sm [&>*]:transition-all">
                                        {SORT_OPTIONS.map((op, index) => {
                                            return (
                                                <span
                                                    key={index}
                                                    onClick={(e) => {
                                                        const input =
                                                            e.currentTarget.parentElement.previousElementSibling;
                                                        input.checked = !input.checked;
                                                        setSort(op);
                                                    }}
                                                    className="py-1"
                                                >
                                                    {op.name}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-6 flex flex-wrap items-center gap-2">
                            {filters?.typeFilters?.filter((type) => type.selected).length > 0 && (
                                <div className="flex gap-2">
                                    {filters?.typeFilters
                                        ?.filter((type) => type.selected)
                                        .map((type, index) => (
                                            <div
                                                key={index}
                                                className="flex cursor-pointer items-center gap-2 bg-gray-200 px-2 py-1 transition-colors hover:bg-black hover:text-white"
                                                onClick={() => {
                                                    setFilters((filters) => ({
                                                        ...filters,
                                                        typeFilters: filters.typeFilters.map((tp) => {
                                                            return tp._id == type._id ? { ...tp, selected: false } : tp;
                                                        }),
                                                    }));
                                                }}
                                            >
                                                <span className="text-sm">Type: </span>
                                                <span className="text-sm italic">{type.name}</span>
                                                <XMarkIcon className="size-4" />
                                            </div>
                                        ))}
                                </div>
                            )}
                            {filters?.colorsFilters?.filter((color) => color.selected).length > 0 && (
                                <div className="flex gap-2">
                                    {filters?.colorsFilters
                                        ?.filter((color) => color.selected)
                                        .map((color, index) => (
                                            <div
                                                key={index}
                                                className="flex cursor-pointer items-center gap-2 bg-gray-200 px-2 py-1 transition-colors hover:bg-black hover:text-white"
                                                onClick={() => {
                                                    setFilters((filters) => ({
                                                        ...filters,
                                                        colorsFilters: filters.colorsFilters.map((cl) => {
                                                            return cl._id == color._id
                                                                ? { ...cl, selected: false }
                                                                : cl;
                                                        }),
                                                    }));
                                                }}
                                            >
                                                <span className="text-sm">Color: </span>
                                                <span className="text-sm italic">{color.name}</span>
                                                <XMarkIcon className="size-4" />
                                            </div>
                                        ))}
                                </div>
                            )}
                            {filters?.materialFilters?.filter((mt) => mt.selected).length > 0 && (
                                <div className="flex gap-2">
                                    {filters?.materialFilters
                                        ?.filter((mt) => mt.selected)
                                        .map((mt, index) => (
                                            <div
                                                key={index}
                                                className="flex cursor-pointer items-center gap-2 bg-gray-200 px-2 py-1 transition-colors hover:bg-black hover:text-white"
                                                onClick={() => {
                                                    setFilters((filters) => ({
                                                        ...filters,
                                                        materialFilters: filters.materialFilters.map((_mt) => {
                                                            return _mt._id == mt._id
                                                                ? { ..._mt, selected: false }
                                                                : _mt;
                                                        }),
                                                    }));
                                                }}
                                            >
                                                <span className="text-sm">Material: </span>
                                                <span className="text-sm italic">{mt.name}</span>
                                                <XMarkIcon className="size-4" />
                                            </div>
                                        ))}
                                </div>
                            )}
                            {filters?.priceRange?.length > 0 &&
                                (filters?.priceRange[0] > 0 || filters.priceRange[1] < 2000) && (
                                    <div
                                        className="flex cursor-pointer items-center gap-2 bg-gray-200 px-2 py-1 transition-colors hover:bg-black hover:text-white"
                                        onClick={() => {
                                            setFilters((filters) => ({ ...filters, priceRange: [0, 2000] }));
                                            setResetPrice((resetPrice) => !resetPrice);
                                        }}
                                    >
                                        <span className="text-sm">Price range: </span>
                                        <span className="text-sm italic">
                                            ${filters?.priceRange[0]} - ${filters?.priceRange[1]}
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
                                No products were found matching your selection
                            </div>
                        )}
                        <div
                            className={`flex-1 ${isDisplayGrid ? 'grid grid-cols-3 gap-8' : 'flex flex-col items-start gap-10'}`}
                        >
                            {currentData.map((product, index) => {
                                return (
                                    <ProductCard
                                        key={index}
                                        product={product}
                                        isDisplayGrid={isDisplayGrid}
                                        to={getNavigationPath(product, 'product')}
                                    />
                                );
                            })}
                        </div>
                        <Pagination
                            className="pt-10"
                            currentPage={currentPage}
                            totalCount={filteredProducts.length}
                            pageSize={PAGE_SIZE}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;
