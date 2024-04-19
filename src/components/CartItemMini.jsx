import { useState } from "react";
import { Link } from "react-router-dom";

const CartItemMini = () => {
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="h-full w-full flex items-center justify-between gap-4">
            <div className="shrink-0 basis-[35%]">
                <img
                    src="https://demo.theme-sky.com/nooni/wp-content/uploads/2022/12/22-450x572.jpg"
                    alt=""
                    className="w-full object-contain"
                />
            </div>
            <div className="flex-1">
                <Link className="mb-4 inline-block text-lg tracking-wide transition-colors hover:text-[#d10202]">
                    Led Steel Floor Lamp
                </Link>
                <div className="mb-2 w-full">
                    <div className="flex w-2/5 border bg-[#EDEDED] py-1 [&>*]:flex-1 [&>*]:text-center [&>*]:text-sm">
                        <span
                            className="cursor-pointer"
                            onClick={() => {
                                if (quantity) setQuantity(quantity - 1);
                            }}
                        >
                            <i className="fa-light fa-minus"></i>
                        </span>
                        <input
                            type="number"
                            className="w-1/2 border-none bg-transparent outline-none"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                        <span
                            className="cursor-pointer"
                            onClick={() => setQuantity(quantity + 1)}
                        >
                            <i className="fa-light fa-plus"></i>
                        </span>
                    </div>
                </div>
                <span>$1,999</span>
            </div>
            <span className="cursor-pointer text-xl transition-colors hover:text-[#d10202] pr-2">
                <i className="fa-light fa-trash-xmark"></i>
            </span>
        </div>
    );
};

export default CartItemMini;
