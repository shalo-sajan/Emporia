# store/urls.py

from django.urls import path
from . import views

urlpatterns = [
    # --- Public Customer Endpoints ---
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('products/', views.ProductListView.as_view(), name='product-list'),
    path('products/<slug:slug>/', views.ProductDetailView.as_view(), name='product-detail'),
    
    # --- Protected Seller Endpoints ---
    path('seller/dashboard/', views.SellerProductDashboard.as_view(), name='seller-dashboard'),
    path('seller/dashboard/<slug:slug>/', views.SellerProductDetailView.as_view(), name='seller-product-detail'),
]