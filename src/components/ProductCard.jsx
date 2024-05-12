import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import PropType from 'prop-types';
import { numberWithCommas } from '../utils/format';
import { useProductQuickViewStore } from '../store/productQuickViewStore';
import { useMemo } from 'react';

const productDemo = {
    id: 1,
    is_trend: true,
    is_valid: true,
    name: 'Wood Outdoor Adirondack Chair',
    short_description: `Phasellus vitae imperdiet felis. Nam non condimentumerat. Lorem ipsum dolor sit amet, consecteturadipiscing elit. Nulla tortor arcu, consectetureleifend commodo at, consectetur eu justo.`,
    discount: 50,
    prices: [
        {
            price: 1099,
            currency: '$',
        },
        {
            price: 22000000,
            currency: 'vnd',
        },
    ],
    review: {
        average_star: 3.4,
        number_of_review: 9,
    },
    colors: [
        {
            name: 'black',
            color_thumb: 'https://demo.theme-sky.com/nooni/wp-content/uploads/2023/05/black-46x46.jpg',
            images: [
                'https://cdn.arhaus.com/product/StandardV2/201032CHMBLK_A210923.jpg?preset=ProductGrande',
                'https://cdn.arhaus.com/product/StandardV2/201032CHMBLK_B210923.jpg?preset=ProductGrande',
                'https://cdn.arhaus.com/product/StandardV2/201032CHMBLK_D210923.jpg?preset=ProductGrande',
                'https://cdn.arhaus.com/product/StandardV2/201032CHMBLK_CD210511.jpg?preset=ProductGrande',
            ],
        },
        {
            name: 'green',
            color_thumb: 'https://demo.theme-sky.com/nooni/wp-content/uploads/2023/05/green-46x46.jpg',
            images: [
                'https://cdn.arhaus.com/product/StandardV2/40HATTIECABEB_B210311.jpg?preset=ProductGrande',
                'https://cdn.arhaus.com/product/StandardV2/40HATTIECABEB_A210311.jpg?preset=ProductGrande',
                'https://cdn.arhaus.com/product/StandardV2/40HATTIECABEB_C210311.jpg?preset=ProductGrande',
                'https://cdn.arhaus.com/product/StandardV2/40HATTIECABEB_D210311.jpg?preset=ProductGrande',
            ],
        },
        {
            name: 'gray',
            color_thumb: 'https://demo.theme-sky.com/nooni/wp-content/uploads/2023/05/grey-46x46.jpg',
            images: [
                'https://cdn.arhaus.com/product/StandardV2/1072838SWBF_DS231016.jpg?preset=ProductGrande',
                'https://cdn.arhaus.com/product/StandardV2/1072838SWBF_DP231016.jpg?preset=ProductGrande',
                'https://cdn.arhaus.com/product/StandardV2/1072838SWBF_DQ231016.jpg?preset=ProductGrande',
                'https://cdn.arhaus.com/product/StandardV2/1072838SWBF_DT231016.jpg?preset=ProductGrande',
            ],
        },
        {
            name: 'teak',
            color_thumb: 'https://demo.theme-sky.com/nooni/wp-content/uploads/2023/05/teak-46x46.jpg',
            images: [
                'https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/2022/12/01-450x572.jpg',
                'https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/2023/04/01-2-450x572.jpg',
                'https://demo.theme-sky.com/nooni/wp-content/uploads/2023/04/01-3-450x572.jpg',
                'https://demo.theme-sky.com/nooni/wp-content/uploads/2023/04/01-5-450x572.jpg',
            ],
        },
    ],
};

