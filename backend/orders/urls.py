# orders/urls.py

from django.urls import path
from . import views

urlpatterns = [
    # 1. POST to this to create an order in our DB
    path('create/', views.OrderCreateView.as_view(), name='order-create'),
    
    # 2. POST to this (with an 'order_id') to create a Razorpay order
    path('pay/', views.StartPaymentView.as_view(), name='start-payment'),
    
    # 3. POST to this with Razorpay IDs to verify payment
    path('verify-payment/', views.PaymentVerificationView.as_view(), name='verify-payment'),
]