import { Link } from 'react-router-dom';
import { Navigation } from '../components';
import StepProgress from '../components/StepProgress';
import useCartStore from '../store/cartStore';
import { numberWithCommas } from '../utils/format';
import useDataStore from '../store/dataStore';
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import useAuthStore from '../store/authStore';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import apiRequest from '../utils/apiRequest';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
    { name: 'Cash Payment', value: 'cash' },
    { name: 'Paypal', value: 'paypal' },
    { name: 'VN Pay', value: 'vnpay' },
];

const Checkout = () => {
    const { currentUser } = useAuthStore();
    const { cart } = useCartStore();
    const { getNavigationPath, promoCode, setPromoCode } = useDataStore();
    const [code, setCode] = useState('');
    const [payment, setPayment] = useState('cash');
    const infoFormBtn = useRef();

    const discount = useMemo(() => {
        if (!promoCode?.type) {
            return 0;
        }
        return promoCode?.type == 'coupon'
            ? Math.floor((cart?.subTotal * promoCode?.discount) / 100)
            : promoCode?.discount;
    }, [promoCode, cart]);

    const handleApplyPromoCode = () => {
        if (code) {
            toast.promise(apiRequest.get('/promo-code/' + code), {
                loading: 'Checking...',
                success: (res) => {
                    setPromoCode(res.data.promoCode);
                    return res.data.message;
                },
                error: (err) => err?.response?.data?.error || err?.message,
            });
        }
    };

    return (
        <div className="my-[90px] border-t">
            <div className="container mx-auto px-5">
                <Navigation paths="/checkout" />
                <div className="w-full">
                    <StepProgress />
                </div>
                <div className="flex items-start gap-10">
                    <div className="flex-1">
                        {currentUser ? (
                            <React.Fragment>
                                <PersonalInfo ref={infoFormBtn} />
                                <div className="mt-4">
                                    <h4 className="text-lg font-bold">Payment Method</h4>
                                    <div className="mt-4 flex flex-col justify-start gap-4">
                                        {PAYMENT_METHODS.map((method, index) => {
                                            return (
                                                <label
                                                    key={index}
                                                    className={`flex h-16 w-2/3 cursor-pointer items-center justify-between rounded-lg border-2 p-4 transition-colors ${payment == method.value ? 'border-black' : 'border-slate-200'}`}
                                                >
                                                    <span className="flex items-center gap-4">
                                                        <input
                                                            type="radio"
                                                            name="payment"
                                                            className="accent-black"
                                                            defaultChecked={payment == method.value}
                                                            value={method.value}
                                                            onClick={() => setPayment(method.value)}
                                                        />
                                                        <span>{method.name}</span>
                                                    </span>
                                                    {method.value == 'paypal' && (
                                                        <img
                                                            src="https://1000logos.net/wp-content/uploads/2021/04/Paypal-logo.png"
                                                            alt=""
                                                            className="w-20 object-contain"
                                                        />
                                                    )}
                                                    {method.value == 'vnpay' && (
                                                        <img
                                                            src="https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg"
                                                            alt=""
                                                            className="w-20 object-contain"
                                                        />
                                                    )}
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <h4>Please login to checkout!</h4>
                                <div className="mt-4">
                                    <Link className="border border-black bg-black px-4 py-2 text-white transition-colors hover:bg-white hover:text-black">
                                        Login
                                    </Link>
                                    <Link className="ml-4 border border-black px-4 py-2 transition-colors hover:bg-black hover:text-white">
                                        Register
                                    </Link>
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                    <div className="basis-2/5 bg-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold">Cart Summary</h3>
                            <Link to="/cart" className="text-sm hover:text-[#d10202]">
                                Edit
                            </Link>
                        </div>
                        <div className="mt-6 border-b pb-4">
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
                        <div className="mt-4">
                            <div className="flex items-center justify-between py-1 text-base">
                                <span>Subtotal: </span>
                                <span>${numberWithCommas(cart?.subTotal)}</span>
                            </div>
                            <div className="flex items-center justify-between py-1 text-base">
                                <span>Shipping cost: </span>
                                <span>$10</span>
                            </div>
                            <div className="flex items-center justify-between py-1 text-base">
                                <span>Discount: </span>
                                <span>
                                    - ${discount}
                                    {promoCode?.type == 'coupon' && (
                                        <span className="text-green-400">({promoCode?.discount}%)</span>
                                    )}
                                </span>
                            </div>
                            <div
                                className={`flex items-center justify-end gap-4 py-1 text-sm ${promoCode?.code ? 'flex' : 'hidden'}`}
                            >
                                <span>
                                    Promo code: <span className="italic">{promoCode?.code}</span>
                                </span>
                                <label
                                    htmlFor="change-promo-code"
                                    className="cursor-pointer select-none transition-colors hover:text-[#d01202]"
                                >
                                    Change
                                </label>
                            </div>
                            <input
                                type="checkbox"
                                id="change-promo-code"
                                className="hidden [&:checked+div]:grid-rows-[1fr]"
                                onChange={(e) => {
                                    if (e.currentTarget.checked)
                                        e.currentTarget.previousElementSibling.children[1].textContent = 'Cancel';
                                    else e.currentTarget.previousElementSibling.children[1].textContent = 'Change';
                                }}
                            />
                            <div
                                className={`mt-2 grid transition-[grid-template-rows] duration-500 ${promoCode?.code ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`}
                            >
                                <div className="flex w-full items-center gap-4 overflow-hidden">
                                    <input
                                        type="text"
                                        className="flex-1 border border-transparent py-1 pl-4 text-base uppercase outline-none placeholder:text-sm"
                                        placeholder="Promo code"
                                        value={code}
                                        onChange={(e) => setCode(e.currentTarget.value)}
                                    />
                                    <button
                                        className={`shrink-0 basis-1/3 border border-black bg-white py-1 text-sm text-black transition-colors hover:bg-black hover:text-white ${code ? 'pointer-events-auto cursor-pointer opacity-100' : 'pointer-events-none cursor-default opacity-50'}`}
                                        onClick={() => handleApplyPromoCode()}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t py-2 text-lg font-bold">
                                <span>Total: </span>
                                <span>$999</span>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="mt-4 w-full border border-black bg-black py-4 text-sm font-semibold uppercase text-white transition-colors hover:bg-white hover:text-black"
                            onClick={() => {
                                infoFormBtn.current.click();
                            }}
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
const PersonalInfo = forwardRef(function PersonalInfo(props, ref) {
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(() => {
        axios
            .get('https://esgoo.net/api-tinhthanh/1/0.htm')
            .then((res) => setCities(res.data?.data))
            .catch((err) => console.log(err));
    }, []);

    const customerInfo = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            city: '',
            district: '',
            ward: '',
        },
        validationSchema: Yup.object().shape({
            firstName: Yup.string().required('First name is required'),
            lastName: Yup.string().required('Last name is required'),
            email: Yup.string().email('Invalid email format').required('Email is required'),
            phoneNumber: Yup.string()
                .matches(/^[0-9]{10}$/, 'Phone number should be 10 digits')
                .required('Phone number is required'),
            city: Yup.object().required('City is required'),
            district: Yup.object().required('District is required'),
            ward: Yup.object().required('Province is required'),
        }),
        onSubmit: (values) => {
            console.log(values);
        },
    });

    useEffect(() => {
        if (customerInfo.values.city?.id) {
            customerInfo.setFieldValue('district', '');
            customerInfo.setFieldValue('ward', '');
            axios
                .get(`https://esgoo.net/api-tinhthanh/2/${customerInfo.values.city.id}.htm`)
                .then((res) => setDistricts(res.data?.data))
                .catch((err) => console.log(err));
        }
        setDistricts([]);
        setWards([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerInfo.values.city]);

    useEffect(() => {
        if (customerInfo.values.district?.id) {
            axios
                .get(`https://esgoo.net/api-tinhthanh/3/${customerInfo.values.district.id}.htm`)
                .then((res) => setWards(res.data?.data))
                .catch((err) => console.log(err));
        }
    }, [customerInfo.values.district]);

    return (
        <div>
            <h4 className="text-lg font-bold">Personal Info</h4>
            <form onSubmit={customerInfo.handleSubmit} className="mt-4 w-full">
                <div className="flex w-full items-start gap-6">
                    <div className="flex flex-1 flex-col items-start">
                        <div className="mb-2 flex w-full items-center justify-between">
                            <span>First name</span>
                            {customerInfo.errors.firstName && (
                                <span className="text-sm text-[#d10202]">{customerInfo.errors.firstName}</span>
                            )}
                        </div>
                        <input
                            placeholder="Ex: John,..."
                            type="text"
                            name="firstName"
                            value={customerInfo.values.firstName}
                            onChange={customerInfo.handleChange}
                            className="w-full rounded-lg border-2 py-2 pl-4 text-sm outline-none transition-colors focus:border-black"
                        />
                    </div>
                    <div className="flex flex-1 flex-col items-start">
                        <div className="mb-2 flex w-full items-center justify-between">
                            <span>Last name</span>
                            {customerInfo.errors.lastName && (
                                <span className="text-sm text-[#d10202]">{customerInfo.errors.lastName}</span>
                            )}
                        </div>
                        <input
                            placeholder="Ex: Smith,..."
                            type="text"
                            name="lastName"
                            value={customerInfo.values.lastName}
                            onChange={customerInfo.handleChange}
                            className="w-full rounded-lg border-2 py-2 pl-4 text-sm outline-none transition-colors focus:border-black"
                        />
                    </div>
                </div>
                <div className="mt-2 flex w-full items-start gap-6">
                    <div className="flex flex-1 flex-col items-start">
                        <div className="mb-2 flex w-full items-center justify-between">
                            <span>Email address</span>
                            {customerInfo.errors.email && (
                                <span className="text-sm text-[#d10202]">{customerInfo.errors.email}</span>
                            )}
                        </div>
                        <input
                            type="email"
                            name="email"
                            value={customerInfo.values.email}
                            onChange={customerInfo.handleChange}
                            placeholder="Ex: abc@email.com"
                            className="w-full rounded-lg border-2 py-2 pl-4 text-sm outline-none transition-colors focus:border-black"
                        />
                    </div>
                    <div className="flex flex-1 flex-col items-start">
                        <div className="mb-2 flex w-full items-center justify-between">
                            <span>Phone number</span>
                            {customerInfo.errors.phoneNumber && (
                                <span className="text-sm text-[#d10202]">{customerInfo.errors.phoneNumber}</span>
                            )}
                        </div>
                        <input
                            placeholder="Ex: 0987654321"
                            type="text"
                            name="phoneNumber"
                            value={customerInfo.values.phoneNumber}
                            onChange={customerInfo.handleChange}
                            className="w-full rounded-lg border-2 py-2 pl-4 text-sm outline-none transition-colors focus:border-black"
                        />
                    </div>
                </div>
                <div className="mt-2 flex flex-col items-start">
                    <div className="mb-2 flex w-full items-center justify-between">
                        <span>Provinces/ City</span>
                        {customerInfo.errors.city && (
                            <span className="text-sm text-[#d10202]">{customerInfo.errors.city}</span>
                        )}
                    </div>
                    <select
                        className="w-full rounded-lg border-2 px-2 py-2 text-sm outline-none transition-colors focus:border-black"
                        value={customerInfo.values.city?.id}
                        onChange={(e) => {
                            const cityId = e.currentTarget.value;
                            const city = cities.find((city) => city.id == cityId);
                            customerInfo.setFieldValue('city', city);
                        }}
                    >
                        <option value="">Please select provinces/city</option>
                        {cities.map((city) => {
                            return (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className="mt-2 flex w-full items-start gap-6">
                    <div className="flex flex-1 flex-col items-start">
                        <div className="mb-2 flex w-full items-center justify-between">
                            <span>District</span>
                            {customerInfo.errors.district && (
                                <span className="text-sm text-[#d10202]">{customerInfo.errors.district}</span>
                            )}
                        </div>
                        <select
                            className="w-full rounded-lg border-2 px-2 py-2 text-sm outline-none transition-colors focus:border-black"
                            value={customerInfo.values.district?.id}
                            onChange={(e) => {
                                const districtId = e.currentTarget.value;
                                const district = districts.find((district) => district.id == districtId);
                                customerInfo.setFieldValue('district', district);
                            }}
                        >
                            <option value="">Please select district</option>
                            {districts.map((district) => {
                                return (
                                    <option key={district.id} value={district.id}>
                                        {district.name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="flex flex-1 flex-col items-start">
                        <div className="mb-2 flex w-full items-center justify-between">
                            <span>Ward</span>
                            {customerInfo.errors.ward && (
                                <span className="text-sm text-[#d10202]">{customerInfo.errors.ward}</span>
                            )}
                        </div>
                        <select
                            className="w-full rounded-lg border-2 px-2 py-2 text-sm outline-none transition-colors focus:border-black"
                            value={customerInfo.values.ward?.id}
                            onChange={(e) => {
                                const wardId = e.currentTarget.value;
                                const ward = wards.find((ward) => ward.id == wardId);
                                customerInfo.setFieldValue('ward', ward);
                            }}
                        >
                            <option value="">Please select ward</option>
                            {wards.map((ward) => {
                                return (
                                    <option key={ward.id} value={ward.id}>
                                        {ward.name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>
                <div className="mt-2 flex flex-col items-start">
                    <div className="mb-2 flex w-full items-center justify-between">
                        <span>Detail address</span>
                        {customerInfo.errors.city && (
                            <span className="text-sm text-[#d10202]">{customerInfo.errors.city}</span>
                        )}
                    </div>
                    <textarea
                        rows={5}
                        placeholder="Ex: House number, alley,..."
                        className="w-full resize-y rounded-lg border-2 p-2 outline-none transition-colors focus:border-black"
                    ></textarea>
                </div>
                <button type="submit" className="hidden" ref={ref}></button>
            </form>
        </div>
    );
});

export default Checkout;
