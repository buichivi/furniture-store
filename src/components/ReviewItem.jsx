import PropTypes from "prop-types";
import ReviewStars from "./ReviewStars";

const ReviewItem = ({ review = {} }) => {
    return (
        <div className="flex items-center border-b py-8">
            <div className="mr-8 shrink-0 rounded-full bg-[#e9e9e9] p-2">
                <img
                    src={review?.user_img}
                    alt={review?.username}
                    className="size-[120px] rounded-full object-contain"
                />
            </div>
            <div className="flex h-full flex-col justify-around gap-5">
                <p className="text-[15px] tracking-wider text-[#848484]">{review?.user_review}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h5 className="text-sm uppercase text-black">{review?.username}</h5>
                        <span className="text-sm uppercase text-[#848484]">{review?.review_date}</span>
                    </div>
                    <div>
                        <ReviewStars stars={review?.user_rating} size="15px" />
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
