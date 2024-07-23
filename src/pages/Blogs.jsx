import { useState } from 'react';
import { Navigation } from '../components';
import moment from 'moment';
import { Link } from 'react-router-dom';
import useDataStore from '../store/dataStore';

const PAGE_SIZE = Number(import.meta.env.VITE_PAGE_SIZE || 10);

const Blogs = () => {
    const { blogs } = useDataStore();
    const [limit, setLimit] = useState(PAGE_SIZE);
    const [isLoadmore, setIsLoadmore] = useState(false);

    // const [currentPage, setCurrentPage] = useState(1);
    // useEffect(() => {
    //     window.scrollTo(0, 0);
    // }, [currentPage]);
    // const currentData = useMemo(() => {
    //     const firstPageIndex = (currentPage - 1) * PAGE_SIZE;
    //     const lastPageIndex = firstPageIndex + PAGE_SIZE;
    //     return blogs.slice(firstPageIndex, lastPageIndex);
    // }, [currentPage, blogs]);

    console.log(limit);
    return (
        <div className="border-t py-content-top">
            <Navigation
                paths="/blogs"
                image="https://images.pexels.com/photos/189333/pexels-photo-189333.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            />
            <div className="container mx-auto px-5">
                <div className="mt-20 grid grid-cols-2 gap-10">
                    {blogs.map((blog, index) => {
                        if (index + 1 > limit) return null;
                        return (
                            <div key={index}>
                                <div className="relative aspect-[1/0.7] w-full overflow-hidden [&:hover>a>img]:scale-110">
                                    <span className="absolute left-0 top-0 z-10 m-8 bg-white px-3 py-1 text-sm uppercase">
                                        {moment(blog?.createdAt).format('ll')}
                                    </span>
                                    <Link to={`/blogs/${blog?.slug}`} className="block">
                                        <img
                                            src={blog.thumb}
                                            className="size-full object-cover transition-all duration-500"
                                            alt=""
                                        />
                                    </Link>
                                    <div className="absolute bottom-0 left-0 m-8 flex size-16 rounded-full transition-all duration-500 hover:scale-110">
                                        <div className="absolute left-1/2 top-1/2 z-0 inline-flex size-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#cbc3ba]"></div>
                                        <img
                                            src={blog?.author?.avatar || '/images/account-placeholder.jpg'}
                                            alt=""
                                            className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="mt-5 flex gap-1">
                                    {blog?.tags?.map((tag, index) => {
                                        return (
                                            <div key={index} className="text-[#848484]">
                                                <Link
                                                    to={`/tag/${tag?.name}`}
                                                    className="text-sm uppercase transition-colors hover:text-[#D10202]"
                                                >
                                                    {tag?.name}
                                                </Link>
                                                {index <= blog?.tags?.length - 2 && ', '}
                                            </div>
                                        );
                                    })}
                                </div>
                                <Link
                                    to={`/blogs/${blog?.slug}`}
                                    className="mt-5 inline-block text-3xl transition-colors hover:text-[#D10202]"
                                >
                                    {blog?.title}
                                </Link>
                                <p className="mt-3 text-base leading-[1.5] tracking-wide text-[#848484]">
                                    {blog?.description}
                                </p>
                                <Link
                                    to={`/blogs/${blog?.slug}`}
                                    className="hover-text-effect mt-4 text-sm font-bold uppercase"
                                >
                                    Read more
                                </Link>
                            </div>
                        );
                    })}
                </div>
                {limit <= blogs.length && (
                    <div className="mt-20 text-center">
                        <button
                            className="w-[200px] border border-black bg-black px-4 py-3 text-sm tracking-wider text-white transition-all hover:bg-white hover:text-black"
                            onClick={() => {
                                setIsLoadmore(true);
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
                            Showing {limit} of {[...blogs, ...blogs, ...blogs].length} products
                        </p>
                    </div>
                )}
                {/* <Pagination
                    className="justify-center pt-10"
                    currentPage={currentPage}
                    totalCount={blogs.length}
                    pageSize={PAGE_SIZE}
                    onPageChange={(page) => setCurrentPage(page)}
                /> */}
            </div>
        </div>
    );
};

export default Blogs;
