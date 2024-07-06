import { useEffect, useMemo, useState } from 'react';
import { Navigation, Pagination } from '../components';
import moment from 'moment';
import { Link } from 'react-router-dom';
import useDataStore from '../store/dataStore';

const PAGE_SIZE = import.meta.env.VITE_PAGE_SIZE || 10;

const Blog = () => {
    const { blogs } = useDataStore();
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    const currentData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PAGE_SIZE;
        const lastPageIndex = firstPageIndex + PAGE_SIZE;
        return blogs.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, blogs]);
    return (
        <div className="py-header border-t">
            <div className="container mx-auto px-5">
                <div className="relative">
                    <img
                        src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1467&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt=""
                        className="absolute left-0 top-0 -z-10 size-full object-cover"
                    />
                    <Navigation paths="/blog" />
                </div>

                <div className="mt-20 grid grid-cols-2 gap-10">
                    {currentData.map((blog, index) => {
                        return (
                            <div key={index}>
                                <div className="relative aspect-[1/0.7] w-full overflow-hidden [&:hover>a>img]:scale-110">
                                    <span className="absolute left-0 top-0 z-10 m-8 bg-white px-3 py-1 text-sm uppercase">
                                        {moment(blog?.createdAt).format('ll')}
                                    </span>
                                    <Link to={`/blog/${blog?.slug}`} className="block">
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
                                    to={`/blog/${blog?.slug}`}
                                    className="mt-5 inline-block text-3xl transition-colors hover:text-[#D10202]"
                                >
                                    {blog?.title}
                                </Link>
                                <p className="mt-3 text-base leading-[1.5] tracking-wide text-[#848484]">
                                    {blog?.description}
                                </p>
                                <Link to={`/blog/${blog?.slug}`} className="hover-text-effect mt-4 font-bold uppercase">
                                    Read more
                                </Link>
                            </div>
                        );
                    })}
                </div>
                <Pagination
                    className="justify-center pt-10"
                    currentPage={currentPage}
                    totalCount={blogs.length}
                    pageSize={PAGE_SIZE}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    );
};

export default Blog;
