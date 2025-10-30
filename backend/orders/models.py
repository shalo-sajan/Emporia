# orders/models.py

from django.db import models
from django.conf import settings
from store.models import Product

# 1. --- Order Model ---
# This will be the main "receipt" for a customer's purchase.

class Order(models.Model):
    # --- Cross-App Interaction ---
    # Link to the user who placed the order
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL, # If user is deleted, keep order history
        null=True,
        related_name='orders'
    )
    
    # --- Shipping & Payment Details ---
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    address = models.CharField(max_length=250)
    postal_code = models.CharField(max_length=20)
    city = models.CharField(max_length=100)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # --- Payment Info ---
    paid = models.BooleanField(default=False) # Has the payment gone through?
    razorpay_order_id = models.CharField(max_length=255, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=255, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        ordering = ('-created_at',)

    def __str__(self):
        return f"Order {self.id} by {self.customer.email}"

    # --- Model Method ---
    # This is the 'get_total_cost' method from our plan.
    def get_total_cost(self):
        """Calculates the total cost of the order."""
        return sum(item.get_cost() for item in self.items.all())


# 2. --- OrderItem Model ---
# This is a single item *within* an order (e.g., 2 x "Bose TWS").

class OrderItem(models.Model):
    # --- Foreign Keys ---
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE, # If order is deleted, delete its items
        related_name='items'
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL, # If product is deleted, keep it in order history
        null=True,
        related_name='order_items'
    )
    
    # --- Snapshot Details ---
    # We store the price and quantity here as a "snapshot"
    # so even if the Product's price changes later, this order's
    # history is preserved.
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.id} ({self.product.name})"

    # --- Model Method ---
    def get_cost(self):
        """Calculates the cost of this single line item."""
        return self.price * self.quantity