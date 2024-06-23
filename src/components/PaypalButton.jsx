import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import apiRequest from '../utils/apiRequest';
import useCartStore from '../store/cartStore';
import { useEffect, useMemo, useState } from 'react';
import useDataStore from '../store/dataStore';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

function PayPalButton({ form, setOrder }) {
    const { cart, setCart } = useCartStore();
    const { promoCode, setPromoCode } = useDataStore();
    const { token } = useAuthStore();
    const [key, setKey] = useState(0);
    const navigate = useNavigate();

    const initialOptions = {
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: 'USD',
        intent: 'capture',
    };

    useEffect(() => {
        setKey(key + 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart, promoCode?.code]);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setKey(key + 1);
        }, 2000);
        () => clearTimeout(timerId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.values]);

    const items = useMemo(() => {
        return cart.items.map((item) => {
            return {
                name: item?.product?.name,
                quantity: item?.quantity,
                unit_amount: {
                    currency_code: 'USD',
                    value: item?.itemPrice / item?.quantity,
                },
                sku: item?.product?.SKU,
            };
        });
    }, [cart.items]);

    const discount = useMemo(() => {
        if (!promoCode?.type) {
            return 0;
        }
        return promoCode?.type == 'coupon'
            ? Math.floor((cart?.subTotal * promoCode?.discount) / 100)
            : promoCode?.discount;
    }, [promoCode, cart]);

    const total = useMemo(() => {
        return (cart?.subTotal >= discount ? cart?.subTotal - discount : 0) + 10;
    }, [discount, cart]);

    const createOrder = (data, actions) => {
        console.log('ORDER');
        const totalValue = total.toFixed(2);
        return actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: totalValue,
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: cart?.subTotal.toFixed(2),
                            },
                            discount: {
                                currency_code: 'USD',
                                value: Math.min(discount, cart?.subTotal).toFixed(2),
                            },
                            shipping: {
                                currency_code: 'USD',
                                value: '10.00',
                            },
                        },
                    },
                    items: items,
                    shipping: {
                        name: {
                            full_name: form.values.firstName + ' ' + form.values.lastName,
                        },
                        address: {
                            address_line_1: form.values.addressLine + ', ' + form.values.ward.name,
                            admin_area_1: form.values.city.name,
                            admin_area_2: form.values.district.name,
                            postal_code: '100000',
                            country_code: 'VN',
                        },
                    },
                },
            ],
            application_context: {
                shipping_preference: 'SET_PROVIDED_ADDRESS',
            },
        });
    };

    const onApprove = async (data, actions) => {
        return actions.order.capture().then(function (details) {
            console.log('APPROVE');
            const data = {
                totalAmount: total,
                shippingAddress: form.values,
                promoCode: promoCode?._id,
                paymentMethod: 'paypal',
                paymentStatus: 'paid',
            };
            toast.promise(apiRequest.post('/orders', { ...data }, { headers: { Authorization: 'Bearer ' + token } }), {
                loading: 'Creating order...',
                success: (res) => {
                    setCart({ items: [] });
                    setPromoCode({});
                    navigate('/checkout#success');
                    setOrder(res.data?.order);
                    return res.data?.message;
                },
                error: (err) => err?.response?.data?.error,
            });
            console.log('Transaction completed by ' + details.payer.name.given_name);
        });
    };

    return (
        <div className="h-10 w-full">
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                    key={key}
                    style={{
                        shape: 'rect',
                        layout: 'horizontal',
                        color: 'white',
                        tagline: false,
                    }}
                    className="mt-2"
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onCancel={() => {
                        alert('Transaction was cancelled');
                    }}
                    onError={(err) => {
                        console.log('Error during the transaction:', err);
                        alert('An error occurred during the transaction');
                    }}
                />
            </PayPalScriptProvider>
        </div>
    );
}
PayPalButton.propTypes = {
    form: PropTypes.object,
    setOrder: PropTypes.func,
};

export default PayPalButton;
