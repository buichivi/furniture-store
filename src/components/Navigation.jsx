import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

const Navigation = ({ isShowPageName = true, paths = '', isSearchPage = false }) => {
    const { brand, tag, query, productSlug } = useParams();

    const pathNames = useMemo(() => {
        if (paths.charAt(paths.length - 1) == '/') {
            return paths.slice(0, paths.length - 1).split('/');
        } else return paths.split('/');
    }, [paths]);

    return (
        <div className="py-14">
            <div className="mb-6 flex justify-center">
                {pathNames
                    .map((path, index) => {
                        let i = 0,
                            to = '';
                        while (i <= index) {
                            if (i != 0) to += '/' + pathNames[i];
                            else if (i == 0 && index == 0) to = '/';
                            i++;
                        }
                        return {
                            name:
                                path
                                    .split('-')
                                    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
                                    .join(' ') || 'Home',
                            to,
                        };
                    })
                    .map(({ name, to }, index) => {
                        return (
                            <div key={index} className="mr-2 flex items-center gap-2">
                                {!tag && !brand && !query && !productSlug && (
                                    <React.Fragment>
                                        {pathNames.length - 1 == index ? (
                                            <span
                                                className={`${!isSearchPage && 'capitalize'} text-black hover:no-underline`}
                                            >
                                                {name}
                                            </span>
                                        ) : (
                                            <Link to={to} className="capitalize text-[#868686] hover:underline">
                                                {name}
                                            </Link>
                                        )}
                                        {index < pathNames.length - 1 && <span className="text-[#3f3f3f]">/</span>}
                                    </React.Fragment>
                                )}
                                {(tag || brand || query || productSlug) && (
                                    <React.Fragment>
                                        {index > 0 ? (
                                            <span
                                                className={`${!isSearchPage && 'capitalize'} text-black hover:no-underline`}
                                            >
                                                {name}
                                            </span>
                                        ) : (
                                            <Link to={to} className="capitalize text-[#868686] hover:underline">
                                                {name}
                                            </Link>
                                        )}
                                        {index < pathNames.length - 1 && <span className="text-[#3f3f3f]">/</span>}
                                    </React.Fragment>
                                )}
                            </div>
                        );
                    })}
            </div>
            {isShowPageName && (
                <h3
                    className={`text-center text-4xl font-semibold ${!isSearchPage && 'capitalize'} tracking-wider text-black`}
                >
                    {pathNames.at(-1).split('-').join(' ')}
                </h3>
            )}
        </div>
    );
};

Navigation.propTypes = {
    isShowPageName: PropTypes.bool,
    paths: PropTypes.string,
    isSearchPage: PropTypes.bool,
};

export default Navigation;
