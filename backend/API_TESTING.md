# API Testing Guide for Pizza Delivery Backend

Backend is running at: http://localhost:4000

## Test the APIs

### 1. Register a User
```bash
curl -X POST http://localhost:4000/api/user/register -H "Content-Type: application/json" -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\",\"phone\":\"1234567890\",\"addressLine1\":\"123 Main St\",\"addressLine2\":\"Apt 4B\"}"
```

### 2. Login
```bash
curl -X POST http://localhost:4000/api/user/login -H "Content-Type: application/json" -d "{\"email\":\"john@example.com\",\"password\":\"password123\"}"
```
Save the token from response for authenticated requests.

### 3. Get Profile (requires token)
```bash
curl -X GET http://localhost:4000/api/user/profile -H "token: YOUR_TOKEN_HERE"
```

### 4. Get All Menu Items
```bash
curl -X GET http://localhost:4000/api/item/list
```

### 5. Add Menu Item (multipart/form-data)
```bash
curl -X POST http://localhost:4000/api/item/add -F "name=Margherita Pizza" -F "description=Classic cheese pizza" -F "price=12.99" -F "category=Pizza" -F "image=@path/to/image.jpg"
```

### 6. Place Order (requires token)
```bash
curl -X POST http://localhost:4000/api/order/place -H "Content-Type: application/json" -H "token: YOUR_TOKEN_HERE" -d "{\"items\":[{\"itemId\":\"ITEM_ID\",\"name\":\"Margherita Pizza\",\"price\":12.99,\"quantity\":2}],\"totalAmount\":25.98,\"address\":{\"line1\":\"123 Main St\",\"line2\":\"Apt 4B\"},\"phone\":\"1234567890\",\"paymentMethod\":\"COD\"}"
```

### 7. Get User Orders (requires token)
```bash
curl -X GET http://localhost:4000/api/order/user -H "token: YOUR_TOKEN_HERE"
```

## Using PowerShell (Windows)

```powershell
# Register User
Invoke-WebRequest -Uri "http://localhost:4000/api/user/register" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"name":"John Doe","email":"john@example.com","password":"password123","phone":"1234567890","addressLine1":"123 Main St","addressLine2":"Apt 4B"}'

# Login
$response = Invoke-WebRequest -Uri "http://localhost:4000/api/user/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"john@example.com","password":"password123"}'
$response.Content

# Get Profile (replace TOKEN with actual token)
Invoke-WebRequest -Uri "http://localhost:4000/api/user/profile" -Method GET -Headers @{"token"="YOUR_TOKEN_HERE"}
```

## Using Postman or Thunder Client (VS Code)

1. Import these endpoints into your API client
2. For authenticated routes, add header: `token: YOUR_JWT_TOKEN`
3. For file uploads, use form-data with the image file

## Database Check

Your data is being stored in MongoDB Atlas at:
`mongodb+srv://cluster0.8xpsdxw.mongodb.net`

You can verify data using:
1. MongoDB Compass (connect with your MONGODB_URI)
2. MongoDB Atlas web interface
