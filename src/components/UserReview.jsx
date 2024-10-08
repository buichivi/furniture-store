// import ReviewItem from './ReviewItem';
// import ReviewStars from './ReviewStars';
import PropTypes from 'prop-types';
import useAuthStore from '../store/authStore';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import apiRequest from '../utils/apiRequest';
import { lazy, Suspense } from 'react';

const ReviewItem = lazy(() => import('./ReviewItem'));
const ReviewStars = lazy(() => import('./ReviewStars'));

const UserReview = ({ product = {}, averageRating = 5, setProduct }) => {
  const { currentUser, token } = useAuthStore();
  // const [reviews, setReviews] = useState(product.reviews);

  const reviewForm = useFormik({
    initialValues: {
      rating: 0,
      comment: '',
    },
    validationSchema: Yup.object().shape({
      rating: Yup.number()
        .min(1, 'Rating must be greater than or equal to 1')
        .max(5)
        .required('Please select a rating'),
      comment: Yup.string().required('Comment is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      toast.promise(
        apiRequest.post('/reviews/' + product?._id, values, {
          headers: { Authorization: 'Bearer ' + token },
        }),
        {
          loading: 'Posting...',
          success: (res) => {
            resetForm();
            // setReviews((reviews) => [...reviews, { user: currentUser, ...res.data?.review }]);
            setProduct((product) => ({
              ...product,
              reviews: [...product.reviews, { user: currentUser, ...res.data?.review }],
            }));
            return res.data?.message;
          },
          error: (err) => err?.response?.data?.error,
        },
      );
    },
  });

  return (
    <div>
      <div className="mb-10 text-center">
        <h3 className="mb-5 text-xl font-bold capitalize tracking-widest lg:text-2xl">Customers Reviews</h3>
        {product?.reviews?.length > 0 ? (
          <div className="flex items-center justify-center gap-2">
            <Suspense fallback={null}>
              <ReviewStars size="16px" stars={averageRating} />
            </Suspense>
            <span>({product?.reviews?.length})</span>
          </div>
        ) : (
          <p className="text-sm lg:text-base">There are no reviews yet.</p>
        )}
      </div>
      <div>
        {product?.reviews?.map((review, index) => {
          return (
            <Suspense fallback={null} key={index}>
              <ReviewItem review={review} />
            </Suspense>
          );
        })}
      </div>
      {!currentUser?._id ? (
        <div className="py-4 text-center">
          <Link
            to={`/login?redirectPath=product/${product?.slug}`}
            className="inline-block w-fit border border-black bg-black px-4 py-3 text-white transition-colors hover:bg-white hover:text-black"
          >
            Please login to review!
          </Link>
        </div>
      ) : (
        <form onSubmit={reviewForm.handleSubmit} className="mt-14">
          <div className="mb-12">
            {product?.reviews?.length > 0 ? (
              <h3 className="mb-5 text-center text-xl font-bold tracking-wider lg:text-2xl">Add a review</h3>
            ) : (
              <h3 className="mb-5 text-center text-xl font-bold lg:text-2xl">
                Be the first to review “{product?.name}”
              </h3>
            )}
            <div className="flex items-center justify-center gap-4 text-center">
              <span>Your rating *</span>
              <div className="flex items-center gap-1 [&:hover_span_i:first-child]:hidden [&:hover_span_i:last-child]:inline-block [&_span]:text-2xl">
                {Array(5)
                  .fill(0)
                  .map((el, index) => (
                    <span
                      key={index}
                      className={`cursor-pointer [&:hover~span_i:first-child]:inline-block [&:hover~span_i:last-child]:hidden ${index + 1 <= reviewForm.values.rating && '[&_i:first-child]:hidden [&_i:last-child]:inline-block'}`}
                      onClick={() => {
                        reviewForm.setFieldValue('rating', index + 1);
                      }}
                    >
                      <i className="fa-sharp fa-light fa-star"></i>
                      <i className="fa-sharp fa-solid fa-star hidden"></i>
                    </span>
                  ))}
              </div>
            </div>
            {reviewForm.errors.rating && (
              <span className="block text-center text-xs text-red-500 lg:text-sm">{reviewForm.errors.rating}</span>
            )}
          </div>
          <div>
            {reviewForm.errors.comment && (
              <span className="text-xs text-red-500 lg:text-sm">{reviewForm.errors.comment}</span>
            )}
            <textarea
              name="comment"
              value={reviewForm.values.comment}
              onChange={reviewForm.handleChange}
              rows="7"
              spellCheck="false"
              placeholder="Your review *"
              className="mb-1 w-full resize-y border border-black px-4 py-4 outline-none placeholder:tracking-wider lg:mb-5 lg:px-6 lg:py-5"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-black py-4 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#d10202] lg:text-sm"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

UserReview.propTypes = {
  product: PropTypes.object,
  averageRating: PropTypes.number,
  setProduct: PropTypes.func,
};

export default UserReview;
