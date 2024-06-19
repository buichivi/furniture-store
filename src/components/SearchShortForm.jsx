import React, { useEffect, useRef, useState } from 'react';
import SearchItem from './SearchItem';
import { Link } from 'react-router-dom';
import useDebounced from '../utils/useDebounced';
import apiRequest from '../utils/apiRequest';

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& là chuỗi trùng khớp
}

const LIMIT_RESULT = 5;

const SearchShortForm = () => {
    const [query, setQuery] = useState('');
    const [searchedProducts, setSearchedProducts] = useState([]);
    const _query = useDebounced(query, 700);
    const [loading, setLoading] = useState(false);
    const labelSearchForm = useRef();
    useEffect(() => {
        const getSearchedProducts = async () => {
            if (_query) {
                try {
                    setLoading(true);
                    const response = await apiRequest.get('/products/search/' + _query);
                    setSearchedProducts(response.data?.products);
                    setLoading(false);
                } catch (err) {
                    console.log(err);
                }
            }
        };
        getSearchedProducts();
    }, [_query]);

    return (
        <React.Fragment>
            <input
                type="checkbox"
                className="peer/search-short-form hidden [&:checked+div>div]:translate-x-0 [&:checked+div>label]:opacity-100"
                id="search-short-form"
            />
            <div className="pointer-events-none invisible fixed right-0 top-0 z-[60] h-screen w-screen peer-checked/search-short-form:pointer-events-auto peer-checked/search-short-form:visible">
                <label
                    htmlFor="search-short-form"
                    className="block h-full w-full bg-[#3f3f3f80] opacity-0 transition-all duration-500"
                ></label>
                <div className="absolute right-0 top-0 h-full w-[400px] translate-x-full overflow-y-auto bg-white p-[30px] transition-all duration-500 [scrollbar-width:thin] 2xl:w-1/5">
                    <div className="mb-8 flex items-center justify-between">
                        <h4>Search for products ({searchedProducts?.length})</h4>
                        <label ref={labelSearchForm} htmlFor="search-short-form" className="cursor-pointer text-2xl">
                            <i className="fa-light fa-xmark"></i>
                        </label>
                    </div>
                    <div className="relative mb-6">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.currentTarget.value)}
                            placeholder="Search for products..."
                            className="h-[50px] w-full border border-gray-400 py-3 pl-4 pr-14 outline-none"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 cursor-pointer text-lg">
                            {loading ? (
                                <i className="fa-duotone fa-spinner-third fa-spin [--fa-animation-duration:1s]"></i>
                            ) : (
                                <Link to={`/search?query=${_query}`} onClick={() => labelSearchForm.current.click()}>
                                    <i className="fa-light fa-magnifying-glass"></i>
                                </Link>
                            )}
                        </div>
                    </div>
                    <div
                        className={`mb-8 flex flex-col gap-8 ${!loading ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} transition-all duration-1000`}
                    >
                        {searchedProducts.slice(0, LIMIT_RESULT).map((product, index) => {
                            const item = {
                                ...product,
                                name: product?.name?.replace(
                                    new RegExp(`(${escapeRegExp(_query)})`, 'gi'), // Tìm từ khóa với biểu thức chính quy không phân biệt hoa thường
                                    `<span class="text-[#d10202] font-bold">$1</span>`, // Thay thế với HTML làm nổi bật
                                ),
                            };
                            return <SearchItem key={index} item={item} />;
                        })}
                    </div>
                    {searchedProducts.length > LIMIT_RESULT && !loading && (
                        <div className="text-center">
                            <Link
                                to={`/search/${_query}`}
                                onClick={() => labelSearchForm.current.click()}
                                className="hover-text-effect text-sm font-bold uppercase"
                            >
                                View all <span>{searchedProducts.length}</span> results
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default SearchShortForm;
