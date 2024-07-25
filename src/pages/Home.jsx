import SliderBlog from '../components/SliderBlog';
import Slider from '../components/Slider';
import HomeBanner from '../components/HomeBanner';
import Coupon from '../components/Coupon';
import SliderCategory from '../components/SliderCategory';
import { Link } from 'react-router-dom';
import useDataStore from '../store/dataStore';
import { lazy, Suspense } from 'react';

const ProductCard = lazy(() => import('../components/ProductCard'));

const Home = () => {
    const { products } = useDataStore();

    return (
        <div>
            <div className="mb-[70px] bg-main">
                <div className="container mx-auto h-screen px-5">
                    <Slider />
                </div>
            </div>
            <div className="container mx-auto px-5">
                <div className="mb-20">
                    <h3 className="mb-[30px] text-center text-base font-bold uppercase lg:text-left lg:text-xl">
                        Shop by category
                    </h3>
                    <SliderCategory products={products} />
                </div>
                <div className="mb-[30px]">
                    <HomeBanner />
                </div>
                <div className="mb-20">
                    <Coupon />
                </div>
                <div className="mb-10">
                    <div className="mb-[30px] flex items-center justify-start">
                        <h4 className="flex-1 text-center text-xl font-semibold lg:text-left lg:text-2xl">
                            Best Modern Furniture
                        </h4>
                        <div className="hidden text-center lg:inline-block">
                            <Link to="/shop" className="text-base transition-colors hover:text-[#D10202]">
                                See all {'>'}
                                {'>'}
                            </Link>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-8">
                        {products?.map((product, index) => {
                            if (index <= 7)
                                return (
                                    <Suspense fallback={null} key={index}>
                                        <ProductCard product={product} />
                                    </Suspense>
                                );
                            return null;
                        })}
                    </div>
                    <div className="mt-10 block text-center lg:hidden">
                        <Link
                            to="/shop"
                            className="inline-block border border-black bg-white px-6 py-1 text-base text-black transition-colors"
                        >
                            See all
                        </Link>
                    </div>
                </div>
                <div className="mb-20">
                    <SliderBlog />
                </div>
            </div>
        </div>
    );
};

export default Home;