const ProductCard = ({ product = productDemo, isDisplayGrid = true }) => {
    const { setProduct, toggleOpen } = useProductQuickViewStore();

    const isValid = useMemo(() => {
        return product?.colors?.reduce((acc, cur) => acc + cur?.stock, 0);
    }, [product]);

    return (
        <>
            <div className={`group/product w-full ${!isDisplayGrid && 'flex items-center gap-[50px]'}`}>
                <Link
                    to={`/shop/${product?.slug}`}
                    className={`group/product-img relative w-full shrink-0 overflow-hidden ${!isDisplayGrid && 'basis-[40%]'}`}
                >
                    <img
                        src={product?.colors[0]?.images[0]}
                        alt=""
                        className="h-[350px] w-full object-cover transition-all duration-500 group-hover/product-img:opacity-0"
                    />
                    <img
                        src={product?.colors[0]?.images[1]}
                        alt=""
                        className="absolute left-0 top-0 -z-10 h-[350px] w-full object-cover"
                    />
                    <div className="absolute left-0 top-0 z-10 h-full w-full p-4">
                        <span className="mr-1 bg-[#D10202] px-3 py-[2px] text-xs uppercase text-white">Hot</span>
                        {product?.discount > 0 && (
                            <span className="mr-1 bg-[#000] px-3 py-[2px] text-xs uppercase text-white">Sale</span>
                        )}
                        {isValid && (
                            <span className="bg-[#919191] px-3 py-[2px] text-xs uppercase text-white">Sold out</span>
                        )}
                    </div>
                    <div className="absolute right-0 top-0 z-10 h-full w-full">
                        <div className="absolute left-0 top-0 z-20 flex h-full w-full flex-col">
                            <div className="flex flex-1 flex-col items-end justify-end gap-4 p-4">
                                <Tippy
                                    content="Quick view"
                                    placement="left"
                                    className="!bg-[#D10202] px-3 !text-sm [&.tippy-box[data-placement^=left]>.tippy-arrow:before]:border-l-[#D10202]"
                                >
                                    <div
                                        className="flex size-9 translate-y-3 cursor-pointer items-center justify-center rounded-full bg-white text-base opacity-0 transition-all delay-100  hover:bg-[#D10202] hover:text-white group-hover/product:translate-y-0 group-hover/product:opacity-100"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setProduct(product);
                                            toggleOpen(true);
                                        }}
                                    >
                                        <label htmlFor={'product-quick-view-' + product?.id}></label>
                                        <i className="fa-light fa-magnifying-glass"></i>
                                    </div>
                                </Tippy>
                                <Tippy
                                    content="Compare"
                                    placement="left"
                                    className="!bg-[#D10202] px-3 !text-sm [&.tippy-box[data-placement^=left]>.tippy-arrow:before]:border-l-[#D10202]"
                                    hideOnClick={false}
                                >
                                    <div
                                        className="flex size-9 translate-y-3 cursor-pointer items-center justify-center rounded-full bg-white text-base opacity-0 transition-all delay-[50]  hover:bg-[#D10202] hover:text-white group-hover/product:translate-y-0 group-hover/product:opacity-100"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <i className="fa-light fa-code-compare"></i>
                                    </div>
                                </Tippy>
                                <Tippy
                                    content="Wishlist"
                                    placement="left"
                                    className="!bg-[#D10202] px-3 !text-sm [&.tippy-box[data-placement^=left]>.tippy-arrow:before]:border-l-[#D10202]"
                                    hideOnClick={false}
                                >
                                    <div
                                        className="flex size-9 translate-y-3 cursor-pointer items-center justify-center rounded-full bg-white text-base opacity-0 transition-all  hover:bg-[#D10202] 
                                hover:text-white group-hover/product:translate-y-0 group-hover/product:opacity-100"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <i className="fa-sharp fa-light fa-heart"></i>
                                    </div>
                                </Tippy>
                            </div>
                            <div
                                to="/product"
                                className={`w-full translate-y-3 bg-white py-3 text-center text-sm font-semibold uppercase text-black opacity-0 transition-all ease-out hover:bg-[#D10202] hover:text-white group-hover/product:translate-y-0 group-hover/product:opacity-100 ${!isDisplayGrid && 'hidden'}`}
                                onClick={(e) => e.preventDefault()}
                            >
                                Select options
                            </div>
                        </div>
                        <div
                            className={`absolute bottom-0 right-4 flex size-10 items-center justify-center text-xl opacity-100 transition-all duration-500 group-hover/product:pointer-events-none group-hover/product:opacity-0 ${!isDisplayGrid && 'bottom-4'}`}
                        >
                            <i className="fa-sharp fa-light fa-heart "></i>
                        </div>
                    </div>
                </Link>
                <div className="mt-4">
                    <Link
                        className={`mb-3 line-clamp-2 cursor-pointer text-base tracking-wide transition-colors hover:text-[#D10202] ${!isDisplayGrid && '!text-2xl font-medium'}`}
                    >
                        {product?.name}
                    </Link>
                    <div className={`flex items-center gap-4 text-base tracking-wide ${!isDisplayGrid && 'text-xl'}`}>
                        <span className="font-bold">
                            <span>$</span>
                            <span>{numberWithCommas(product?.salePrice)}</span>
                        </span>
                        <span className="text-[#959595] line-through">
                            <span>$</span>
                            <span>{numberWithCommas(product?.price)}</span>
                        </span>
                    </div>
                    {!isDisplayGrid && (
                        <>
                            <p className="mt-6 text-[#848484]">{product?.short_description}</p>
                            <button className="mt-6 bg-black px-24 py-4 text-base font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#D10202]">
                                Add to cart
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

ProductCard.propTypes = {
    product: PropType.object,
    isDisplayGrid: PropType.bool,
};

export default ProductCard;
