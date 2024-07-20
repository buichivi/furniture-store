import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    useEffect(() => {
        document.title = '404 Not Found';
    }, []);

    return (
        <div className="container mx-auto mt-content-top px-5">
            <div className="flex h-[400px] flex-col items-center justify-center">
                <img src="/images/404.webp" alt="" />
                <p className="mt-4 font-lora text-3xl font-semibold">
                    Oops, something went wrong. Sorry about that!
                </p>
                <Link
                    to="/"
                    className="mt-6 border border-black bg-black px-4 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-white hover:text-black"
                >
                    Continue shopping
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
