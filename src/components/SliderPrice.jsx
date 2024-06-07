import { useEffect, useRef, useState } from 'react';
import PropType from 'prop-types';
import useDebounced from '../utils/useDebounced';

const SliderPrice = ({ min = 0, max = 2000, onChange = () => {}, resetPrice = false }) => {
    const [range, setRange] = useState({ min, max });
    const rangePrice = useDebounced(range, 500);
    const progress = useRef();

    useEffect(() => {
        progress.current.style.left = (range.min / max) * 100 + '%';
        progress.current.style.right = ((max - range.max) / max) * 100 + '%';
    }, [range, max]);

    useEffect(() => {
        onChange({ ...rangePrice });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rangePrice]);

    useEffect(() => {
        setRange({ min, max });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetPrice]);
    return (
        <div className="flex min-h-[80px] w-full flex-col justify-center">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex gap-2">
                    <span>$</span>
                    <input
                        type="number"
                        min={min}
                        max={max}
                        value={range.min}
                        className="w-20 border text-center text-sm outline-none"
                        onChange={(e) => {
                            setRange((prev) => ({
                                ...prev,
                                min: Number(e.target.value),
                            }));
                        }}
                    />
                </div>
                <span>-</span>
                <div className="flex gap-2">
                    <span>$</span>
                    <input
                        type="number"
                        value={range.max}
                        min={min}
                        max={max}
                        className="w-20 border text-center text-sm outline-none"
                        onChange={(e) =>
                            setRange((prev) => ({
                                ...prev,
                                max: Number(e.target.value),
                            }))
                        }
                    />
                </div>
            </div>
            <div className="relative h-[3px] bg-[#dbdbdb]">
                <div ref={progress} className="absolute left-0 right-0 top-0 h-full bg-[#000]"></div>
                <input
                    type="range"
                    className="pointer-events-none absolute left-0 top-0 z-10 h-full w-full bg-transparent [-webkit-appearance:none] [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-solid [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:[-webkit-appearance:none]"
                    min={min}
                    max={max}
                    value={range.min}
                    onInput={(e) => {
                        setRange((prev) => {
                            if (e.target.value >= prev.max) {
                                return { ...prev, min: Number(prev.max) };
                            }
                            return { ...prev, min: Number(e.target.value) };
                        });
                    }}
                />
                <input
                    type="range"
                    className="pointer-events-none absolute right-0 top-0 z-10 h-full w-full bg-transparent [-webkit-appearance:none] [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-solid [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:[-webkit-appearance:none]"
                    min={min}
                    max={max}
                    value={range.max}
                    onInput={(e) => {
                        setRange((prev) => {
                            if (e.target.value <= prev.min) {
                                return { ...prev, max: Number(prev.min) };
                            }
                            return { ...prev, max: Number(e.target.value) };
                        });
                    }}
                />
            </div>
        </div>
    );
};

SliderPrice.propTypes = {
    min: PropType.number,
    max: PropType.number,
    onChange: PropType.func,
};

export default SliderPrice;
