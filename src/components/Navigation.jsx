import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Navigation = ({ isShowPageName = true, paths = '', isSearchPage = false }) => {
    let pathNames;
    if (paths.charAt(paths.length - 1) == '/') {
        pathNames = paths.slice(0, paths.length - 1).split('/');
    } else pathNames = paths.split('/');
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
                                {pathNames.length != index + 1 ? (
                                    <Link to={to} className="capitalize text-[#868686] hover:underline">
                                        {name}
                                    </Link>
                                ) : (
                                    <span className={`${!isSearchPage && 'capitalize'} text-black hover:no-underline`}>
                                        {name}
                                    </span>
                                )}
                                {index < pathNames.length - 1 && <span className="text-[#3f3f3f]">/</span>}
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
