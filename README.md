# shopify-challenge


Task: Barebones of a market place

The basic functionality of this node application include the following: you can add products to the market place, add items to your cart and complete your purchase

REST DOCUMENTATION
the default port is 4000, this can be changed in the config file locatated at confg/config.js


Product endpoints:

Description: Add a product to the market place. Products have a name, price and inventory
Type: POST
url: http://localhost:4000/product
body: {
	"name": "t-shirt",
	"price": "36",
	"inventory": "100"
}

Description: Get information regarding a product
Type: GET
url : http://localhost:4000/product

Description: Make changes to a product. The body contains a list of objects in the form of {propName: name, value: }
Type: PATCH
url: http://localhost:4000/product
body:
 [
    {"propName" : "price",
    "value" : "1000"}
  ]
}


Cart endpoints:

Description: Create a new cart. Body of request is empty. This returns a token. The token acts as a unique identifier for the cart and expires in 24 hours so be sure to complete your shopping activities within that time frame. A sample token is provided below
Type: POST
url: http://localhost:4000/cart

Description: Add an item to the cart
Type: POST
url: http://localhost:4000/cart
body: 
{
  "productId" : "5c450706595b4e2f8684515c"
}
header: token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXJ0VHlwZSI6ImRlZmF1bHQiLCJpYXQiOjE1NDgwMzE2OTIsImV4cCI6MTU0ODAzNTI5Mn0.PcBbaJXHnGYvAHmVfVGo103mPk2XeXdotSnVIv_iE-o



Description: Delete item from your cart
Type: Delete
url: http://localhost:4000/product/:ProductId
header: token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXJ0VHlwZSI6ImRlZmF1bHQiLCJpYXQiOjE1NDgwMzE2OTIsImV4cCI6MTU0ODAzNTI5Mn0.PcBbaJXHnGYvAHmVfVGo103mPk2XeXdotSnVIv_iE-o


PurchaseOrder endpoints

Desctiption: make a purchase
Type: POST
url: http://localhost:4000/purchase_order
header: token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXJ0VHlwZSI6ImRlZmF1bHQiLCJpYXQiOjE1NDgwMzE2OTIsImV4cCI6MTU0ODAzNTI5Mn0.PcBbaJXHnGYvAHmVfVGo103mPk2XeXdotSnVIv_iE-o
