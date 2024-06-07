import { Link } from 'react-router-dom';
import { Navigation } from '../components';

const Cart = () => {
    return (
        <div className="mt-[90px] border-t">
            <div className="container mx-auto px-5">
                <Navigation isShowPageName={true} paths="/cart" />
                <div className="flex items-start">
                    <div className="flex-1">
                        <table className="w-full">
                            <thead>
                                <th align="left">Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="flex w-full">
                                            <Link className="w-28 shrink-0">
                                                <img
                                                    src="https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/2022/12/08-450x572.jpg"
                                                    className="h-auto w-full object-contain"
                                                />
                                            </Link>
                                            <Link className="flex-1 text-wrap">
                                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste architecto
                                                porro debitis cupiditate eius! Minus doloremque quisquam fugiat id cum.
                                            </Link>
                                        </div>
                                    </td>
                                    <td>$1999</td>
                                    <td>10</td>
                                    <td>$1999</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="basis-1/3"></div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
