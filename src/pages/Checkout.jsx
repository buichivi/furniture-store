import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from '../components';
import StepProgress from '../components/StepProgress';
import useCartStore from '../store/cartStore';
import { numberWithCommas } from '../utils/format';
import useDataStore from '../store/dataStore';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import useAuthStore from '../store/authStore';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import apiRequest from '../utils/apiRequest';
import toast from 'react-hot-toast';
import PayPalButton from '../components/PaypalButton';
import PropTypes from 'prop-types';
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/solid';
import {
    ArrowLeftIcon,
    CreditCardIcon,
    MapPinIcon,
    PlusCircleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

const PAYMENT_METHODS = [
    { name: 'Cash On Delivery', value: 'cod' },
    { name: 'Paypal', value: 'paypal' },
    { name: 'VN Pay', value: 'vnpay' },
];

const Checkout = () => {
    const { currentUser, token } = useAuthStore();
    const { cart, setCart } = useCartStore();
    const { promoCode, setPromoCode } = useDataStore();
    const [code, setCode] = useState('');
    const [payment, setPayment] = useState('cod');
    const [order, setOrder] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const [address, setAddresses] = useState({});
    const [cities, setCities] = useState([]);
    const [isOrderCreated, setIsOrderCreated] = useState(false);

    useEffect(() => {
        axios
            .get('https://esgoo.net/api-tinhthanh/1/0.htm')
            .then((res) => setCities(res.data?.data))
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {}, [location]);

    const discount = useMemo(() => {
        if (!promoCode?.type) {
            return 0;
        }
        return promoCode?.type == 'coupon'
            ? Math.floor((cart?.subTotal * promoCode?.discount) / 100)
            : promoCode?.discount;
    }, [promoCode, cart]);

    const total = useMemo(() => {
        return (
            (cart?.subTotal >= discount ? cart?.subTotal - discount : 0) + 10
        );
    }, [discount, cart]);

    useEffect(() => {
        setAddresses(
            currentUser?.addresses?.find((add) => add?.isDefault) ?? {},
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser?._id]);

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

    const handleCreateOrder = (
        paymentStatus = 'unpaid',
        paymentMethod = payment,
    ) => {
        // eslint-disable-next-line no-unused-vars
        const { _id, isDefault, ...rest } = address;

        const data = {
            totalAmount: total,
            shippingAddress: rest,
            paymentMethod,
            discount,
            subTotal: cart?.subTotal,
            shippingFee: 10,
            paymentStatus,
        };
        if (promoCode?._id) {
            data.promoCode = promoCode._id;
        }
        toast.promise(
            apiRequest.post(
                '/orders',
                { ...data },
                { headers: { Authorization: `Bearer ${token}` } },
            ),
            {
                loading: 'Creating order...',
                success: (res) => {
                    setCart({ items: [] });
                    setOrder(res.data?.order);
                    setPromoCode({});
                    navigate('/checkout#success');
                    return res.data?.message;
                },
                error: (err) => {
                    console.log(err);
                    return err?.response?.data?.error;
                },
            },
        );
    };

    const handleCreateVNPayUrl = () => {
        apiRequest
            .post(
                '/orders/create-vnpay-url',
                {
                    amount: total * 25415,
                    orderInfo: 'Thanh toan don hang',
                },
                { headers: { Authorization: 'Bearer ' + token } },
            )
            .then((res) => {
                const openInNewTab = (url) => {
                    const newWindow = window.open(
                        url,
                        '_parent',
                        'noopener,noreferrer',
                    );
                    if (newWindow) newWindow.opener = null;
                };
                openInNewTab(res.data?.paymentUrl);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        if (
            location.search != '' &&
            address?._id != undefined &&
            cart?.items?.length > 0 &&
            !isOrderCreated
        ) {
            console.log('Call create order');
            apiRequest
                .get('/orders/vnpay-return' + location.search, {
                    headers: { Authorization: 'Bearer ' + token },
                })
                .then((res) => {
                    if (res.data?.code == '00') {
                        toast.success(res.data?.message);
                        handleCreateOrder('paid', 'vnpay');
                        setIsOrderCreated(true);
                    }
                })
                .catch((err) => {
                    navigate('/checkout#fail');
                    toast.error(
                        err?.response?.data?.error || 'Transaction error',
                    );
                });
        }
    }, [location, cart, isOrderCreated]);

    return (
        <div className="my-content-top border-t">
            <div className="container mx-auto px-5">
                <Navigation isShowPageName={false} paths="/checkout" />
                <div className="w-full">
                    <StepProgress />
                </div>
                {location.hash == '' && (
                    <div className="relative flex items-start gap-10">
                        {currentUser?._id == undefined && (
                            <div className="absolute left-0 top-0 z-40 flex size-full items-center justify-center bg-white/30 p-10 backdrop-blur-sm">
                                <div className="flex size-1/2 items-center justify-center bg-white shadow-md">
                                    <div className="w-fit p-4">
                                        <h4>Please login to checkout!</h4>
                                        <div className="mt-4">
                                            <Link
                                                to="/login?redirectPath=checkout"
                                                className="border border-black bg-black px-4 py-2 text-white transition-colors hover:bg-white hover:text-black"
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                to="/register?redirectPath=checkout"
                                                className="ml-4 border border-black px-4 py-2 transition-colors hover:bg-black hover:text-white"
                                            >
                                                Register
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="mb-10">
                                <SelectAddressShipping
                                    cities={cities}
                                    onChange={({ selectedAddress }) => {
                                        setAddresses(selectedAddress);
                                    }}
                                />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MapPinIcon className="size-5" />
                                        <h4 className="mt-2 text-lg font-bold">
                                            Address shipping
                                        </h4>
                                    </div>
                                    <label
                                        htmlFor="select-address"
                                        className="inline-block cursor-pointer border border-black bg-black px-4 py-1 text-white transition-colors hover:bg-white hover:text-black"
                                    >
                                        Choose address
                                    </label>
                                </div>
                                {address?._id != undefined ? (
                                    <div className="px-7">
                                        <p>
                                            Name:{' '}
                                            <span className="font-semibold">
                                                {address?.firstName +
                                                    ' ' +
                                                    address?.lastName}
                                            </span>
                                        </p>
                                        <p>
                                            Phone number:{' '}
                                            <span className="font-semibold">
                                                {address?.phoneNumber}
                                            </span>
                                        </p>
                                        <p>
                                            Email:{' '}
                                            <span className="font-semibold">
                                                {address?.email}
                                            </span>
                                        </p>
                                        <p>
                                            Address:{' '}
                                            <span className="font-semibold">
                                                {address?.addressLine},{' '}
                                                {address?.ward?.name},{' '}
                                                {address?.district?.name},{' '}
                                                {address?.city?.name}
                                            </span>
                                        </p>
                                    </div>
                                ) : (
                                    <p className="p-7">
                                        You don{"'"}t have any address.
                                    </p>
                                )}
                            </div>
                            <div className="mt-4">
                                <div className="flex items-center gap-2">
                                    <CreditCardIcon className="size-5" />
                                    <h4 className="text-lg font-bold">
                                        Payment Method
                                    </h4>
                                </div>
                                <div className="mt-4 grid grid-cols-3 gap-4">
                                    {PAYMENT_METHODS.map((method, index) => {
                                        return (
                                            <label
                                                key={index}
                                                className={`flex h-20 cursor-pointer items-center justify-between rounded-lg border-2 p-4 transition-colors ${payment == method.value ? 'border-black' : 'border-slate-200'}`}
                                            >
                                                <span className="flex w-full items-center justify-center gap-4">
                                                    <input
                                                        type="radio"
                                                        name="payment"
                                                        className="hidden accent-black"
                                                        defaultChecked={
                                                            payment ==
                                                            method.value
                                                        }
                                                        value={method.value}
                                                        onClick={() =>
                                                            setPayment(
                                                                method.value,
                                                            )
                                                        }
                                                    />
                                                    {method.value == 'cod' && (
                                                        <img
                                                            src="/images/COD.png"
                                                            alt=""
                                                            className="w-20 object-contain"
                                                        />
                                                    )}
                                                    {method.value ==
                                                        'paypal' && (
                                                        <img
                                                            src="https://1000logos.net/wp-content/uploads/2021/04/Paypal-logo.png"
                                                            alt=""
                                                            className="w-20 object-contain"
                                                        />
                                                    )}
                                                    {method.value ==
                                                        'vnpay' && (
                                                        <img
                                                            src="https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg"
                                                            alt=""
                                                            className="w-20 object-contain"
                                                        />
                                                    )}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="basis-2/5 bg-gray-100 p-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-semibold">
                                    Cart Summary
                                </h3>
                                <Link
                                    to="/cart"
                                    className="text-sm hover:text-[#d10202]"
                                >
                                    Edit
                                </Link>
                            </div>
                            <div className="mt-6 border-b pb-4">
                                {cart?.items.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="mb-4 flex h-auto items-center gap-6"
                                        >
                                            <Link
                                                to={`/product/${item?.product?.slug}`}
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
                                                        to={`/product/${item?.product?.slug}`}
                                                        className="w-fit font-semibold transition-colors hover:text-[#d10202]"
                                                    >
                                                        {item?.product?.name}
                                                    </Link>
                                                    <div className="flex flex-col align-top">
                                                        <span className="text-sm">
                                                            {item?.color?.name}
                                                        </span>
                                                        <span className="text-sm">
                                                            x {item?.quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="font-bold">
                                                    $
                                                    {numberWithCommas(
                                                        item?.itemPrice,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-4">
                                <div className="flex items-center justify-between py-1 text-base">
                                    <span>Subtotal: </span>
                                    <span>
                                        ${numberWithCommas(cart?.subTotal)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-1 text-base">
                                    <span>Discount: </span>
                                    <span>
                                        - ${discount}
                                        {promoCode?.type == 'coupon' && (
                                            <span className="text-green-400">
                                                ({promoCode?.discount}%)
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <div
                                    className={`flex items-center justify-end gap-4 py-1 text-sm ${promoCode?.code ? 'flex' : 'hidden'}`}
                                >
                                    <span>
                                        Promo code:{' '}
                                        <span className="font-semibold italic">
                                            {promoCode?.code}
                                        </span>
                                    </span>
                                    <label
                                        htmlFor="change-promo-code"
                                        className="cursor-pointer select-none transition-colors hover:text-[#d01202]"
                                    >
                                        Change
                                    </label>
                                    <span
                                        onClick={() => setPromoCode({})}
                                        className="cursor-pointer select-none transition-colors hover:text-[#d01202]"
                                    >
                                        Remove
                                    </span>
                                </div>
                                <input
                                    type="checkbox"
                                    id="change-promo-code"
                                    className="hidden [&:checked+div]:grid-rows-[1fr]"
                                    onChange={(e) => {
                                        if (e.currentTarget.checked)
                                            e.currentTarget.previousElementSibling.children[1].textContent =
                                                'Cancel';
                                        else
                                            e.currentTarget.previousElementSibling.children[1].textContent =
                                                'Change';
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
                                            onChange={(e) =>
                                                setCode(e.currentTarget.value)
                                            }
                                        />
                                        <span
                                            className={`inline-block shrink-0 basis-1/3 border border-black bg-white py-1 text-center text-sm text-black transition-colors hover:bg-black hover:text-white ${code ? 'pointer-events-auto cursor-pointer opacity-100' : 'pointer-events-none cursor-default opacity-50'}`}
                                            onClick={() =>
                                                handleApplyPromoCode()
                                            }
                                        >
                                            Apply
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-1 text-base">
                                    <span>Shipping cost: </span>
                                    <span>$10</span>
                                </div>

                                <div className="mt-4 flex items-center justify-between border-t py-2 text-lg font-bold">
                                    <span>Total: </span>
                                    <span>${numberWithCommas(total)}</span>
                                </div>
                            </div>
                            {address?._id != undefined && (
                                <button
                                    onClick={() => handleCreateOrder()}
                                    className={`mt-4 w-full border border-black bg-black py-4 text-sm font-semibold uppercase text-white transition-colors hover:bg-white hover:text-black ${payment == 'cod' ? 'block' : 'hidden'}`}
                                >
                                    Place Order
                                </button>
                            )}
                            {payment == 'paypal' &&
                                address?._id != undefined && (
                                    <PayPalButton
                                        address={address}
                                        setOrder={setOrder}
                                    />
                                )}
                            {payment == 'vnpay' && (
                                <button
                                    className="flex w-full items-center justify-center border bg-white py-4 transition-colors hover:bg-gray-100"
                                    onClick={handleCreateVNPayUrl}
                                >
                                    <img
                                        src="https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg"
                                        alt=""
                                        className="w-20 object-contain"
                                    />
                                </button>
                            )}
                        </div>
                    </div>
                )}
                {location.hash == '#success' && (
                    <div>
                        <div className="flex flex-col items-center justify-center">
                            <CheckCircleIcon className="size-16 text-green-500" />
                            <span className="mt-1 text-4xl font-bold">
                                Thank you for your order!
                            </span>
                        </div>
                        <div className="mt-6 flex flex-col items-center justify-center">
                            <span className="text-lg font-semibold tracking-wide">
                                Your order #ID: {order?._id} -{' '}
                                <span
                                    className={`capitalize ${order?.paymentStatus == 'pending' ? 'text-orange-500' : 'text-green-500'}`}
                                >
                                    {order?.paymentStatus}
                                </span>
                            </span>
                            <span>Order date: {order?.createdAt}</span>
                        </div>
                        <div className="mt-4 flex items-center justify-center gap-10">
                            <Link
                                to="/account/orders"
                                className="rounded-none border border-black bg-black px-4 py-2 text-white transition-colors hover:bg-white hover:text-black"
                            >
                                View detail
                            </Link>
                            <Link
                                to="/"
                                className="flex items-center justify-center gap-2 rounded-none border border-black bg-white px-4 py-2 text-black transition-colors hover:bg-black hover:text-white"
                            >
                                <ArrowLeftIcon className="size-5" />
                                <span>Continue Shopping</span>
                            </Link>
                        </div>
                    </div>
                )}
                {location.hash == '#fail' && (
                    <div>
                        <div className="flex flex-col items-center justify-center">
                            <ExclamationCircleIcon className="size-16 text-red-500" />
                            <span className="mt-1 text-4xl font-bold">
                                An error occurred during the payment process!
                            </span>
                        </div>
                        <div className="mt-10 flex items-center justify-center gap-10">
                            <Link
                                to="/checkout"
                                className="flex items-center justify-center gap-2 rounded-none border border-black bg-white px-4 py-2 text-black transition-colors hover:bg-black hover:text-white"
                            >
                                <ArrowLeftIcon className="size-5" />
                                <span>Back to checkout page</span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const AddressShipping = ({ onSubmit, toggleOpenForm, cities }) => {
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const { currentUser, token, loginUser } = useAuthStore();

    const addressShippingForm = useFormik({
        initialValues: {
            firstName: currentUser?.firstName ?? '',
            lastName: currentUser?.lastName ?? '',
            email: currentUser?.email ?? '',
            phoneNumber: currentUser?.phoneNumber ?? '',
            city: '',
            district: '',
            ward: '',
            addressLine: '',
        },
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            firstName: Yup.string().required('First name is required'),
            lastName: Yup.string().required('Last name is required'),
            email: Yup.string()
                .email('Invalid email format')
                .required('Email is required'),
            phoneNumber: Yup.string()
                .matches(/^[0-9]{10}$/, 'Phone number should be 10 digits')
                .required('Phone number is required'),
            city: Yup.object().required('City is required'),
            district: Yup.object().required('District is required'),
            ward: Yup.object().required('Province is required'),
            addressLine: Yup.string().required('Address line is required'),
        }),
        onSubmit: (values, { resetForm }) => {
            toast.promise(
                apiRequest.post(
                    '/addresses',
                    { ...values },
                    { headers: { Authorization: 'Bearer ' + token } },
                ),
                {
                    loading: 'Posting...',
                    success: (res) => {
                        resetForm();
                        onSubmit();
                        loginUser({
                            ...currentUser,
                            addresses: res.data?.addresses,
                        });
                        return res.data?.message;
                    },
                    error: (err) => err?.response?.data?.error,
                },
            );
        },
    });

    useEffect(() => {
        if (addressShippingForm.values.city?.id) {
            addressShippingForm.setFieldValue('district', '');
            addressShippingForm.setFieldValue('ward', '');
            axios
                .get(
                    `https://esgoo.net/api-tinhthanh/2/${addressShippingForm.values.city.id}.htm`,
                )
                .then((res) => setDistricts(res.data?.data))
                .catch((err) => console.log(err));
        }
        setDistricts([]);
        setWards([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addressShippingForm.values.city?.id]);

    useEffect(() => {
        if (addressShippingForm.values.district?.id) {
            addressShippingForm.setFieldValue('ward', '');
            axios
                .get(
                    `https://esgoo.net/api-tinhthanh/3/${addressShippingForm.values.district.id}.htm`,
                )
                .then((res) => setWards(res.data?.data))
                .catch((err) => console.log(err));
        }
        setWards([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addressShippingForm.values.district?.id]);

    return (
        <form
            onSubmit={addressShippingForm.handleSubmit}
            className="w-full px-6 py-4 text-sm"
        >
            <div className="flex w-full items-start gap-6">
                <div className="flex flex-1 flex-col items-start">
                    <div className="mb-2 flex w-full items-center justify-between">
                        <span>First name</span>
                        {addressShippingForm.errors.firstName && (
                            <span className="text-sm text-[#d10202]">
                                {addressShippingForm.errors.firstName}
                            </span>
                        )}
                    </div>
                    <input
                        placeholder="Ex: John,..."
                        type="text"
                        name="firstName"
                        value={addressShippingForm.values.firstName}
                        onChange={addressShippingForm.handleChange}
                        className="w-full rounded-lg border-2 py-2 pl-4 text-sm outline-none transition-colors focus:border-black"
                    />
                </div>
                <div className="flex flex-1 flex-col items-start">
                    <div className="mb-2 flex w-full items-center justify-between">
                        <span>Last name</span>
                        {addressShippingForm.errors.lastName && (
                            <span className="text-sm text-[#d10202]">
                                {addressShippingForm.errors.lastName}
                            </span>
                        )}
                    </div>
                    <input
                        placeholder="Ex: Smith,..."
                        type="text"
                        name="lastName"
                        value={addressShippingForm.values.lastName}
                        onChange={addressShippingForm.handleChange}
                        className="w-full rounded-lg border-2 py-2 pl-4 text-sm outline-none transition-colors focus:border-black"
                    />
                </div>
            </div>
            <div className="mt-2 flex w-full items-start gap-6">
                <div className="flex flex-1 flex-col items-start">
                    <div className="mb-2 flex w-full items-center justify-between">
                        <span>Email address</span>
                        {addressShippingForm.errors.email && (
                            <span className="text-sm text-[#d10202]">
                                {addressShippingForm.errors.email}
                            </span>
                        )}
                    </div>
                    <input
                        type="email"
                        name="email"
                        value={addressShippingForm.values.email}
                        onChange={addressShippingForm.handleChange}
                        placeholder="Ex: abc@email.com"
                        className="w-full rounded-lg border-2 py-2 pl-4 text-sm outline-none transition-colors focus:border-black"
                    />
                </div>
                <div className="flex flex-1 flex-col items-start">
                    <div className="mb-2 flex w-full items-center justify-between">
                        <span>Phone number</span>
                        {addressShippingForm.errors.phoneNumber && (
                            <span className="text-sm text-[#d10202]">
                                {addressShippingForm.errors.phoneNumber}
                            </span>
                        )}
                    </div>
                    <input
                        placeholder="Ex: 0987654321"
                        type="text"
                        name="phoneNumber"
                        value={addressShippingForm.values.phoneNumber}
                        onChange={addressShippingForm.handleChange}
                        className="w-full rounded-lg border-2 py-2 pl-4 text-sm outline-none transition-colors focus:border-black"
                    />
                </div>
            </div>
            <div className="mt-2 flex flex-col items-start">
                <div className="mb-2 flex w-full items-center justify-between">
                    <span>Provinces/ City</span>
                    {addressShippingForm.errors.city && (
                        <span className="text-sm text-[#d10202]">
                            {addressShippingForm.errors.city}
                        </span>
                    )}
                </div>
                <select
                    className="w-full rounded-lg border-2 px-2 py-2 text-sm outline-none transition-colors *:text-sm focus:border-black"
                    value={addressShippingForm.values.city?.id}
                    onChange={(e) => {
                        const cityId = e.currentTarget.value;
                        const city = cities.find((city) => city.id == cityId);
                        addressShippingForm.setFieldValue('city', city);
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
                        {addressShippingForm.errors.district && (
                            <span className="text-sm text-[#d10202]">
                                {addressShippingForm.errors.district}
                            </span>
                        )}
                    </div>
                    <select
                        className="w-full rounded-lg border-2 px-2 py-2 text-sm outline-none transition-colors focus:border-black"
                        value={addressShippingForm.values.district?.id}
                        onChange={(e) => {
                            const districtId = e.currentTarget.value;
                            const district = districts.find(
                                (district) => district.id == districtId,
                            );
                            addressShippingForm.setFieldValue(
                                'district',
                                district,
                            );
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
                        {addressShippingForm.errors.ward && (
                            <span className="text-sm text-[#d10202]">
                                {addressShippingForm.errors.ward}
                            </span>
                        )}
                    </div>
                    <select
                        className="w-full rounded-lg border-2 px-2 py-2 text-sm outline-none transition-colors focus:border-black"
                        value={addressShippingForm.values.ward?.id}
                        onChange={(e) => {
                            const wardId = e.currentTarget.value;
                            const ward = wards.find(
                                (ward) => ward.id == wardId,
                            );
                            addressShippingForm.setFieldValue('ward', ward);
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
                    <span>Address line</span>
                    {addressShippingForm.errors.addressLine && (
                        <span className="text-sm text-[#d10202]">
                            {addressShippingForm.errors.addressLine}
                        </span>
                    )}
                </div>
                <textarea
                    rows={5}
                    name="addressLine"
                    value={addressShippingForm.values.addressLine}
                    onChange={addressShippingForm.handleChange}
                    placeholder="Ex: House number, alley,..."
                    spellCheck={false}
                    className="w-full resize-y rounded-lg border-2 p-2 outline-none transition-colors focus:border-black"
                ></textarea>
            </div>
            <div className="mt-4 flex items-center justify-end gap-4">
                <button
                    type="reset"
                    onClick={() => {
                        addressShippingForm.resetForm();
                        toggleOpenForm(false);
                    }}
                    className="inline-block cursor-pointer border border-red-500 bg-white px-4 py-2 text-center text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="border border-black bg-black px-4 py-2 text-white transition-colors hover:bg-white hover:text-black"
                >
                    Save address
                </button>
            </div>
        </form>
    );
};

const EditAddressForm = ({
    address,
    isOpenSelectAddress,
    setSelectedAddress,
    cities,
}) => {
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const { token, loginUser, currentUser } = useAuthStore();
    const inputToggle = useRef();

    useEffect(() => {
        if (!isOpenSelectAddress) {
            inputToggle.current.checked = false;
        }
    }, [isOpenSelectAddress]);

    const addressForm = useFormik({
        initialValues: {
            firstName: address?.firstName,
            lastName: address?.lastName,
            email: address?.email,
            phoneNumber: address?.phoneNumber,
            city: address?.city,
            district: address?.district,
            ward: address?.ward,
            addressLine: address?.addressLine,
        },
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            firstName: Yup.string().required('First name is required'),
            lastName: Yup.string().required('Last name is required'),
            email: Yup.string()
                .email('Invalid email format')
                .required('Email is required'),
            phoneNumber: Yup.string()
                .matches(/^[0-9]{10}$/, 'Phone number should be 10 digits')
                .required('Phone number is required'),
            city: Yup.object().required('City is required'),
            district: Yup.object().required('District is required'),
            ward: Yup.object().required('Province is required'),
            addressLine: Yup.string().required('Address line is required'),
        }),
        onSubmit: (values) => {
            toast.promise(
                apiRequest.put(
                    '/addresses/' + address?._id,
                    { ...values },
                    { headers: { Authorization: 'Bearer ' + token } },
                ),
                {
                    loading: 'Posting...',
                    success: (res) => {
                        setSelectedAddress((selectedAddress) => {
                            if (selectedAddress?._id == address?._id) {
                                return { ...selectedAddress, ...values };
                            }
                            return selectedAddress;
                        });
                        loginUser({
                            ...currentUser,
                            addresses: res?.data?.addresses,
                        });
                        inputToggle.current.click();
                        return res.data?.message;
                    },
                    error: (err) => err?.response?.data?.error,
                },
            );
        },
    });

    useEffect(() => {
        if (addressForm.values.city?.id) {
            if (addressForm.values.city?.id != address?.city?.id) {
                addressForm.setFieldValue('district', '');
                addressForm.setFieldValue('ward', '');
            }
            axios
                .get(
                    `https://esgoo.net/api-tinhthanh/2/${addressForm.values.city.id}.htm`,
                )
                .then((res) => setDistricts(res.data?.data))
                .catch((err) => console.log(err));
        }
        setDistricts([]);
        setWards([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addressForm.values.city?.id]);

    useEffect(() => {
        if (addressForm.values.district?.id) {
            if (addressForm.values.district?.id != address?.district?.id) {
                addressForm.setFieldValue('ward', '');
            }
            axios
                .get(
                    `https://esgoo.net/api-tinhthanh/3/${addressForm.values.district.id}.htm`,
                )
                .then((res) => setWards(res.data?.data))
                .catch((err) => console.log(err));
        }
        setWards([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addressForm.values.district?.id]);

    return (
        <React.Fragment>
            <input
                type="checkbox"
                ref={inputToggle}
                className="hidden [&:checked+div]:grid-rows-[1fr]"
            />
            <div className="grid grid-rows-[0fr] transition-all duration-500">
                <div className="overflow-hidden">
                    <form
                        onSubmit={addressForm.handleSubmit}
                        className="overflow-hidden px-6 text-sm"
                    >
                        <div className="mt-4 w-full">
                            <div className="flex w-full items-start gap-6">
                                <div className="flex flex-1 flex-col items-start">
                                    <div className="mb-2 flex w-full items-center justify-between">
                                        <span>First name</span>
                                        {addressForm.errors.firstName && (
                                            <span className="text-sm text-[#d10202]">
                                                {addressForm.errors.firstName}
                                            </span>
                                        )}
                                    </div>
                                    <input
                                        placeholder="Ex: John,..."
                                        type="text"
                                        name="firstName"
                                        value={addressForm.values.firstName}
                                        onChange={addressForm.handleChange}
                                        className="w-full rounded-lg border-2 py-1 pl-4 text-sm outline-none transition-colors focus:border-black"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col items-start">
                                    <div className="mb-2 flex w-full items-center justify-between">
                                        <span>Last name</span>
                                        {addressForm.errors.lastName && (
                                            <span className="text-sm text-[#d10202]">
                                                {addressForm.errors.lastName}
                                            </span>
                                        )}
                                    </div>
                                    <input
                                        placeholder="Ex: Smith,..."
                                        type="text"
                                        name="lastName"
                                        value={addressForm.values.lastName}
                                        onChange={addressForm.handleChange}
                                        className="w-full rounded-lg border-2 py-1 pl-4 text-sm outline-none transition-colors focus:border-black"
                                    />
                                </div>
                            </div>
                            <div className="mt-2 flex w-full items-start gap-6">
                                <div className="flex flex-1 flex-col items-start">
                                    <div className="mb-2 flex w-full items-center justify-between">
                                        <span>Email address</span>
                                        {addressForm.errors.email && (
                                            <span className="text-sm text-[#d10202]">
                                                {addressForm.errors.email}
                                            </span>
                                        )}
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={addressForm.values.email}
                                        onChange={addressForm.handleChange}
                                        placeholder="Ex: abc@email.com"
                                        className="w-full rounded-lg border-2 py-1 pl-4 text-sm outline-none transition-colors focus:border-black"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col items-start">
                                    <div className="mb-2 flex w-full items-center justify-between">
                                        <span>Phone number</span>
                                        {addressForm.errors.phoneNumber && (
                                            <span className="text-sm text-[#d10202]">
                                                {addressForm.errors.phoneNumber}
                                            </span>
                                        )}
                                    </div>
                                    <input
                                        placeholder="Ex: 0987654321"
                                        type="text"
                                        name="phoneNumber"
                                        value={addressForm.values.phoneNumber}
                                        onChange={addressForm.handleChange}
                                        className="w-full rounded-lg border-2 py-1 pl-4 text-sm outline-none transition-colors focus:border-black"
                                    />
                                </div>
                            </div>
                            <div className="mt-2 flex flex-col items-start">
                                <div className="mb-2 flex w-full items-center justify-between">
                                    <span>Provinces/ City</span>
                                    {addressForm.errors.city && (
                                        <span className="text-sm text-[#d10202]">
                                            {addressForm.errors.city}
                                        </span>
                                    )}
                                </div>
                                <select
                                    className="w-full rounded-lg border-2 px-2 py-1 text-sm outline-none transition-colors focus:border-black"
                                    value={addressForm.values.city?.id}
                                    onChange={(e) => {
                                        const cityId = e.currentTarget.value;
                                        const city = cities.find(
                                            (city) => city.id == cityId,
                                        );
                                        addressForm.setFieldValue('city', city);
                                    }}
                                >
                                    <option value="">
                                        Please select provinces/city
                                    </option>
                                    {cities.map((city) => {
                                        return (
                                            <option
                                                key={city.id}
                                                value={city.id}
                                            >
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
                                        {addressForm.errors.district && (
                                            <span className="text-sm text-[#d10202]">
                                                {addressForm.errors.district}
                                            </span>
                                        )}
                                    </div>
                                    <select
                                        className="w-full rounded-lg border-2 px-2 py-1 text-sm outline-none transition-colors focus:border-black"
                                        value={addressForm.values.district?.id}
                                        onChange={(e) => {
                                            const districtId =
                                                e.currentTarget.value;
                                            const district = districts.find(
                                                (district) =>
                                                    district.id == districtId,
                                            );
                                            addressForm.setFieldValue(
                                                'district',
                                                district,
                                            );
                                        }}
                                    >
                                        <option value="">
                                            Please select district
                                        </option>
                                        {districts.map((district) => {
                                            return (
                                                <option
                                                    key={district.id}
                                                    value={district.id}
                                                >
                                                    {district.name}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div className="flex flex-1 flex-col items-start">
                                    <div className="mb-2 flex w-full items-center justify-between">
                                        <span>Ward</span>
                                        {addressForm.errors.ward && (
                                            <span className="text-sm text-[#d10202]">
                                                {addressForm.errors.ward}
                                            </span>
                                        )}
                                    </div>
                                    <select
                                        className="w-full rounded-lg border-2 px-2 py-1 text-sm outline-none transition-colors focus:border-black"
                                        value={addressForm.values.ward?.id}
                                        onChange={(e) => {
                                            const wardId =
                                                e.currentTarget.value;
                                            const ward = wards.find(
                                                (ward) => ward.id == wardId,
                                            );
                                            addressForm.setFieldValue(
                                                'ward',
                                                ward,
                                            );
                                        }}
                                    >
                                        <option value="">
                                            Please select ward
                                        </option>
                                        {wards.map((ward) => {
                                            return (
                                                <option
                                                    key={ward.id}
                                                    value={ward.id}
                                                >
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
                                    {addressForm.errors.addressLine && (
                                        <span className="text-sm text-[#d10202]">
                                            {addressForm.errors.addressLine}
                                        </span>
                                    )}
                                </div>
                                <textarea
                                    rows={3}
                                    name="addressLine"
                                    value={addressForm.values.addressLine}
                                    onChange={addressForm.handleChange}
                                    placeholder="Ex: House number, alley,..."
                                    spellCheck={false}
                                    className="w-full resize-y rounded-lg border-2 p-2 outline-none transition-colors focus:border-black"
                                ></textarea>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-end gap-6">
                            <button
                                type="button"
                                onClick={() => {
                                    inputToggle.current.click();
                                }}
                                className="inline-block cursor-pointer border border-black bg-white px-4 py-2 text-center text-black transition-all hover:bg-black hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="border border-black bg-black px-4 py-2 text-white transition-all hover:bg-white hover:text-black"
                            >
                                Save address
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </React.Fragment>
    );
};

const SelectAddressShipping = ({ onChange, cities }) => {
    const { currentUser } = useAuthStore();
    const [selectedAddress, setSelectedAddress] = useState({});
    const [isOpenSelectAddress, setIsOpenSelectAddress] = useState(false);
    const [isAddNewAddress, setIsAddNewAddress] = useState(false);

    useEffect(() => {
        setSelectedAddress(
            currentUser?.addresses?.find((add) => add?.isDefault) ?? {},
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    useEffect(() => {
        if (selectedAddress?._id) {
            onChange({ selectedAddress });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAddress]);

    useEffect(() => {
        setIsAddNewAddress(false);
    }, [isOpenSelectAddress]);

    return (
        <React.Fragment>
            <input
                type="checkbox"
                checked={isOpenSelectAddress}
                onChange={(e) =>
                    setIsOpenSelectAddress(e.currentTarget.checked)
                }
                id="select-address"
                className="hidden [&:checked+div]:pointer-events-auto [&:checked+div]:scale-100 [&:checked+div]:opacity-100"
            />
            <div className="pointer-events-none fixed left-0 top-0 z-50 flex size-full scale-110 items-center justify-center opacity-0 transition-all">
                <label
                    htmlFor="select-address"
                    className="absolute left-0 top-0 -z-10 inline-block size-full bg-[#000000d5]"
                ></label>
                <div className="relative flex max-h-[90%] w-1/2 flex-col bg-white">
                    <label
                        htmlFor="select-address"
                        className="absolute right-0 top-0 flex size-10 cursor-pointer items-center justify-center bg-black"
                    >
                        <XMarkIcon className="size-5 text-white" />
                    </label>
                    <h3 className="h-10 border-b px-4 text-lg font-semibold leading-10">
                        Addresses
                    </h3>
                    <div className="flex-1 overflow-y-scroll [scrollbar-width:thin]">
                        {currentUser?.addresses?.length > 0 && (
                            <div className="p-4">
                                {currentUser?.addresses?.map(
                                    (address, index) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <label className="relative flex cursor-pointer items-center justify-between p-4 text-sm hover:bg-gray-100">
                                                    <div className="flex items-center gap-4">
                                                        <input
                                                            type="radio"
                                                            name="addresses"
                                                            className="accent-black"
                                                            checked={
                                                                selectedAddress?._id ==
                                                                address?._id
                                                            }
                                                            onChange={(e) => {
                                                                setIsOpenSelectAddress(
                                                                    !e
                                                                        .currentTarget
                                                                        .checked,
                                                                );
                                                                setSelectedAddress(
                                                                    address,
                                                                );
                                                            }}
                                                        />
                                                        <div>
                                                            {address?.isDefault && (
                                                                <span className="text-[#d10202]">
                                                                    (Default)
                                                                </span>
                                                            )}
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold">
                                                                    {address?.firstName +
                                                                        ' ' +
                                                                        address?.lastName}
                                                                </span>
                                                                <span className="text-gray-300">
                                                                    {'|'}
                                                                </span>
                                                                <span>
                                                                    {
                                                                        address?.phoneNumber
                                                                    }
                                                                </span>
                                                                <span className="text-gray-300">
                                                                    {'|'}
                                                                </span>
                                                                <span>
                                                                    {
                                                                        address?.email
                                                                    }
                                                                </span>
                                                            </div>
                                                            <p>
                                                                Address:{' '}
                                                                {
                                                                    address?.addressLine
                                                                }
                                                                ,{' '}
                                                                {
                                                                    address
                                                                        ?.ward
                                                                        ?.name
                                                                }
                                                                ,{' '}
                                                                {
                                                                    address
                                                                        ?.district
                                                                        ?.name
                                                                }
                                                                ,{' '}
                                                                {
                                                                    address
                                                                        ?.city
                                                                        ?.name
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span
                                                        className="select-none"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            const ip =
                                                                e.currentTarget
                                                                    .parentElement
                                                                    .nextElementSibling;
                                                            ip.checked =
                                                                !ip.checked;
                                                        }}
                                                    >
                                                        Edit
                                                    </span>
                                                </label>
                                                <EditAddressForm
                                                    address={address}
                                                    isOpenSelectAddress={
                                                        isOpenSelectAddress
                                                    }
                                                    setSelectedAddress={
                                                        setSelectedAddress
                                                    }
                                                    cities={cities}
                                                />
                                            </React.Fragment>
                                        );
                                    },
                                )}
                            </div>
                        )}
                        <input
                            type="checkbox"
                            id="add-new-address"
                            className="hidden [&:checked+label+div]:grid-rows-[1fr] [&:checked+label>svg]:rotate-45"
                            checked={isAddNewAddress}
                            onChange={(e) =>
                                setIsAddNewAddress(e.currentTarget.checked)
                            }
                        />
                        <label
                            htmlFor="add-new-address"
                            className="flex cursor-pointer items-center gap-2 p-6 text-sm"
                        >
                            <PlusCircleIcon className="size-8 transition-all duration-500" />
                            <span>Add new address</span>
                        </label>
                        <div className="grid grid-rows-[0fr] transition-all duration-500 ease-out">
                            <div className="overflow-hidden">
                                <AddressShipping
                                    onSubmit={() => {
                                        setIsAddNewAddress(false);
                                    }}
                                    toggleOpenForm={setIsAddNewAddress}
                                    cities={cities}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

SelectAddressShipping.propTypes = {
    onChange: PropTypes.func,
    cities: PropTypes.array,
};

AddressShipping.propTypes = {
    onSubmit: PropTypes.func,
    toggleOpenForm: PropTypes.func,
    cities: PropTypes.array,
};

EditAddressForm.propTypes = {
    address: PropTypes.object,
    isOpenSelectAddress: PropTypes.bool,
    setSelectedAddress: PropTypes.func,
    cities: PropTypes.array,
};

export default Checkout;
