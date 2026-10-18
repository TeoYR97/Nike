import express from 'express'
import {placeOrder, placeOrderStripe, allOrders, userOrders, updateStatus, verifyStripe, createPayPalOrder, capturePayPalOrder} from '../controllers/orderController.js'
import adminAuth  from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

// Payment Features
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/stripe',authUser,placeOrderStripe)


// User Feature 
orderRouter.post('/userorders',authUser,userOrders)

// verify payment
orderRouter.post('/verifyStripe',authUser, verifyStripe)

//Paypal
orderRouter.post('/paypal/create', authUser, createPayPalOrder)
orderRouter.post('/paypal/capture', authUser, capturePayPalOrder)


export default orderRouter