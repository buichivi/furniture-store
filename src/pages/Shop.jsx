import { useEffect, useState } from 'react';
import { Filter, Navigation, ProductCard, SliderCategory } from '../components';
import apiRequest from '../utils/apiRequest';

const Shop = () => {
    const [isDisplayGrid, setIsDisplayGrid] = useState(true);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        apiRequest
            .get('/products')
            .then((res) => setProducts(res.data.products))
            .catch((err) => console.log(err.response.data.error));
    }, []);

    return (
        <div className="mt-[90px] border-t">
            <div className="container mx-auto px-5">
                <Navigation />
                <div className="mb-16">
                    <SliderCategory />
                </div>
                <div className="flex gap-8 border-t py-16">
                    <div className="shrink-0 basis-1/4">
                        <Filter />
                    </div>
                    <div className="flex flex-1 flex-col">
                        <div className="mb-16 flex max-h-10 flex-1 items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span
                                    className={`cursor-pointer text-3xl ${!isDisplayGrid && 'text-[#D10202]'} transition-colors hover:text-[#D10202]`}
                                    onClick={() => setIsDisplayGrid(false)}
                                >
                                    <i className="fa-light fa-diagram-cells"></i>
                                </span>
                                <span
                                    className={`cursor-pointer text-3xl ${isDisplayGrid && 'text-[#D10202]'} transition-colors hover:text-[#D10202]`}
                                    onClick={() => setIsDisplayGrid(true)}
                                >
                                    <i className="fa-light fa-grid-2"></i>
                                </span>
                            </div>
                            <div className="flex items-center gap-6">
                                <label className="flex cursor-pointer select-none items-center gap-4 bg-[#EFEFEF] px-4 py-2">
                                    <input
                                        type="checkbox"
                                        className="hidden [&:checked+span]:bg-black [&:checked+span_path]:[stroke-dashoffset:0] [&:checked+span_path]:[stroke:#fff]"
                                    />
                                    <span className="inline-block size-5 bg-transparent ring-1 ring-[#b1b1b1] transition-colors ">
                                        <svg className="" viewBox="0 0 100 100" fill="none">
                                            <path
                                                d="m 20 55 l 20 20 l 41 -50"
                                                stroke="#000"
                                                strokeWidth="8"
                                                className="transition-all"
                                                strokeDasharray="100"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeDashoffset="100"
                                            ></path>
                                        </svg>
                                    </span>
                                    <span className="text-[15px] font-normal tracking-wide">
                                        Show only products on sale
                                    </span>
                                </label>
                                <div className="bg-[#EFEFEF] px-4 py-2 text-[15px] tracking-wide">Sort by latest</div>
                            </div>
                        </div>
                        <div
                            className={`flex-1 ${isDisplayGrid ? 'grid grid-cols-3 gap-8' : 'flex flex-col items-start gap-10'}`}
                        >
                            {products.map((product, index) => {
                                return <ProductCard key={index} product={product} isDisplayGrid={isDisplayGrid} />;
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
