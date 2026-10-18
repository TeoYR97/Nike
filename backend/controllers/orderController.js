import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import axios from "axios";

// Global variables
const currency = "myr";
const deliveryCharge = 10;

const paypalCurrency = process.env.PAYPAL_CURRENCY || "MYR";
const paypalBaseUrl =
    process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// ==========================================
// PAYPAL: GET ACCESS TOKEN
// ==========================================
const getPayPalAccessToken = async () => {
    const response = await axios.post(
        `${paypalBaseUrl}/v1/oauth2/token`,
        new URLSearchParams({
            grant_type: "client_credentials",
        }),
        {
            auth: {
                username: process.env.PAYPAL_CLIENT_ID,
                password: process.env.PAYPAL_CLIENT_SECRET,
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    if (!response.data.access_token) {
        throw new Error("Unable to obtain PayPal access token.");
    }

    return response.data.access_token;
};


// ==========================================
// PLACE ORDER USING COD
// Kept for compatibility, although the frontend
// will no longer offer COD.
// ==========================================
const placeOrder = async (req, res) => {
    try {
        const { items, amount, address, userId } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authentication required.",
            });
        }

        const newOrder = new orderModel({
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
        });
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        return res.json({
            success: true,
            message: "Order placed.",
        });
    } catch (error) {
        console.error("COD order error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ==========================================
// PLACE ORDER USING STRIPE
// ==========================================
const placeOrderStripe = async (req, res) => {
    let newOrder;

    try {
        const { items, amount, address, userId } = req.body;
        const { origin } = req.headers;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authentication required.",
            });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty.",
            });
        }

        newOrder = new orderModel({
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now(),
        });
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(Number(item.price) * 100),
            },
            quantity: Number(item.quantity),
        }));

        line_items.push({
            price_data: {
                currency,
                product_data: {
                    name: "Delivery Charges",
                },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: "payment",
        });

        return res.json({
            success: true,
            session_url: session.url,
        });
    } catch (error) {
        console.error("Stripe order error:", error);

        // Remove the pending order if checkout creation failed
        if (newOrder?._id) {
            await orderModel.findByIdAndDelete(newOrder._id).catch(console.error);
        }

        return res.status(500).json({
            success: false,
            message: error.response?.data?.error?.message || error.message,
        });
    }
};


