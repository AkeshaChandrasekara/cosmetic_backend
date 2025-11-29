import Order from "../models/order.js";

function generateOrderId() {
    return 'ORD' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function getCurrentUserEmailFromToken(req) {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return null;
    
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        return payload.email || payload.sub;
    } catch (e) {
        return null;
    }
}

export async function createOrder(req, res) {
    try {
        console.log('Received order creation request');
        console.log('Request body:', req.body);
        
        const orderData = req.body;
        const userEmail = getCurrentUserEmailFromToken(req);
        
        console.log('User email from token:', userEmail);
        
        if (!userEmail) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        
        if (!orderData.shippingDetails || !orderData.items || !orderData.totalAmount) {
            return res.status(400).json({ 
                message: "Missing required fields: shippingDetails, items, totalAmount" 
            });
        }

        const order = new Order({
            ...orderData,
            orderId: generateOrderId(),
            userEmail: userEmail
        });

        console.log('Saving order to database...');
        await order.save();
        console.log('Order saved successfully');

        res.status(201).json({
            message: "Order created successfully",
            orderId: order.orderId,
            order: order
        });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            message: "Failed to create order",
            error: error.message
        });
    }
}

export async function getOrders(req, res) {
    try {
        const userEmail = getCurrentUserEmailFromToken(req);
        
        if (!userEmail) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const orders = await Order.find({ userEmail: userEmail }).sort({ createdAt: -1 });
        
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            message: "Failed to fetch orders",
            error: error.message
        });
    }
}

export async function getOrderById(req, res) {
    try {
        const { orderId } = req.params;
        const userEmail = getCurrentUserEmailFromToken(req);
        
        const order = await Order.findOne({ orderId: orderId, userEmail: userEmail });
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        
        res.json(order);
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({
            message: "Failed to fetch order",
            error: error.message
        });
    }
}