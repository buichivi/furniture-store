import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import apiRequest from '../utils/apiRequest';
import useDataStore from '../store/dataStore';
import useCartStore from '../store/cartStore';
import React, { useEffect, useRef, useState } from 'react';
import { numberWithCommas } from '../utils/format';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ORDER_STATUS = [
    { status: 'pending', color: 'orange' },
    { status: 'completed', color: '#06D001' },
    { status: 'failed', color: '#FF3838' },
    { status: 'processing', color: '#2DCCFF' },
    { status: 'shipping', color: '#A4ABB6' },
    { status: 'delivered', color: '#5cb85c' },
    { status: 'cancelled', color: '#d9534f' },
];
const MyAccount = () => {
    const { option } = useParams();
    const { currentUser, logout, token } = useAuthStore();
    const { setCart } = useCartStore();
    const { setWishlist } = useDataStore();
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [addresses, setAddresses] = useState([]);

    const [currentViewOrder, setCurrentViewOrder] = useState({});

    useEffect(() => {
        if (option == 'orders') {
            apiRequest
                .get('/orders', { headers: { Authorization: 'Bearer ' + token } })
                .then((res) => setOrders(res.data?.orders))
                .catch((err) => console.log(err));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [option]);

    useEffect(() => {
        if (location.search) {
            const orderId = location.search.slice(1).split('=')[1];
            const order = orders.find((od) => od?._id == orderId);
            if (order) setCurrentViewOrder(order);
            else location.search = '';
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    useEffect(() => {
        setAddresses(currentUser?.addresses ?? []);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser?._id]);

    const handleLogout = () => {
        toast.promise(apiRequest.patch('/auth/logout', null, { headers: { Authorization: 'Bearer ' + token } }), {
            loading: 'Logout...',
            success: (res) => {
                logout();
                setCart({ items: [] });
                setWishlist([]);
                navigate('/');
                return res.data.message;
            },
            error: (err) => {
                return err.response.data.error || 'Something went wrong';
            },
        });
    };

    const handleDeleteAddress = (id) => {
        if (confirm('Are you sure to delete this address?')) {
            toast.promise(apiRequest.delete('/addresses/' + id, { headers: { Authorization: 'Bearer ' + token } }), {
                loading: 'Deleting...',
                success: (res) => {
                    setAddresses(res.data?.addresses);
                    return res.data.message;
                },
                error: (err) => {
                    return err?.response?.data?.error;
                },
            });
        }
    };

    const handleSetDefaultAddress = (id) => {
        toast.promise(apiRequest.patch('/addresses/' + id, null, { headers: { Authorization: 'Bearer ' + token } }), {
            loading: 'Changing...',
            success: (res) => {
                setAddresses(res.data?.addresses);
                return res.data.message;
            },
            error: (err) => {
                return err?.response?.data?.error;
            },
        });
    };

    return (
        <div className="mt-[90px] border-t bg-gray-100">
            <div className="container mx-auto px-5">
                <div className="flex items-start gap-10 py-10">
                    <div className="shrink-0 basis-1/4 bg-white px-6 py-5">
                        <h3 className="mb-3 font-lora text-4xl font-semibold">
                            Hi, {currentUser?.firstName + ' ' + currentUser?.lastName}!
                        </h3>
                        <p className="text-sm uppercase text-gray-500">My account</p>
                        <div className="mt-2">
                            <Link
                                to="/account/orders"
                                className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-black hover:text-white ${option == 'orders' && 'bg-black text-white'}`}
                            >
                                <span className="size-6">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M17.677 16.879l-.343.195v-1.717l.343-.195v1.717zm2.823-3.324l-.342.195v1.717l.342-.196v-1.716zm3.5-7.602v11.507l-9.75 5.54-10.25-4.989v-11.507l9.767-5.504 10.233 4.953zm-11.846-1.757l7.022 3.2 1.7-.917-7.113-3.193-1.609.91zm.846 7.703l-7-3.24v8.19l7 3.148v-8.098zm3.021-2.809l-6.818-3.24-2.045 1.168 6.859 3.161 2.004-1.089zm5.979-.943l-2 1.078v2.786l-3 1.688v-2.856l-2 1.078v8.362l7-3.985v-8.151zm-4.907 7.348l-.349.199v1.713l.349-.195v-1.717zm1.405-.8l-.344.196v1.717l.344-.196v-1.717zm.574-.327l-.343.195v1.717l.343-.195v-1.717zm.584-.332l-.35.199v1.717l.35-.199v-1.717zm-16.656-4.036h-2v1h2v-1zm0 2h-3v1h3v-1zm0 2h-2v1h2v-1z" />
                                    </svg>
                                </span>
                                <span>Orders</span>
                            </Link>
                            <Link
                                to="/account/addresses"
                                className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-black hover:text-white ${option == 'addresses' && 'bg-black text-white'}`}
                            >
                                <div className="size-6">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M20 7.093v-5.093h-3v2.093l3 3zm4 5.907l-12-12-12 12h3v10h18v-10h3zm-5 8h-14v-10.26l7-6.912 7 6.99v10.182zm-5-1h-4v-6h4v6z" />
                                    </svg>
                                </div>
                                <span>Addresses</span>
                            </Link>
                            <Link
                                to="/wishlist"
                                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-black hover:text-white"
                            >
                                <span className="size-6">
                                    <svg
                                        clipRule="evenodd"
                                        fillRule="evenodd"
                                        strokeLinejoin="round"
                                        strokeMiterlimit="2"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                    >
                                        <path
                                            d="m7.234 3.004c-2.652 0-5.234 1.829-5.234 5.177 0 3.725 4.345 7.727 9.303 12.54.194.189.446.283.697.283s.503-.094.697-.283c4.977-4.831 9.303-8.814 9.303-12.54 0-3.353-2.58-5.168-5.229-5.168-1.836 0-3.646.866-4.771 2.554-1.13-1.696-2.935-2.563-4.766-2.563zm0 1.5c1.99.001 3.202 1.353 4.155 2.7.14.198.368.316.611.317.243 0 .471-.117.612-.314.955-1.339 2.19-2.694 4.159-2.694 1.796 0 3.729 1.148 3.729 3.668 0 2.671-2.881 5.673-8.5 11.127-5.454-5.285-8.5-8.389-8.5-11.127 0-1.125.389-2.069 1.124-2.727.673-.604 1.625-.95 2.61-.95z"
                                            fillRule="nonzero"
                                        />
                                    </svg>
                                </span>
                                <span>Wishlist</span>
                            </Link>
                            <div
                                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-black hover:text-white"
                                onClick={handleLogout}
                            >
                                <div className="size-6 text-center">
                                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                </div>
                                <span>Log out</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        {option == 'orders' && !currentViewOrder?._id && (
                            <React.Fragment>
                                <h3 className="font-lora text-3xl font-semibold">All Orders</h3>
                                <p className="text-sm tracking-wide">
                                    Track your orders, request a return or check your order history
                                </p>
                                {orders?.length > 0 ? (
                                    <table className="mt-4 w-full border bg-white">
                                        <thead>
                                            <tr className="border-b text-left text-sm [&>th]:p-3">
                                                <th>Order ID</th>
                                                <th>Full name</th>
                                                <th>Date</th>
                                                <th>Total</th>
                                                <th>Payment</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders?.map((order, index) => {
                                                return (
                                                    <tr
                                                        key={index}
                                                        className="cursor-pointer text-sm transition-colors hover:bg-gray-100 [&:hover_svg]:text-black [&>td]:p-3"
                                                        onClick={() => {
                                                            navigate(`/account/orders?viewOrder=` + order?._id);
                                                        }}
                                                    >
                                                        <td>#{order?._id}</td>
                                                        <td>
                                                            {order?.shippingAddress?.firstName +
                                                                ' ' +
                                                                order?.shippingAddress?.lastName}
                                                        </td>
                                                        <td>{order?.createdAt}</td>
                                                        <td>${order?.totalAmount}</td>
                                                        <td className="uppercase">
                                                            <div className="flex items-center justify-between">
                                                                <span>{order?.paymentMethod}</span>
                                                                <span className="">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth={1.5}
                                                                        stroke="currentColor"
                                                                        className="size-5 text-gray-500 transition-colors"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                                                                        />
                                                                    </svg>
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="mt-6 bg-white p-6 text-sm tracking-wide">No order to show</p>
                                )}
                            </React.Fragment>
                        )}
                        {option == 'orders' && currentViewOrder?._id && (
                            <div className="border bg-white p-4">
                                <button
                                    className="flex items-center gap-2 bg-black p-2 text-sm text-white"
                                    onClick={() => {
                                        navigate('/account/orders');
                                        location.search = '';
                                        setCurrentViewOrder({});
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="size-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                                        />
                                    </svg>

                                    <span>Back</span>
                                </button>
                                <div className="border-b py-2">
                                    <h4 className="text-lg font-medium">Order ID: {currentViewOrder?._id}</h4>
                                    <p className="text-sm">Order date: {currentViewOrder?.createdAt}</p>
                                </div>
                                <div>
                                    {currentViewOrder?.items?.map((item, index) => {
                                        return (
                                            <div key={index} className="flex items-center gap-4 border-b py-4">
                                                <div className="size-28 shrink-0 overflow-hidden rounded-lg border">
                                                    <img
                                                        src={item?.productImage}
                                                        alt=""
                                                        className="size-full object-contain"
                                                    />
                                                </div>
                                                <div className="shrink-0">
                                                    <h4 className="text-lg">{item?.product?.name}</h4>
                                                    <span className="text-sm text-gray-500">
                                                        Color: {item?.color?.name}
                                                    </span>
                                                </div>
                                                <div className="flex-1 text-right [&>*]:block">
                                                    <span className="text-base font-semibold tracking-wide">
                                                        ${numberWithCommas(item?.itemPrice)}
                                                    </span>
                                                    <span className="text-sm">Qty: {item?.quantity}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-4">
                                    <h4 className="text-lg font-bold">Order summery</h4>
                                    <div className="w-1/4">
                                        <div className="flex items-center justify-between">
                                            <span>Subtotal: </span>
                                            <span>${numberWithCommas(currentViewOrder?.subTotal)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Discount: </span>
                                            <span>
                                                <span className="text-green-500">
                                                    -(
                                                    {currentViewOrder?.promoCode?.type == 'coupon' &&
                                                        currentViewOrder?.promoCode?.discount}
                                                    %)
                                                </span>
                                                ${numberWithCommas(currentViewOrder?.discount)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Shipping fee: </span>
                                            <span>${numberWithCommas(currentViewOrder?.shippingFee)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-lg font-bold">
                                            <span>Total amount: </span>
                                            <span>${numberWithCommas(currentViewOrder?.totalAmount)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-end">
                                    <div className="flex-1">
                                        <h4 className="font-bold">Delivery</h4>
                                        <div className="*:text-sm">
                                            <p>Phone number: {currentViewOrder?.shippingAddress?.phoneNumber}</p>
                                            <p>Email: {currentViewOrder?.shippingAddress?.email}</p>
                                            <p>
                                                Address: {currentViewOrder?.shippingAddress?.addressLine},{' '}
                                                {currentViewOrder?.shippingAddress?.ward?.name},{' '}
                                                {currentViewOrder?.shippingAddress?.district?.name},{' '}
                                                {currentViewOrder?.shippingAddress?.city?.name}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4>
                                            Payment:
                                            <span className="ml-2 font-bold uppercase">
                                                {currentViewOrder?.paymentMethod}
                                            </span>
                                        </h4>
                                        <h4>
                                            Payment status:
                                            <span className="ml-2 font-bold capitalize">
                                                {currentViewOrder?.paymentStatus}
                                            </span>
                                        </h4>
                                        <h4>
                                            Order status:
                                            <span
                                                className="ml-2 font-bold capitalize"
                                                style={{
                                                    color: ORDER_STATUS.find(
                                                        (od) => od.status == currentViewOrder?.orderStatus,
                                                    ).color,
                                                }}
                                            >
                                                {currentViewOrder?.orderStatus}
                                            </span>
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        )}
                        {option == 'addresses' && (
                            <React.Fragment>
                                <div className="bg-white p-4">
                                    <div className="flex items-center justify-between ">
                                        <div>
                                            <h3 className="font-lora text-3xl font-semibold">Addresses</h3>
                                            <p className="text-sm tracking-wide">Add a new address.</p>
                                        </div>
                                        <label
                                            htmlFor="address-form"
                                            className="inline-block min-w-32 cursor-pointer border border-black bg-black px-4 py-2 text-center text-white transition-colors hover:bg-white hover:text-black"
                                            onClick={(e) => {
                                                if (!e.currentTarget.parentElement.nextElementSibling.checked) {
                                                    e.currentTarget.textContent = 'Cancel';
                                                } else e.currentTarget.textContent = 'Add';
                                            }}
                                        >
                                            Add
                                        </label>
                                    </div>
                                    <AddAddressForm setAddresses={setAddresses} />
                                </div>
                                {addresses.length == 0 ? (
                                    <p className="mt-6 bg-white p-6 text-sm tracking-wide">No address to show</p>
                                ) : (
                                    <div className="mt-6 flex flex-col gap-4">
                                        {addresses.map((address, index) => {
                                            return (
                                                <div key={index} className="bg-white p-6">
                                                    {address?.isDefault && (
                                                        <span className="mb-2 font-lora text-xl font-semibold">
                                                            Default
                                                        </span>
                                                    )}
                                                    <div className="flex items-start justify-between">
                                                        <div className="text-sm">
                                                            <p>Name: {address?.firstName + ' ' + address?.lastName}</p>
                                                            <p>Phone number: {address?.phoneNumber}</p>
                                                            <p>Email: {address?.email}</p>
                                                            <p>
                                                                Address: {address?.addressLine}, {address?.ward?.name},{' '}
                                                                {address?.district?.name}, {address?.city?.name}
                                                            </p>
                                                        </div>
                                                        <span
                                                            className="cursor-pointer"
                                                            onClick={() => handleSetDefaultAddress(address?._id)}
                                                        >
                                                            {address?.isDefault ? (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 24 24"
                                                                    fill="currentColor"
                                                                    className="size-5"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            ) : (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth={1.5}
                                                                    stroke="currentColor"
                                                                    className="size-5"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                                                    />
                                                                </svg>
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-end gap-4">
                                                        <button
                                                            className="inline-block cursor-pointer border border-black bg-white px-4 py-2 text-center text-xs font-bold uppercase text-black transition-all hover:bg-black hover:text-white"
                                                            onClick={() => handleDeleteAddress(address?._id)}
                                                        >
                                                            Delete address
                                                        </button>
                                                        <button className="inline-block min-w-32 cursor-pointer border border-black bg-black px-4 py-2 text-center text-xs font-bold uppercase text-white transition-colors hover:bg-white hover:text-black">
                                                            Edit address
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </React.Fragment>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AddAddressForm = ({ setAddresses }) => {
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const { token } = useAuthStore();
    const inputToggleForm = useRef();

    const addressForm = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            city: '',
            district: '',
            ward: '',
            addressLine: '',
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
            addressLine: Yup.string().required('Address line is required'),
        }),
        onSubmit: (values, { resetForm }) => {
            toast.promise(
                apiRequest.post('/addresses', { ...values }, { headers: { Authorization: 'Bearer ' + token } }),
                {
                    loading: 'Posting...',
                    success: (res) => {
                        resetForm();
                        inputToggleForm.current.checked = !inputToggleForm.current.checked;
                        setAddresses(res.data?.addresses);
                        return res.data?.message;
                    },
                    error: (err) => err?.response?.data?.error,
                },
            );
            console.log(values);
        },
    });

    useEffect(() => {
        axios
            .get('https://esgoo.net/api-tinhthanh/1/0.htm')
            .then((res) => setCities(res.data?.data))
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        if (addressForm.values.city?.id) {
            addressForm.setFieldValue('district', '');
            addressForm.setFieldValue('ward', '');
            axios
                .get(`https://esgoo.net/api-tinhthanh/2/${addressForm.values.city.id}.htm`)
                .then((res) => setDistricts(res.data?.data))
                .catch((err) => console.log(err));
        }
        setDistricts([]);
        setWards([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addressForm.values.city?.id]);

    useEffect(() => {
        if (addressForm.values.district?.id) {
            addressForm.setFieldValue('ward', '');
            axios
                .get(`https://esgoo.net/api-tinhthanh/3/${addressForm.values.district.id}.htm`)
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
                ref={inputToggleForm}
                id="address-form"
                className="hidden [&:checked+div]:grid-rows-[1fr]"
            />
            <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out">
                <form onSubmit={addressForm.handleSubmit} className="overflow-hidden">
                    <div className="mt-4 w-full">
                        <div className="flex w-full items-start gap-6">
                            <div className="flex flex-1 flex-col items-start">
                                <div className="mb-2 flex w-full items-center justify-between">
                                    <span>First name</span>
                                    {addressForm.errors.firstName && (
                                        <span className="text-sm text-[#d10202]">{addressForm.errors.firstName}</span>
                                    )}
                                </div>
                                <input
                                    placeholder="Ex: John,..."
                                    type="text"
                                    name="firstName"
                                    value={addressForm.values.firstName}
                                    onChange={addressForm.handleChange}
                                    className="w-full rounded-lg border-2 py-2 pl-4 text-sm outline-none transition-colors focus:border-black"
                                />
                            </div>
                            <div className="flex flex-1 flex-col items-start">
                                <div className="mb-2 flex w-full items-center justify-between">
                                    <span>Last name</span>
                                    {addressForm.errors.lastName && (
                                        <span className="text-sm text-[#d10202]">{addressForm.errors.lastName}</span>
                                    )}
                                </div>
                                <input
                                    placeholder="Ex: Smith,..."
                                    type="text"
                                    name="lastName"
                                    value={addressForm.values.lastName}
                                    onChange={addressForm.handleChange}
                                    className="w-full rounded-lg border-2 py-2 pl-4 text-sm outline-none transition-colors focus:border-black"
                                />
                            </div>
                        </div>
                        <div className="mt-2 flex w-full items-start gap-6">
                            <div className="flex flex-1 flex-col items-start">
                                <div className="mb-2 flex w-full items-center justify-between">
                                    <span>Email address</span>
                                    {addressForm.errors.email && (
                                        <span className="text-sm text-[#d10202]">{addressForm.errors.email}</span>
                                    )}
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={addressForm.values.email}
                                    onChange={addressForm.handleChange}
                                    placeholder="Ex: abc@email.com"
                                    className="w-full rounded-lg border-2 py-2 pl-4 text-sm outline-none transition-colors focus:border-black"
                                />
                            </div>
                            <div className="flex flex-1 flex-col items-start">
                                <div className="mb-2 flex w-full items-center justify-between">
                                    <span>Phone number</span>
                                    {addressForm.errors.phoneNumber && (
                                        <span className="text-sm text-[#d10202]">{addressForm.errors.phoneNumber}</span>
                                    )}
                                </div>
                                <input
                                    placeholder="Ex: 0987654321"
                                    type="text"
                                    name="phoneNumber"
                                    value={addressForm.values.phoneNumber}
                                    onChange={addressForm.handleChange}
                                    className="w-full rounded-lg border-2 py-2 pl-4 text-sm outline-none transition-colors focus:border-black"
                                />
                            </div>
                        </div>
                        <div className="mt-2 flex flex-col items-start">
                            <div className="mb-2 flex w-full items-center justify-between">
                                <span>Provinces/ City</span>
                                {addressForm.errors.city && (
                                    <span className="text-sm text-[#d10202]">{addressForm.errors.city}</span>
                                )}
                            </div>
                            <select
                                className="w-full rounded-lg border-2 px-2 py-2 text-sm outline-none transition-colors focus:border-black"
                                value={addressForm.values.city?.id}
                                onChange={(e) => {
                                    const cityId = e.currentTarget.value;
                                    const city = cities.find((city) => city.id == cityId);
                                    addressForm.setFieldValue('city', city);
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
                                    {addressForm.errors.district && (
                                        <span className="text-sm text-[#d10202]">{addressForm.errors.district}</span>
                                    )}
                                </div>
                                <select
                                    className="w-full rounded-lg border-2 px-2 py-2 text-sm outline-none transition-colors focus:border-black"
                                    value={addressForm.values.district?.id}
                                    onChange={(e) => {
                                        const districtId = e.currentTarget.value;
                                        const district = districts.find((district) => district.id == districtId);
                                        addressForm.setFieldValue('district', district);
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
                                    {addressForm.errors.ward && (
                                        <span className="text-sm text-[#d10202]">{addressForm.errors.ward}</span>
                                    )}
                                </div>
                                <select
                                    className="w-full rounded-lg border-2 px-2 py-2 text-sm outline-none transition-colors focus:border-black"
                                    value={addressForm.values.ward?.id}
                                    onChange={(e) => {
                                        const wardId = e.currentTarget.value;
                                        const ward = wards.find((ward) => ward.id == wardId);
                                        addressForm.setFieldValue('ward', ward);
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
                                {addressForm.errors.addressLine && (
                                    <span className="text-sm text-[#d10202]">{addressForm.errors.addressLine}</span>
                                )}
                            </div>
                            <textarea
                                rows={5}
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
                            type="reset"
                            className="inline-block cursor-pointer border border-black bg-white px-4 py-2 text-center text-black transition-all hover:bg-black hover:text-white"
                            onClick={() => {
                                inputToggleForm.current.checked = !inputToggleForm.current.checked;
                            }}
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
        </React.Fragment>
    );
};

AddAddressForm.propTypes = {
    setAddresses: PropTypes.func,
};

export default MyAccount;
