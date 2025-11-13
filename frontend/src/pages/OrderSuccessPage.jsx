// src/pages/OrderSuccessPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

function OrderSuccessPage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-green-600 mb-4">
        Payment Successful!
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        Thank you for your order. We've received your payment.
      </p>
      <Link
        to="/"
        className="bg-blue-600 text-white font-bold py-3 px-8 rounded hover:bg-blue-700"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default OrderSuccessPage;