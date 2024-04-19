import { Link } from "react-router-dom";

const SearchItem = () => {
    return (
        <div className="flex items-center justify-between gap-5">
            <div className="shrink-0 basis-[25%]">
                <img
                    src="https://demo.theme-sky.com/nooni/wp-content/uploads/2022/12/20-450x572.jpg"
                    alt=""
                />
            </div>
            <div>
                <Link className="text-lg tracking-wider transition-colors hover:text-[#d10202]">
                    Rectangular Metal And Stone Table
                </Link>
                <div>
                    <span className="font-bold">$1,399</span>
                    <span className="ml-3 text-[#959595] line-through">
                        $2,099
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SearchItem;
