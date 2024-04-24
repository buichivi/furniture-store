import PropType from "prop-types";
const ReviewStars = ({ stars = 5 }) => {
    const decimal = Math.floor(stars);
    const fractional = stars - decimal;
    const left_stars = 5 - decimal - Math.ceil(fractional);
    
    return (
        <div className="flex gap-1">
            {Array(decimal)
                .fill(0)
                .map((_, index) => {
                    return <i key={index} className="fa-solid fa-star"></i>;
                })}
            {decimal < 5 && (
                <span className="relative size-4">
                    <i
                        className="fa-solid fa-star absolute left-0 top-0 overflow-hidden"
                        style={{
                            width: fractional * 100 + "%",
                        }}
                    ></i>
                    <i className="fa-light fa-star absolute left-0 top-0"></i>
                </span>
            )}
            {Array(left_stars)
                .fill(0)
                .map((_, index) => {
                    return <i key={index} className="fa-light fa-star"></i>;
                })}
        </div>
    );
};

ReviewStars.propTypes = {
    stars: PropType.number,
};

export default ReviewStars;
