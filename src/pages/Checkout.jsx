import { Link } from 'react-router-dom';
import { Navigation } from '../components';
import StepProgress from '../components/StepProgress';
import useCartStore from '../store/cartStore';
import { numberWithCommas } from '../utils/format';
import useCategoryStore from '../store/navigationStore';

const Checkout = () => {
    const { cart } = useCartStore();
    const { getNavigationPath } = useCategoryStore();
    return (
        <div className="my-[90px] border-t">
            <div className="container mx-auto px-5">
                <Navigation paths="/checkout" />
                <div className="w-full">
                    <StepProgress />
                </div>
                <div className="flex items-start gap-10">
                    <div className="flex-1">
                        <h4>Personal Info</h4>
                    </div>
                    <div className="basis-2/5 bg-gray-100 p-6">
                        <h3 className="text-base font-semibold">Cart Summary</h3>
                        <div className="mt-4 border-b pb-2">
                            {cart?.items.map((item, index) => {
                                return (
                                    <div key={index} className="mb-4 flex h-auto items-center gap-6">
                                        <Link
                                            to={getNavigationPath(item.product, 'product')}
                                            className="inline-block shrink-0 basis-1/5 bg-white"
                                        >
                                            <img
                                                src={item?.productImage}
                                                alt={item?.product?.name}
                                                className="size-full object-contain"
                                            />
                                        </Link>
                                        <div className="flex size-full items-start justify-between">
                                            <div className="flex h-full flex-1 flex-col gap-4">
                                                <Link
                                                    to={getNavigationPath(item.product, 'product')}
                                                    className="w-fit font-semibold transition-colors hover:text-[#d10202]"
                                                >
                                                    {item?.product?.name}
                                                </Link>
                                                <div className="flex flex-col align-top">
                                                    <span className="text-sm">{item?.color?.name}d</span>
                                                    <span className="text-sm">x {item?.quantity}</span>
                                                </div>
                                            </div>
                                            <span className="font-bold">${numberWithCommas(item?.itemPrice)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
