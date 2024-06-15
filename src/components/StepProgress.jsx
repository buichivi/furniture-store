import { CheckIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const StepProgress = () => {
    const [steps, setSteps] = useState([true, false, false]);
    const [currentStep, setCurrentStep] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname == '/cart') {
            setCurrentStep(0);
        } else if (location.pathname == '/checkout') {
            setCurrentStep(1);
        }
    }, [location]);

    useEffect(() => {
        setSteps((steps) =>
            steps.map((step, index) => {
                if (index <= currentStep) {
                    return true;
                }
                return false;
            }),
        );
    }, [currentStep]);

    return (
        <div className="mx-auto flex w-1/2 items-center justify-center gap-1 pb-32 pt-4">
            {steps.map((step, index) => {
                return (
                    <React.Fragment key={index}>
                        <div
                            className={`relative flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full 
                                                    ${step ? 'bg-slate-200' : ''} ${index <= currentStep ? '!border-black !bg-black' : ''} ${currentStep == index ? '!border-black !bg-white' : ''} border border-slate-300 text-center leading-10 transition-colors duration-500`}
                            onClick={() => {
                                if (index == 0) navigate('/cart');
                                if (index == 1) navigate('/checkout');
                            }}
                        >
                            <span className="relative flex size-6 items-center justify-center">
                                <span
                                    className={`absolute -z-10 inline-flex h-full w-full rounded-full bg-white opacity-80 `}
                                ></span>
                                {index >= currentStep ? (
                                    <span
                                        className={`relative inline-flex  rounded-full opacity-30 transition-colors duration-500 ${step && 'text-white !opacity-100'} ${index < currentStep && 'text-white'} ${currentStep == index && '!text-black'}`}
                                    >
                                        {index + 1}
                                    </span>
                                ) : (
                                    <CheckIcon className="size-5 font-bold text-white" />
                                )}
                            </span>
                            <span className="absolute left-1/2 top-[110%] w-[120px] -translate-x-1/2 text-sm">
                                {index === 0 && 'Shopping cart'}
                                {index === 1 && 'Checkout'}
                                {index === 2 && 'Finish'}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={`relative h-[2px] flex-1 rounded-full bg-slate-200 [&.active>div]:w-full ${index < currentStep && 'active'}`}
                            >
                                <div className="absolute left-0 top-0 h-full w-0 bg-black transition-all duration-500"></div>
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default StepProgress;
