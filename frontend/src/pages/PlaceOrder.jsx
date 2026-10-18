
import React, { useContext, useState } from 'react'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../Context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import {
    PayPalScriptProvider,
    PayPalButtons
} from '@paypal/react-paypal-js'

const PlaceOrder = () => {

    // Only two payment methods: Stripe and PayPal
    const [method, setMethod] = useState('stripe')

    const {
        navigate,
        backendUrl,
        token,
        cartItems,
        setCartItems,
        getCartAmount,
        delivery_fee,
        products
    } = useContext(ShopContext)

    const [paypalOrder, setPaypalOrder] = useState(null)
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    })

    const onChangeHandler = (event) => {
        const { name, value } = event.target

        setFormData(data => ({
            ...data,
            [name]: value
        }))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        if (!token) {
            toast.error('Please log in before placing your order.')
            navigate('/login')
            return
        }

        if (loading) return

        try {
            setLoading(true)

            // Build the order items from the shopping cart
            const orderItems = []

            for (const productId in cartItems) {
                for (const size in cartItems[productId]) {

                    const quantity = cartItems[productId][size]

                    if (quantity > 0) {
                        const product = products.find(
                            item => item._id === productId
                        )

                        if (product) {
                            orderItems.push({
                                ...product,
                                size,
                                quantity
                            })
                        }
                    }
                }
            }

            if (orderItems.length === 0) {
                toast.error('Your cart is empty.')
                return
            }

            const orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee
            }

            // STRIPE PAYMENT
            if (method === 'stripe') {

                const response = await axios.post(
                    backendUrl + '/api/order/stripe',
                    orderData,
                    {
                        headers: { token }
                    }
                )

                if (response.data.success && response.data.session_url) {
                    window.location.replace(response.data.session_url)
                } else {
                    toast.error(
                        response.data.message || 'Unable to start Stripe payment.'
                    )
                }
            }

            // PAYPAL PAYMENT
            else if (method === 'paypal') {

                const response = await axios.post(
                    backendUrl + '/api/order/paypal/create',
                    orderData,
                    {
                        headers: { token }
                    }
                )

                if (
                    response.data.success &&
                    response.data.paypalOrderId &&
                    response.data.mongoOrderId
                ) {
                    // Save the PayPal order details.
                    // The PayPal buttons will appear after this.
                    setPaypalOrder({
                        paypalOrderId: response.data.paypalOrderId,
                        mongoOrderId: response.data.mongoOrderId
                    })

                    toast.info('Continue with PayPal below.')
                } else {
                    toast.error(
                        response.data.message || 'Unable to create PayPal order.'
                    )
                }
            }

        } catch (error) {
            console.error('Place order error:', error)

            toast.error(
                error.response?.data?.message ||
                error.message ||
                'Something went wrong.'
            )
        } finally {
            setLoading(false)
        }
    }

    // Capture payment after the customer approves it in PayPal
    const onPayPalApprove = async (data) => {
        try {
            console.log("PayPal order ID from approval:", data.orderID);
            console.log(
                "PayPal order ID saved in frontend:",
                paypalOrder.paypalOrderId
            );
            console.log(
                "Nike MongoDB order ID:",
                paypalOrder.mongoOrderId
            );

            const response = await axios.post(
                backendUrl + "/api/order/paypal/capture",
                {
                    paypalOrderId: data.orderID,
                    mongoOrderId: paypalOrder.mongoOrderId
                },
                {
                    headers: { token }
                }
            );

            if (response.data.success) {
                toast.success("PayPal payment successful!");
                setCartItems({});
                setPaypalOrder(null);
                navigate("/orders");
            } else {
                toast.error(
                    response.data.message || "PayPal payment failed."
                );
            }
        } catch (error) {
            console.error(
                "PayPal capture error:",
                error.response?.data || error.message
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to confirm PayPal payment."
            );
        }
    };

    const cancelPayPalCheckout = () => {
        setPaypalOrder(null)
        toast.info('PayPal checkout cancelled. You can try again.')
    }

    return (
        <form
            onSubmit={onSubmitHandler}
            className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'
        >

            {/* LEFT SIDE: DELIVERY INFORMATION */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

                <div className='text-xl sm:text-2xl my-3'>
                    <p className='prata-regular my-2 gap-2'>
                        Delivery Info
                    </p>
                </div>

                <div className='flex gap-3'>
                    <input
                        required
                        onChange={onChangeHandler}
                        name='firstName'
                        value={formData.firstName}
                        className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
                        type='text'
                        placeholder='First name'
                    />

                    <input
                        required
                        onChange={onChangeHandler}
                        name='lastName'
                        value={formData.lastName}
                        className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
                        type='text'
                        placeholder='Last name'
                    />
                </div>

                <input
                    required
                    onChange={onChangeHandler}
                    name='email'
                    value={formData.email}
                    className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
                    type='email'
                    placeholder='Email address'
                />

                <input
                    required
                    onChange={onChangeHandler}
                    name='street'
                    value={formData.street}
                    className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
                    type='text'
                    placeholder='Street'
                />

                <div className='flex gap-3'>
                    <input
                        required
                        onChange={onChangeHandler}
                        name='city'
                        value={formData.city}
                        className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
                        type='text'
                        placeholder='City'
                    />

                    <input
                        onChange={onChangeHandler}
                        name='state'
                        value={formData.state}
                        className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
                        type='text'
                        placeholder='State'
                    />
                </div>

                <div className='flex gap-3'>
                    <input
                        required
                        onChange={onChangeHandler}
                        name='zipcode'
                        value={formData.zipcode}
                        className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
                        type='text'
                        placeholder='Zipcode'
                    />

                    <input
                        required
                        onChange={onChangeHandler}
                        name='country'
                        value={formData.country}
                        className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
                        type='text'
                        placeholder='Country'
                    />
                </div>

                <input
                    required
                    onChange={onChangeHandler}
                    name='phone'
                    value={formData.phone}
                    className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
                    type='tel'
                    placeholder='Phone'
                />

            </div>

            {/* RIGHT SIDE: TOTAL AND PAYMENT */}
            <div className='mt-8'>

                <div className='mt-8 min-w-80'>
                    <CartTotal />
                </div>

                <div className='mt-12'>

                    <p className='prata-regular my-2 gap-2'>
                        Payment Method
                    </p>

                    {/* PAYMENT METHOD SELECTION */}
                    <div className='flex gap-3 flex-col lg:flex-row'>

                        {/* STRIPE */}
                        <div
                            onClick={() => {
                                setMethod('stripe')
                                setPaypalOrder(null)
                            }}
                            className='flex items-center gap-3 border p-2 px-8 cursor-pointer'
                        >
                            <p
                                className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''
                                    }`}
                            ></p>

                            <img
                                className='h-5 mx-4'
                                src={assets.stripe_logo}
                                alt='Stripe'
                            />
                        </div>

                        {/* PAYPAL */}
                        <div
                            onClick={() => setMethod('paypal')}
                            className='flex items-center gap-3 border p-2 px-8 cursor-pointer'
                        >
                            <p
                                className={`min-w-3.5 h-3.5 border rounded-full ${method === 'paypal' ? 'bg-green-400' : ''
                                    }`}
                            ></p>

                            <img
                                className='h-5 mx-4'
                                src={assets.paypal}
                                alt='PayPal'
                            />
                        </div>

                    </div>

                    {/* PLACE ORDER BUTTON */}
                    {!paypalOrder && (
                        <div className='w-full text-end mt-8'>
                            <button
                                type='submit'
                                disabled={loading}
                                className='bg-black text-white px-28 py-3 text-sm disabled:opacity-50'
                            >
                                {loading ? 'PLEASE WAIT...' : 'PLACE ORDER'}
                            </button>
                        </div>
                    )}

                    {/* PAYPAL CHECKOUT BUTTONS */}
                    {method === 'paypal' && paypalOrder && (
                        <div className='mt-6 w-full min-w-64'>

                            <p className='text-sm mb-3'>
                                Complete your payment securely with PayPal.
                            </p>

                            <PayPalScriptProvider
                                options={{
                                    'client-id': import.meta.env.VITE_PAYPAL_CLIENTID,
                                    currency: 'MYR',
                                    intent: 'capture'
                                }}
                            >
                                <PayPalButtons
                                    style={{
                                        layout: 'vertical',
                                        shape: 'rect',
                                        label: 'paypal'
                                    }}
                                    disabled={loading}
                                    createOrder={() => {
                                        return paypalOrder.paypalOrderId
                                    }}
                                    onApprove={onPayPalApprove}
                                    onCancel={() => {
                                        toast.info('PayPal checkout cancelled.')
                                    }}
                                    onError={(error) => {
                                        console.error('PayPal error:', error)
                                        toast.error(
                                            'PayPal encountered an error. Please try again.'
                                        )
                                    }}
                                />
                            </PayPalScriptProvider>

                            <button
                                type='button'
                                onClick={cancelPayPalCheckout}
                                className='w-full border border-gray-300 py-2 mt-3 text-sm'
                            >
                                Cancel PayPal Checkout
                            </button>

                        </div>
                    )}

                </div>
            </div>

        </form>
    )
}

export default PlaceOrder
