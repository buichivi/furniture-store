import { useState } from "react";
import ReviewItem from "./ReviewItem";
import ReviewStars from "./ReviewStars";
import PropTypes from "prop-types";

const UserReview = ({ product = {} }) => {
    const [rating, setRating] = useState(0);

    return (
        <div>
            <div className="mb-10 text-center">
                <h3 className="mb-5 text-2xl font-bold capitalize tracking-widest">Customers Reviews</h3>
                <div className="flex items-center justify-center gap-2">
                    <ReviewStars size="16px" stars={5} />
                    <span>({product?.review?.number_of_review})</span>
                </div>
            </div>
            <div>
                {product?.review?.reviews?.map((review, index) => {
                    return <ReviewItem key={index} review={review} />;
                })}
            </div>
            <div className="mt-14">
                <div className="mb-12">
                    <h3 className="mb-5 text-center text-2xl font-bold tracking-wider">Add a review</h3>
                    <p className="mb-6 text-center tracking-wider">
                        Your email address will not be published. Required fields are marked *
                    </p>
                    <div className="flex items-center justify-center gap-4 text-center">
                        <span>Your rating *</span>
                        <div className="flex items-center gap-1 [&:hover_span_i:first-child]:hidden [&:hover_span_i:last-child]:inline-block [&_span]:text-2xl">
                            {Array(5)
                                .fill(0)
                                .map((el, index) => (
                                    <span
                                        key={index}
                                        className={`cursor-pointer [&:hover~span_i:first-child]:inline-block [&:hover~span_i:last-child]:hidden ${index + 1 <= rating && "[&_i:first-child]:hidden [&_i:last-child]:inline-block"}`}
                                        onClick={() => setRating(index + 1)}
                                    >
                                        <i className="fa-sharp fa-light fa-star"></i>
                                        <i className="fa-sharp fa-solid fa-star hidden"></i>
                                    </span>
                                ))}
                        </div>
                    </div>
                </div>
                <div>
                    <textarea
                        name=""
                        id=""
                        rows="7"
                        placeholder="Your review *"
                        className="mb-5 w-full resize-y border border-black px-6 py-5 outline-none placeholder:tracking-wider"
                    ></textarea>
                    <div className="mb-5 flex items-center gap-7">
                        <input
                            type="text"
                            placeholder="Name *"
                            className="flex-1 shrink-0 border border-black px-6 py-3 outline-none placeholder:tracking-wider"
                        />
                        <input
                            type="email"
                            placeholder="Email *"
                            className="flex-1 shrink-0 border border-black px-6 py-3 outline-none placeholder:tracking-wider"
                        />
                    </div>
                    <button
                        className="w-full bg-black py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#d10202]"
                        onClick={() => {
                            if (!rating) {
                                alert("Please select a rating");
                            }
                        }}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

UserReview.propTypes = {
    product: PropTypes.object,
};

export default UserReview;
