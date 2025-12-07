import nodemailer from 'nodemailer';

// Create transporter with SMTP configuration
const createTransporter = () => {
    // if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    //     throw new Error('SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS environment variables.');
    // }
    
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER, // Your email
            pass: process.env.SMTP_PASS, // Your email password or app password
        },
    });
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (userEmail, userName, orderDetails) => {
    try {
        const transporter = createTransporter();

        const { orderId, items, totalAmount, address, phone, paymentMethod, status } = orderDetails;

        // Format order items
        const itemsList = items.map(item => 
            `  • ${item.name || 'Item'} x${item.quantity || 1} - ₹${(item.price || 0) * (item.quantity || 1)}`
        ).join('\n');

        const mailOptions = {
            from: `"Pizza Delivery" <${process.env.SMTP_USER}>`,
            to: userEmail,
            subject: `Order Confirmation - Order #${orderId}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #ff6b35; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                        .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
                        .order-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
                        .item { padding: 8px 0; border-bottom: 1px solid #eee; }
                        .total { font-size: 18px; font-weight: bold; color: #ff6b35; margin-top: 15px; }
                        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🍕 Order Confirmed!</h1>
                        </div>
                        <div class="content">
                            <p>Dear ${userName},</p>
                            <p>Thank you for your order! We're excited to prepare your delicious pizza.</p>
                            
                            <div class="order-details">
                                <h3>Order Details</h3>
                                <p><strong>Order ID:</strong> ${orderId}</p>
                                <p><strong>Status:</strong> ${status}</p>
                                <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                                
                                <h4>Items Ordered:</h4>
                                <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${itemsList}</pre>
                                
                                <div class="total">
                                    <p>Total Amount: ₹${totalAmount}</p>
                                </div>
                                
                                <h4>Delivery Address:</h4>
                                <p>${address.line1}${address.line2 ? ', ' + address.line2 : ''}</p>
                                <p><strong>Phone:</strong> ${phone}</p>
                            </div>
                            
                            <p>We'll notify you once your order is out for delivery. Estimated delivery time: 30-45 minutes.</p>
                            <p>If you have any questions, please contact us.</p>
                            
                            <p>Best regards,<br>Pizza Delivery Team</p>
                        </div>
                        <div class="footer">
                            <p>This is an automated email. Please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
Order Confirmation - Order #${orderId}

Dear ${userName},

Thank you for your order! We're excited to prepare your delicious pizza.

Order Details:
Order ID: ${orderId}
Status: ${status}
Payment Method: ${paymentMethod}

Items Ordered:
${itemsList}

Total Amount: ₹${totalAmount}

Delivery Address:
${address.line1}${address.line2 ? ', ' + address.line2 : ''}
Phone: ${phone}

We'll notify you once your order is out for delivery. Estimated delivery time: 30-45 minutes.

Best regards,
Pizza Delivery Team
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent:', info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        return { success: false, error: error.message };
    }
};