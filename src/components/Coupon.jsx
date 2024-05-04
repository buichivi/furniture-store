const Coupon = () => {
    return (
        <div className="group/coupon relative h-[200px]">
            <div className="absolute left-0 top-0 flex h-full w-full items-center gap-[40px] p-[40px]">
                <span className="text-6xl font-bold">10%</span>
                <div className="flex flex-col justify-between">
                    <h3 className="text-3xl font-normal capitalize tracking-wider">Get more pay less</h3>
                    <p className="text-xl">
                        On orders $500 + use coupon code: <span className="font-bold">WSD10</span>
                    </p>
                </div>
            </div>
            <div className="h-full w-full bg-coupon bg-cover bg-center bg-no-repeat transition-all duration-700 group-hover/coupon:bg-[40%_60%]" />
        </div>
    );
};

export default Coupon;
