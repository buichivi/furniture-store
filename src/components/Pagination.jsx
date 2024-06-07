import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { usePagination, DOTS } from '../utils/usePagination';
import PropTypes from 'prop-types';

const Pagination = (props) => {
    const { onPageChange, totalCount, siblingCount = 1, currentPage, pageSize, className } = props;

    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize,
    });

    if (currentPage === 0 || paginationRange.length < 2) {
        return null;
    }

    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    let lastPage = paginationRange[paginationRange.length - 1];
    return (
        <ul className={`flex items-center gap-4 ${className}`}>
            <li
                className={`flex size-8 cursor-pointer items-center justify-center transition-colors hover:bg-black hover:text-white ${currentPage == 1 && 'hidden'}`}
                onClick={onPrevious}
            >
                <ChevronLeftIcon className="size-4" />
            </li>
            {paginationRange.map((pageNumber, index) => {
                if (pageNumber === DOTS) {
                    return (
                        <li className="pagination-item dots" key={index}>
                            &#8230;
                        </li>
                    );
                }

                return (
                    <li
                        key={index}
                        className={`${pageNumber == currentPage ? 'bg-black text-white' : 'opacity-50'} flex size-8 cursor-pointer items-center justify-center transition-colors hover:bg-black hover:text-white`}
                        onClick={() => onPageChange(pageNumber)}
                    >
                        {pageNumber}
                    </li>
                );
            })}
            <li
                className={`flex size-8 cursor-pointer items-center justify-center transition-colors hover:bg-black hover:text-white ${currentPage == lastPage && 'hidden'}`}
                onClick={onNext}
            >
                <ChevronRightIcon className="size-4" />
            </li>
        </ul>
    );
};

Pagination.propTypes = {
    onPageChange: PropTypes.func,
    totalCount: PropTypes.number,
    siblingCount: PropTypes.number,
    currentPage: PropTypes.number,
    pageSize: PropTypes.number,
    className: PropTypes.string,
};

export default Pagination;
