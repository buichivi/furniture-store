const Coupon = () => {
    return (
        <div className="group/coupon relative h-[400px] lg:h-[200px]">
            <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center gap-[40px] px-5 py-10 lg:flex-row lg:p-[40px]">
                <span className="text-6xl font-bold">10%</span>
                <div className="flex flex-col justify-between">
                    <h3 className="text-center text-2xl font-semibold capitalize tracking-wider lg:text-left lg:text-3xl lg:font-normal">
                        Get more pay less
                    </h3>
                    <p className="mt-4 text-center text-base lg:mt-0 lg:text-left lg:text-xl">
                        On orders $500 + use coupon code: <span className="font-bold">WSD10</span>
                    </p>
                </div>
            </div>
            <div className="h-full w-full bg-coupon bg-cover bg-right bg-no-repeat transition-all duration-700 lg:bg-center lg:group-hover/coupon:bg-[40%_60%]" />
        </div>
    );
};

export default Coupon;
