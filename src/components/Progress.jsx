import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Progress = () => {
    const location = useLocation();
    useEffect(() => {
        NProgress.configure({
            showSpinner: false,
        });
        NProgress.start();
        NProgress.done();
        return () => {
            NProgress.done();
        };
    }, [location.pathname]);

    return <></>;
};

export default Progress;
