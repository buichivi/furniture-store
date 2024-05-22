import SliderPrice from './SliderPrice';

const Filter = () => {
    return (
        <>
            <span className="mb-16 flex max-h-10 w-fit items-center gap-2 bg-[#EFEFEF] px-4 py-2 text-[15px]">
                <span className="mr-1">Filter</span>
                <i className="fa-sharp fa-light fa-sliders text-2xl"></i>
            </span>
            <div className="shrink-0 overflow-hidden transition-all duration-500">
                <div>
                    <input
                        type="checkbox"
                        className="hidden [&:checked+label+div]:grid-rows-[1fr] [&:checked+label_span:last-child>i:last-child]:opacity-0"
                        id="filter-option-1"
                    />
                    <label
                        htmlFor="filter-option-1"
                        className="flex cursor-pointer items-center justify-between bg-[#EFEFEF] px-4 py-4"
                    >
                        <span className="text-base font-bold uppercase tracking-wider">Type</span>
                        <span className="relative">
                            <i className="fa-light fa-minus"></i>
                            <i className="fa-light fa-minus absolute left-0 top-1/2 -translate-y-1/2 rotate-90 transition-opacity"></i>
                        </span>
                    </label>
                    <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500">
                        <div className="overflow-hidden">
                            <div className="flex flex-col gap-4 border px-4 py-6">
                                {[
                                    'bed',
                                    'bedroom furniture',
                                    'chair',
                                    'table',
                                    'cabinet',
                                    'home office',
                                    'lamp',
                                    'living room',
                                ].map((type, index) => {
                                    return (
                                        <label
                                            key={index}
                                            className="flex w-fit cursor-pointer select-none items-center gap-4 capitalize"
                                        >
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
                                            <span className="text-[15px] font-normal tracking-wide hover:opacity-60">
                                                {type}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t">
                    <input
                        type="checkbox"
                        className="hidden [&:checked+label+div]:grid-rows-[1fr] [&:checked+label_span:last-child>i:last-child]:opacity-0"
                        id="filter-option-2"
                    />
                    <label
                        htmlFor="filter-option-2"
                        className="flex cursor-pointer items-center justify-between bg-[#EFEFEF] px-4 py-4"
                    >
                        <span className="text-base font-bold uppercase tracking-wider">Colors</span>
                        <span className="relative">
                            <i className="fa-light fa-minus"></i>
                            <i className="fa-light fa-minus absolute left-0 top-1/2 -translate-y-1/2 rotate-90 transition-opacity"></i>
                        </span>
                    </label>
                    <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500">
                        <div className="overflow-hidden">
                            <div className="grid grid-cols-7 gap-x-4 gap-y-4 border px-4 py-6">
                                {[
                                    'red',
                                    'blue',
                                    'green',
                                    'gray',
                                    'pink',
                                    'yellow',
                                    'red',
                                    'blue',
                                    'green',
                                    'gray',
                                    'pink',
                                    'yellow',
                                ].map((color, index) => {
                                    return (
                                        <span
                                            key={index}
                                            className={`w-full cursor-pointer rounded-full shadow-md`}
                                            style={{
                                                backgroundColor: color,
                                                aspectRatio: 1,
                                            }}
                                        ></span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t">
                    <input
                        type="checkbox"
                        className="hidden [&:checked+label+div]:grid-rows-[1fr] [&:checked+label_span:last-child>i:last-child]:opacity-0"
                        id="filter-option-3"
                    />
                    <label
                        htmlFor="filter-option-3"
                        className="flex cursor-pointer items-center justify-between bg-[#EFEFEF] px-4 py-4"
                    >
                        <span className="text-base font-bold uppercase tracking-wider">Price</span>
                        <span className="relative">
                            <i className="fa-light fa-minus"></i>
                            <i className="fa-light fa-minus absolute left-0 top-1/2 -translate-y-1/2 rotate-90 transition-opacity"></i>
                        </span>
                    </label>
                    <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500">
                        <div className="overflow-hidden">
                            <div className="border px-4 py-6">
                                <SliderPrice
                                    min={0}
                                    max={2000}
                                    onChange={({ min, max }) => {
                                        console.log(min, max);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t">
                    <input
                        type="checkbox"
                        className="hidden [&:checked+label+div]:grid-rows-[1fr] [&:checked+label_span:last-child>i:last-child]:opacity-0"
                        id="filter-option-4"
                    />
                    <label
                        htmlFor="filter-option-4"
                        className="flex cursor-pointer items-center justify-between bg-[#EFEFEF] px-4 py-4"
                    >
                        <span className="text-base font-bold uppercase tracking-wider">Material</span>
                        <span className="relative">
                            <i className="fa-light fa-minus"></i>
                            <i className="fa-light fa-minus absolute left-0 top-1/2 -translate-y-1/2 rotate-90 transition-opacity"></i>
                        </span>
                    </label>
                    <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500">
                        <div className="overflow-hidden">
                            <div className="flex flex-col gap-4 border px-4 py-6">
                                {['glass', 'leather', 'metal', 'velvet', 'cabinet', 'wood'].map((type, index) => {
                                    return (
                                        <label
                                            key={index}
                                            className="flex w-fit cursor-pointer select-none items-center gap-4 capitalize"
                                        >
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
                                            <span className="text-[15px] font-normal tracking-wide hover:opacity-60">
                                                {type}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Filter;
