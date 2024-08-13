
# Furniture Store UI

A modern e-commerce platform for buying and selling furniture online. This project uses a variety of tools and technologies to create a responsive, interactive, and efficient user experience.

![image](https://github.com/user-attachments/assets/2865cbd5-cfc8-4997-b2c4-053f3204533d)


## Table of Contents

-   [Tech Stack](#tech-stack)
-   [Features](#features)
-   [Installation](#installation)
-   [Project Structure](#project-structure)
-   [API Endpoints](#api-endpoints)

## Tech Stack

-   [ReactJS](https://reactjs.org/): JavaScript library for building user interfaces.
-   [TailwindCSS](https://tailwindcss.com/): Utility-first CSS framework for styling.
-   [Zustand](https://zustand-demo.pmnd.rs/): State management library.
-   [SwiperJS](https://swiperjs.com/): React slider library.
-   [React-hot-toast](https://react-hot-toast.com/): Notification library.
-   [Axios](https://axios-http.com/): Promise-based HTTP client for making requests.
-   [Formik](https://formik.org/): Form handling in React.
-   [model-viewer](https://modelviewer.dev/): Web component for rendering 3D models.
-   [NProgress](https://ricostacruz.com/nprogress): Progress bar loading when change route.

## Features

-   **Product Catalog**: Browse furniture by category, view details, and check availability.
-   **3D Product Viewing**: Explore furniture models in 3D using the `model-viewer` component.
-   **User Authentication**: Secure login and registration using JWT tokens.
-   **Cart & Checkout**: Add products to the cart, proceed with checkout, and make payments through PayPal and VNPAY.
-   **Order Management**: Track and manage orders through an admin panel.
-   **Responsive Design**: Fully responsive design with TailwindCSS, optimized for all devices.

## Installation
1. Set up environment variables:
```plaintext
VITE_PAYPAL_CLIENT_ID=<Your paypal client id>
```

2. Install dependences: 
```bash
npm install
```
3. Run the development server:
```bash
npm run dev
```

## Project Structure

```plaintext
src/
├── assets/
├── components/
├── layouts/
├── pages/
├── routes/
├── store/
├── utils/
```

## Api Endpoints

The UI interacts with the following backend API endpoints:

#### Authentication

-   `[POST] api/auth/login`: Logs in a user and retrieves an access token.
-   `[POST] api/auth/register`: Registers a new user.
-   `[PATCH] api/auth/logout`: Log out the current user.

#### Product

-   `[GET] api/products`: Get all the products.
-   `[GET] api/products/:slug`: Get product by slug.
-   `[GET] api/products/search/:query`: Search product by query.
-   `[GET] api/tags/:tag`: Get product by tag name.
-   `[GET] api/brands/:brand`: Get product by brand name.

#### Categories

-   `[GET] api/categories/`: Get all the categories.
-   `[GET] api/categories/:slug`: Get category by slug.

#### Cart

-   `[GET] api/cart`: Get cart of the current user.
-   `[POST] api/cart`: Add a item to the current user's cart.
-   `[PATCH] api/cart`: Update quantity of products in the cart.
-   `[DELETE] api/cart/clear`: Remove all the items in the cart.
-   `[DELETE] api/cart/:id`: Remove item by id in the cart.

#### Order

-   `[POST] api/orders`: Create order.
-   `[GET] api/orders`: Get all the orders of the current user.
-   `[GET] api/orders/create-vnpay-url`: Get the VN Pay url to checkout the order.
-   `[POST] api/orders/vnpay-return`: After payment, vnpay will return a url. We will send the url to this endpoint to process the order.

#### Wishlist

-   `[GET] api/wishlist`: Get wishlist of the current user.
-   `[POST] api/wishlist`: Add a item to the current user's wishlist.
-   `[DELETE] api/wishlist/:productId`: Remove product from the current user's wishlist.

#### Promocode

-   `[GET] api/promo-code/:promoCode`: Apply the promo code to the current user.

#### Product review

-   `[POST] api/reviews/:productId`: Add a user's comment to the product.

#### User addresses

-   `[POST] api/addresses`: Create a new address for the current user.
-   `[PATCH] api/addresses/:addressId`: Set default address by id.
-   `[PUT] api/addresses/:addressId`: Update address information by id.
-   `[DELETE] api/addresses/:addressId`: Delete address by id.

#### Slider and blogs

-   `[GET] api/sliders`: Get all the sliders.
-   `[GET] api/blogs`: Get all the blogs.
-   `[GET] api/blogs/:slug`: Get blog by slug.
