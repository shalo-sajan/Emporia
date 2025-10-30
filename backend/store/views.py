# store/views.py

from rest_framework import generics, permissions
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer
from .permissions import IsApprovedSeller, IsProductOwner

# --- 1. Public Views (for Customers) ---

class CategoryListView(generics.ListAPIView):
    """
    Public endpoint to list all categories.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny] # Anyone can see categories

class ProductListView(generics.ListAPIView):
    """
    Public endpoint to list all available products.
    """
    queryset = Product.objects.filter(available=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny] # Anyone can see products

class ProductDetailView(generics.RetrieveAPIView):
    """
    Public endpoint to view a single product's details.
    'lookup_field = "slug"' tells DRF to find the product by its 'slug' field,
    not its 'id'. This is better for SEO (e.g., /api/products/my-new-shoes/).
    """
    queryset = Product.objects.filter(available=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

# --- 2. Protected Views (for Sellers) ---

class SellerProductDashboard(generics.ListCreateAPIView):
    """
    Protected endpoint for a seller to:
    - LIST all of their own products.
    - CREATE a new product.
    """
    serializer_class = ProductSerializer
    # This view is only for approved sellers
    permission_classes = [permissions.IsAuthenticated, IsApprovedSeller]

    def get_queryset(self):
        """
        This view should only return products owned by the currently
        logged-in seller.
        """
        # We get the SellerProfile linked to the logged-in user
        user_profile = self.request.user.sellerprofile
        return Product.objects.filter(seller=user_profile)

    def perform_create(self, serializer):
        """
        When a new product is created, automatically assign it to
        the logged-in seller.
        """
        # This is the "Model Method" concept in action for the API.
        user_profile = self.request.user.sellerprofile
        serializer.save(seller=user_profile)

class SellerProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Protected endpoint for a seller to:
    - RETRIEVE, UPDATE, or DELETE one of their *own* products.
    """
    serializer_class = ProductSerializer
    # This view requires the user to be an approved seller
    # AND the owner of the product.
    permission_classes = [permissions.IsAuthenticated, IsApprovedSeller, IsProductOwner]
    lookup_field = 'slug'

    def get_queryset(self):
        """
        This view should only allow modification of products
        owned by the currently logged-in seller.
        """
        user_profile = self.request.user.sellerprofile
        return Product.objects.filter(seller=user_profile)