// ==========================================
// VERIFY STRIPE PAYMENT
// ==========================================
const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body;

    try {
        const order = await orderModel.findOne({
            _id: orderId,
            userId,
            paymentMethod: "Stripe",
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        if (success === "true") {
            // In production, verify the Stripe session/payment on
            // the server before marking the order as paid.
            order.payment = true;
            await order.save();

            await userModel.findByIdAndUpdate(userId, { cartData: {} });

            return res.json({ success: true });
        }

        return res.json({ success: false });
    } catch (error) {
        console.error("Stripe verification error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ==========================================
// PAYPAL: CREATE ORDER
// Frontend endpoint: POST /api/order/paypal/create
// ==========================================
const createPayPalOrder = async (req, res) => {
    let newOrder;

    try {
        const { items, amount, address, userId } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authentication required.",
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty.",
            });
        }

        const totalAmount = Number(amount);

        if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid order amount.",
            });
        }

        // Save the order as unpaid first
        newOrder = new orderModel({
            userId,
            items,
            address,
            amount: totalAmount,
            paymentMethod: "PayPal",
            payment: false,
            date: Date.now(),
        });
        await newOrder.save();

        const accessToken = await getPayPalAccessToken();

        // Create the PayPal order
        const paypalResponse = await axios.post(
            `${paypalBaseUrl}/v2/checkout/orders`,
            {
                intent: "CAPTURE",
                purchase_units: [
                    {
                        reference_id: String(newOrder._id),
                        description: "Nike online store order",
                        amount: {
                            currency_code: paypalCurrency,
                            value: totalAmount.toFixed(2),
                        },
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const paypalOrderId = paypalResponse.data.id;

        // Save the PayPal order ID against our order
        newOrder.paypalOrderId = paypalOrderId;
        await newOrder.save();

        return res.json({
            success: true,
            paypalOrderId,
            mongoOrderId: String(newOrder._id),
        });
    } catch (error) {
        console.error(
            "PayPal create order error:",
            error.response?.data || error.message
        );

        // Avoid leaving an unusable pending order if creation failed
        if (newOrder?._id) {
            await orderModel.findByIdAndDelete(newOrder._id).catch(console.error);
        }

        return res.status(500).json({
            success: false,
            message:
                error.response?.data?.message ||
                error.response?.data?.error_description ||
                error.message,
        });
    }
};


// ==========================================
// PAYPAL: CAPTURE PAYMENT
// Frontend endpoint: POST /api/order/paypal/capture
// ==========================================
const capturePayPalOrder = async (req, res) => {
    try {
        const { paypalOrderId, mongoOrderId, userId } = req.body;

        if (!userId || !paypalOrderId || !mongoOrderId) {
            return res.status(400).json({
                success: false,
                message: "Missing payment or order information.",
            });
        }

        // Only allow the authenticated user to capture their own order
        const order = await orderModel.findOne({
            _id: mongoOrderId,
            userId,
            paymentMethod: "PayPal",
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        if (order.paypalOrderId !== paypalOrderId) {
            return res.status(400).json({
                success: false,
                message: "PayPal order ID does not match the saved order.",
            });
        }

        // Do not capture the same order again after it is paid
        if (order.payment === true) {
            return res.json({
                success: true,
                message: "Order has already been paid.",
            });
        }

        const accessToken = await getPayPalAccessToken();

        const captureResponse = await axios.post(
            `${paypalBaseUrl}/v2/checkout/orders/${encodeURIComponent(
                paypalOrderId
            )}/capture`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const paymentData = captureResponse.data;
        const purchaseUnits = paymentData.purchase_units || [];

        // Prefer the purchase unit linked to this order. If PayPal returns
        // exactly one unit without a matching reference_id, use that one.
        const matchingUnits = purchaseUnits.filter(
            (unit) => unit.reference_id === String(order._id)
        );

        const purchaseUnit =
            matchingUnits.length === 1
                ? matchingUnits[0]
                : matchingUnits.length === 0 && purchaseUnits.length === 1
                    ? purchaseUnits[0]
                    : undefined;

        const capture = purchaseUnit?.payments?.captures?.[0];

        // Verify that PayPal confirms a completed capture
        if (
            paymentData.status !== "COMPLETED" ||
            capture?.status !== "COMPLETED"
        ) {
            return res.status(400).json({
                success: false,
                message: "PayPal has not confirmed a completed payment.",
            });
        }

        // Check the captured currency and amount against the saved order
        if (
            capture.amount?.currency_code !== paypalCurrency ||
            Number(capture.amount?.value) !== Number(order.amount)
        ) {
            return res.status(400).json({
                success: false,
                message: "Captured amount or currency does not match the order.",
            });
        }

        // Mark the order paid only after verification
        order.payment = true;
        await order.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        return res.json({
            success: true,
            message: "PayPal payment completed.",
        });
    } catch (error) {
        console.error(
            "PayPal capture error:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            success: false,
            message:
                error.response?.data?.message ||
                error.message ||
                "Unable to capture PayPal payment.",
        });
    }
};


// ==========================================
// ALL ORDERS FOR ADMIN PANEL
// ==========================================
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});

        return res.json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("All orders error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ==========================================
// USER ORDERS FOR FRONTEND
// ==========================================
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;

        const orders = await orderModel.find({ userId });

        return res.json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("User orders error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ==========================================
// UPDATE ORDER STATUS FROM ADMIN PANEL
// ==========================================
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        await orderModel.findByIdAndUpdate(orderId, { status });

        return res.json({
            success: true,
            message: "Status Updated",
        });
    } catch (error) {
        console.error("Update status error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export {
    verifyStripe,
    placeOrder,
    placeOrderStripe,
    createPayPalOrder,
    capturePayPalOrder,
    allOrders,
    userOrders,
    updateStatus,
};