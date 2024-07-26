import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { lazy, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useDebounced from '../utils/useDebounced';
import apiRequest from '../utils/apiRequest';
// import SearchItem from './SearchItem';
import PropTypes from 'prop-types';
import { Suspense } from 'react';

const SearchItem = lazy(() => import('./SearchItem'));

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& là chuỗi trùng khớp
}

const LIMIT_RESULT = 3;

const Search = ({ className = '' }) => {
    const { query } = useParams();
    const [isFocus, setIsFocus] = useState();
    const [qry, setQry] = useState(query ?? '');
    const [searchedProducts, setSearchedProducts] = useState([]);
    const __query = useDebounced(qry, 700);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getSearchedProducts = async () => {
            if (__query) {
                try {
                    setLoading(true);
                    const response = await apiRequest.get('/products/search/' + __query);
                    setSearchedProducts(response.data?.products);
                    setLoading(false);
                } catch (err) {
                    console.log(err);
                }
            }
        };
        getSearchedProducts();
    }, [__query]);

    return (
        <div
            className={`relative ${className}`}
            onBlur={() => {
                setIsFocus(false);
            }}
        >
            <input
                type="text"
                value={qry}
                onChange={(e) => setQry(e.currentTarget.value)}
                onKeyDown={(e) => {
                    if (e.which == 13) {
                        navigate('/search/' + qry);
                    }
                }}
                onFocus={() => setIsFocus(true)}
                placeholder="SEARCH"
                className="h-auto w-full border border-gray-400 bg-transparent py-2 pl-12 pr-4 text-sm tracking-wider outline-none focus:bg-white"
            />
            {qry && !loading && (
                <XMarkIcon
                    className="absolute right-2 top-1/2 size-5 -translate-y-1/2"
                    onClick={(e) => {
                        e.preventDefault();
                        e.currentTarget.previousElementSibling.focus();
                        setQry('');
                    }}
                />
            )}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 cursor-pointer text-lg">
                {loading && <i className="fa-duotone fa-spinner-third fa-spin [--fa-animation-duration:1s]"></i>}
            </div>
            <div
                className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer text-lg"
                onClick={() => qry && navigate('/search/' + qry)}
            >
                <label className="cursor-pointer text-xl hover:opacity-70" htmlFor="search-short-form">
                    <MagnifyingGlassIcon className="size-5" />
                </label>
            </div>
            <div
                className={`${isFocus ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-5 opacity-0'} absolute left-0 top-full z-50 h-auto w-full  bg-white p-4 text-sm tracking-wide  shadow-md transition-all duration-500`}
                onMouseDown={(e) => {
                    e.preventDefault();
                }}
            >
                {searchedProducts.length == 0 && <p className="text-center text-sm italic">Type something to search</p>}
                <div className={`flex flex-col gap-8`}>
                    {searchedProducts.slice(0, LIMIT_RESULT).map((product, index) => {
                        const item = {
                            ...product,
                            name: product?.name?.replace(
                                new RegExp(`(${escapeRegExp(__query)})`, 'gi'), // Tìm từ khóa với biểu thức chính quy không phân biệt hoa thường
                                `<span class="text-[#d10202] font-bold">$1</span>`, // Thay thế với HTML làm nổi bật
                            ),
                        };
                        return (
                            <Suspense fallback={null} key={index}>
                                <SearchItem item={item} />
                            </Suspense>
                        );
                    })}
                </div>
                {searchedProducts.length > LIMIT_RESULT && !loading && (
                    <div className="mt-4 text-center">
                        <Link to={`/search/${__query}`} className="hover-text-effect text-sm font-bold uppercase">
                            View all <span>{searchedProducts.length}</span> results
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

Search.propTypes = {
    className: PropTypes.string,
};

export default Search;
