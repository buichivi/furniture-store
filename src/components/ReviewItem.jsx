import PropTypes from 'prop-types';
import ReviewStars from './ReviewStars';

const ReviewItem = ({ review = {} }) => {
    return (
        <div className="flex flex-col items-start border-b py-8 lg:flex-row lg:items-center">
            <p className="mb-2 text-[15px] tracking-wider text-[#848484] lg:hidden">{review?.comment}</p>
            <div className="flex items-center justify-between">
                <div className="mr-4 shrink-0 rounded-full bg-[#e9e9e9] p-2 lg:mr-8">
                    <img
                        src={review?.user?.avatar || '/images/account-placeholder.jpg'}
                        alt={review?.user?.firstName + ' ' + review?.user?.lastName}
                        className="size-14 rounded-full object-contain lg:size-24"
                    />
                </div>
                <div className="flex w-full flex-col items-start justify-between gap-4 lg:hidden">
                    <div className="flex flex-row items-center gap-4">
                        <h5 className="text-xs uppercase text-black">
                            {review?.user?.firstName + ' ' + review?.user?.lastName}
                        </h5>
                        <span className="inline-block !text-xs !font-normal text-[#818181]">{review?.createdAt}</span>
                    </div>
                    <div>
                        <ReviewStars stars={review?.rating} size="15px" />
                    </div>
                </div>
            </div>
            <div className="hidden h-full flex-1 flex-col justify-around gap-5 lg:flex">
                <p className="text-[15px] tracking-wider text-[#848484]">{review?.comment}</p>
                <div className="flex w-full items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <h5 className="text-sm uppercase text-black">
                            {review?.user?.firstName + ' ' + review?.user?.lastName}
                        </h5>
                        <span className="text-sm uppercase text-[#848484]">{review?.createdAt}</span>
                    </div>
                    <div>
                        <ReviewStars stars={review?.rating} size="15px" />
                    </div>
                </div>
            </div>
        </div>
    );
};

ReviewItem.propTypes = {
    review: PropTypes.object,
};

export default ReviewItem;
