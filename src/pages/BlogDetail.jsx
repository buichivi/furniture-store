import { Link, useParams } from 'react-router-dom';
import { Navigation } from '../components';
import { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
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
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }
}

const getRelateBlog = (id, blogs) => {
    const leftBlogs = blogs.filter((blog) => blog._id != id);
    shuffle(leftBlogs);
    return leftBlogs.slice(0, 3);
};

const BlogDetail = () => {
    const { blogSlug } = useParams();
    const { token } = useAuthStore();
    const { blogs } = useDataStore();
    const [blog, setBlog] = useState();
    const [tags, setTags] = useState([]);

    useEffect(() => {
        apiRequest
            .get('/blogs/' + blogSlug, {
                headers: { Authorization: 'Bearer ' + token },
            })
            .then((res) => setBlog(res.data?.blog))
            .catch((err) => console.log(err));
        apiRequest
            .get('/tags/', { headers: { Authorization: 'Bearer ' + token } })
            .then((res) => setTags(res.data?.tags))
            .catch((err) => console.log(err));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blogSlug]);

    console.log(location);

    return (
        <div className="border-t py-content-top">
            <div className="container mx-auto px-5">
                <Navigation
                    paths={`/blogs/${blogSlug}`}
                    isShowPageName={false}
                />
                <div className="flex items-start gap-10">
                    <div className="flex-1">
                        <div className="w-full">
                            <img
                                src={blog?.thumb}
                                alt=""
                                className="aspect-auto size-full object-cover"
                            />
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="flex gap-1">
                                {blog?.tags?.map((tag, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="text-[#848484]"
                                        >
                                            <Link
                                                to={`/tag/${tag?.name}`}
                                                className="text-sm uppercase transition-colors hover:text-[#D10202]"
                                            >
                                                {tag?.name}
                                            </Link>
                                            {index <= blog?.tags?.length - 2 &&
                                                ', '}
                                        </div>
                                    );
                                })}
                            </div>
                            <span className="m-8 bg-white px-3 py-1 text-sm uppercase">
                                {moment(blog?.createdAt).format('ll')}
                            </span>
                            <span className="text-sm text-[#848484]">
                                BY ADMIN
                            </span>
                        </div>
                        <div className="ck-content pb-8">
                            <div
                                dangerouslySetInnerHTML={{ __html: blog?.post }}
                            ></div>
                        </div>
                    </div>
                    <div className="sticky top-[120px] shrink-0 basis-1/4">
                        {getRelateBlog(blog?._id, blogs).length > 0 && (
                            <div>
                                <h4 className="text-2xl font-bold">
                                    Relate Blog
                                </h4>
                                <div className="mt-4">
                                    {getRelateBlog(blog?._id, blogs).map(
                                        (blog, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className="flex items-start gap-2"
                                                >
                                                    <Link
                                                        to={`/blog/${blog?.slug}`}
                                                        className="inline-block size-32 shrink-0"
                                                    >
                                                        <img
                                                            src={blog?.thumb}
                                                            alt=""
                                                            className="object-cover"
                                                        />
                                                    </Link>
                                                    <Link
                                                        to={`/blog/${blog?.slug}`}
                                                        className="transition-colors hover:text-[#d10202]"
                                                    >
                                                        {blog?.title}
                                                    </Link>
                                                </div>
                                            );
                                        },
                                    )}
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
