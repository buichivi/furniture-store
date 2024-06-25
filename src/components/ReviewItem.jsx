import PropTypes from 'prop-types';
import ReviewStars from './ReviewStars';

const ReviewItem = ({ review = {} }) => {
    return (
        <div className="flex items-center border-b py-8">
            <div className="mr-8 shrink-0 rounded-full bg-[#e9e9e9] p-2">
                <img
                    src={review?.user?.avatar || '/images/account-placeholder.jpg'}
                    alt={review?.user?.firstName + ' ' + review?.user?.lastName}
                    className="size-24 rounded-full object-contain"
                />
            </div>
            <div className="flex h-full flex-1 flex-col justify-around gap-5">
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
