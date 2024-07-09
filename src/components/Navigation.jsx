import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import useDataStore from '../store/dataStore';

const getParentCategory = (slug, categories) => {
    let category = categories.find((cate) => cate.slug == slug);
    while (category?.slug && category.parentId != '') {
        category = categories.find((cate) => cate._id == category.parentId);
    }
    return category;
};

const Navigation = ({
    isShowPageName = true,
    paths = '',
    isSearchPage = false,
    image = 'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
}) => {
    const { brand, tag, query, productSlug, categorySlug } = useParams();
    const { categories } = useDataStore();

    const pathNames = useMemo(() => {
        if (paths.charAt(paths.length - 1) == '/') {
            return paths.slice(0, paths.length - 1).split('/');
        } else return paths.split('/');
    }, [paths]);

    return (
        <div className="container mx-auto px-5">
            <div className="flex justify-start py-8 text-sm">
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
                                    .map(
                                        (p) =>
                                            p.charAt(0).toUpperCase() +
                                            p.slice(1),
                                    )
                                    .join(' ') || 'Home',
                            to,
                        };
                    })
                    .map(({ name, to }, index) => {
                        return (
                            <div
                                key={index}
                                className="mr-2 flex items-center gap-2"
                            >
                                {!tag && !brand && !query && !productSlug && (
                                    <React.Fragment>
                                        {pathNames.length - 1 == index ? (
                                            <span
                                                className={`${!isSearchPage && 'capitalize'} text-black hover:no-underline`}
                                            >
                                                {name}
                                            </span>
                                        ) : (
                                            <Link
                                                to={to}
                                                className="capitalize text-[#979797] hover:underline"
                                            >
                                                {name}
                                            </Link>
                                        )}
                                        {index < pathNames.length - 1 && (
                                            <span className="text-[#b9b9b9]">
                                                |
                                            </span>
                                        )}
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
                                            <Link
                                                to={to}
                                                className="capitalize text-[#979797] hover:underline"
                                            >
                                                {name}
                                            </Link>
                                        )}
                                        {index < pathNames.length - 1 && (
                                            <span className="text-[#b9b9b9]">
                                                |
                                            </span>
                                        )}
                                    </React.Fragment>
                                )}
                            </div>
                        );
                    })}
            </div>
            {isShowPageName ? (
                <div className="relative py-32">
                    <img
                        src={
                            getParentCategory(categorySlug, categories)
                                ?.imageUrl || image
                        }
                        alt=""
                        className="absolute left-0 top-0 size-full object-cover"
                    />
                    <h3
                        className={`text-center text-5xl font-semibold drop-shadow-lg ${!isSearchPage && 'capitalize'} font-lora tracking-wider text-white`}
                    >
                        {pathNames.at(-1).split('-').join(' ')}
                    </h3>
                </div>
            ) : (
                <div className="py-4"></div>
            )}
        </div>
    );
};

Navigation.propTypes = {
    isShowPageName: PropTypes.bool,
    paths: PropTypes.string,
    isSearchPage: PropTypes.bool,
    image: PropTypes.string,
};

export default Navigation;
