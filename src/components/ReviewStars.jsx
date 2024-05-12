import PropType from 'prop-types';
const ReviewStars = ({ stars = 5, size = '4px' }) => {
    const decimal = Math.floor(stars);
    const fractional = stars - decimal;
    const left_stars = 5 - decimal - Math.ceil(fractional);

    return (
        <div className="flex gap-1">
            {Array(decimal)
                .fill(0)
                ?.map((_, index) => {
                    return (
                        <span
                            key={index}
                            className={`relative`}
                            style={{
                                width: size,
                                aspectRatio: 1,
                            }}
                        >
                            <i className="fa-solid fa-star fa-sharp absolute left-0 top-1/2 -translate-y-1/2"></i>
                        </span>
                    );
                })}
            {decimal < 5 && decimal > 0 && (
                <span
                    className={`relative`}
                    style={{
                        width: size,
                        aspectRatio: 1,
                    }}
                >
                    <i
                        className="fa-solid fa-star fa-sharp absolute left-0 top-1/2 -translate-y-1/2 overflow-hidden"
                        style={{
                            width: fractional * 100 + '%',
                        }}
                    ></i>
                    <i className="fa-light fa-star fa-sharp absolute left-0 top-1/2 -translate-y-1/2"></i>
                </span>
            )}
            {Array(left_stars)
                .fill(0)
                ?.map((_, index) => {
                    return (
                        <span
                            key={index}
                            className={`relative`}
                            style={{
                                width: size,
                                aspectRatio: 1,
                            }}
                        >
                            <i className="fa-light fa-star fa-sharp absolute left-0 top-1/2 -translate-y-1/2"></i>
                        </span>
                    );
                })}
        </div>
    );
};

ReviewStars.propTypes = {
    stars: PropType.number,
    size: PropType.string,
};

export default ReviewStars;
