import { useEffect } from 'react';
import { Link, useRouteError } from 'react-router-dom';

const NotFound = () => {
    let error = useRouteError();
    console.error(error);

    useEffect(() => {
        document.title = '404 Not Found';
    }, []);

    return (
        <div className="container mx-auto my-16 px-5 lg:my-content-top">
            <div className="flex h-[350px] flex-col items-center justify-center lg:h-[400px]">
                <img src="/images/404.webp" alt="" />
                <p className="mt-4 text-center font-lora text-3xl font-semibold">
                    Oops, something went wrong. Sorry about that!
                </p>
                <Link
                    to="/"
                    className="mt-6 border border-black bg-black px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-white hover:text-black lg:text-sm"
                >
                    Continue shopping
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
