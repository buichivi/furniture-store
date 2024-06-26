import { Coupon, HomeBanner, ProductCard, Slider, SliderBlog, SliderCategory } from '../components';
import { Link } from 'react-router-dom';
import useDataStore from '../store/dataStore';

const Home = () => {
    const { products } = useDataStore();

    return (
        <>
            <div className="mb-[70px] bg-main">
                <div className="container mx-auto h-screen px-5">
                    <Slider />
                </div>
            </div>
            <div className="container mx-auto mb-20 px-5">
                <h3 className="mb-[30px] text-xl font-bold uppercase">Shop by category</h3>
                <SliderCategory products={products} />
            </div>
            <div className="container mx-auto mb-[30px] px-5">
                <HomeBanner />
            </div>
            <div className="container mx-auto mb-20 px-5">
                <Coupon />
            </div>
            <div className="container mx-auto mb-10 px-5">
                <div className="mb-[30px] flex items-center justify-between">
                    <h4 className="text-center text-2xl font-medium">Best Modern Furniture</h4>
                    <div className="text-center">
                        <Link className="text-base transition-colors hover:text-[#D10202]">
                            See all {'>'}
                            {'>'}
                        </Link>
                    </div>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {products?.map((product, index) => {
                        return <ProductCard key={index} product={product} />;
                    })}
                </div>
            </div>
            <div className="container mx-auto mb-20 px-5">
                <SliderBlog />
            </div>
        </>
    );
};

export default Home;
