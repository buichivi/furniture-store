import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import useDataStore from '../store/dataStore';
import { numberWithCommas } from '../utils/format';
const SearchItem = ({ item }) => {
    const { getNavigationPath } = useDataStore();

    return (
        <div className="flex items-center justify-between gap-5">
            <Link to={getNavigationPath(item, 'product')} className="inline-block w-1/4 shrink-0">
                <img src={item?.colors?.length && item?.colors[0]?.images[0]} alt="" />
            </Link>
            <div className="flex-1">
                <Link
                    to={getNavigationPath(item, 'product')}
                    className="line-clamp-2 text-base tracking-wider transition-colors hover:text-[#d10202]"
                    dangerouslySetInnerHTML={{ __html: item?.name }}
                ></Link>
                <div>
                    <span className="font-semibold">${numberWithCommas(item?.salePrice)}</span>
                    <span className="ml-3 text-[#959595] line-through">${numberWithCommas(item.price)}</span>
                </div>
            </div>
        </div>
    );
};
SearchItem.propTypes = {
    item: PropTypes.object,
};

export default SearchItem;
