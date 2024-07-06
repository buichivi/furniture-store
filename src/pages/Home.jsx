import { Coupon, HomeBanner, ProductCard, Slider, SliderBlog, SliderCategory } from '../components';
import { Link } from 'react-router-dom';
import useDataStore from '../store/dataStore';

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
                    <h3 className="mb-[30px] text-xl font-bold uppercase">Shop by category</h3>
                    <SliderCategory products={products} />
                </div>
                <div className="mb-[30px]">
                    <HomeBanner />
                </div>
                <div className="mb-20">
                    <Coupon />
                </div>
                <div className="mb-10">
                    <div className="mb-[30px] flex items-center justify-between">
                        <h4 className="text-center text-2xl font-semibold">Best Modern Furniture</h4>
                        <div className="text-center">
                            <Link to="/shop" className="text-base transition-colors hover:text-[#D10202]">
                                See all {'>'}
                                {'>'}
                            </Link>
                        </div>
                    </div>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {products?.map((product, index) => {
                            if (index <= 7) return <ProductCard key={index} product={product} />;
                            return null;
                        })}
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
