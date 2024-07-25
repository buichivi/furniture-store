import { Link, useLoaderData, useParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useEffect, useMemo, useState } from 'react';
import apiRequest from '../utils/apiRequest';
import moment from 'moment';
import '../utils/ckeditor.css';
import useDataStore from '../store/dataStore';

function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}

const getRelateBlog = (id, blogs) => {
    const leftBlogs = blogs.filter((blog) => blog._id != id);
    shuffle(leftBlogs);
    return leftBlogs.slice(0, 3);
};

const BlogDetail = () => {
    const blogData = useLoaderData();
    const { blogSlug } = useParams();
    const { blogs } = useDataStore();
    const [tags, setTags] = useState([]);

    const relatedBlogs = useMemo(() => {
        return getRelateBlog(blogData?._id, blogs);
    }, [blogs, blogData]);

    console.log(relatedBlogs);

    useEffect(() => {
        apiRequest
            .get('/tags/')
            .then((res) => setTags(res.data?.tags))
            .catch((err) => console.log(err));
    }, []);

    console.log(location);

    return (
        <div className="border-t py-16 lg:py-content-top">
            <Navigation paths={`/blogs/${blogSlug}`} isShowPageName={false} />
            <div className="container mx-auto px-5">
                <div className="flex flex-col items-start gap-10 lg:flex-row">
                    <div className="w-full flex-1">
                        <div className="w-full">
                            <img src={blogData?.thumb} alt="" className="aspect-auto size-full object-cover" />
                        </div>
                        <div className="flex items-center justify-around gap-1">
                            <div className="flex gap-1">
                                {blogData?.tags?.map((tag, index) => {
                                    return (
                                        <div key={index} className="text-[#848484]">
                                            <Link
                                                to={`/tag/${tag?.name}`}
                                                className="text-xs uppercase transition-colors hover:text-[#D10202] lg:text-sm"
                                            >
                                                {tag?.name}
                                            </Link>
                                            {index <= blogData?.tags?.length - 2 && ', '}
                                        </div>
                                    );
                                })}
                            </div>
                            <span className="m-2 bg-white px-1 py-1 text-sm uppercase lg:m-8 lg:px-3">
                                {moment(blogData?.createdAt).format('ll')}
                            </span>
                            <span className="text-sm text-[#848484]">BY ADMIN</span>
                        </div>
                        <div className="ck-content pb-8">
                            <div dangerouslySetInnerHTML={{ __html: blogData?.post }}></div>
                        </div>
                    </div>
                    <div className="shrink-0 basis-1/4 lg:sticky lg:top-[120px]">
                        {relatedBlogs.length > 0 && (
                            <div>
                                <h4 className="text-2xl font-bold">Relate Blog</h4>
                                <div className="mt-4">
                                    {relatedBlogs.map((blog, index) => {
                                        return (
                                            <div key={index} className="flex items-start gap-2">
                                                <Link
                                                    to={`/blogs/${blog?.slug}`}
                                                    className="inline-block size-32 shrink-0"
                                                >
                                                    <img src={blog?.thumb} alt="" className="object-cover" />
                                                </Link>
                                                <Link
                                                    to={`/blogs/${blog?.slug}`}
                                                    className="transition-colors hover:text-[#d10202]"
                                                >
                                                    {blog?.title}
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        <div>
                            <h4 className="text-2xl font-bold">Tags</h4>
                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                {tags.map((tag, index) => {
                                    return (
                                        <Link
                                            key={index}
                                            to={`/tag/${tag?.name}`}
                                            className="inline-block border px-3 py-1 text-sm text-gray-400 transition-all hover:bg-black hover:text-white"
                                        >
                                            {tag?.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
