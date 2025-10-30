# orders/admin.py

from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    """
    This allows you to add/edit OrderItems directly
    from the Order admin page.
    """
    model = OrderItem
    # 'raw_id_fields' is a popup search, better than a huge dropdown
    raw_id_fields = ['product'] 
    extra = 0 # Don't show any empty extra forms

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'customer', 'first_name', 'last_name', 
        'paid', 'created_at', 'razorpay_order_id'
    )
    list_filter = ('paid', 'created_at')
    search_fields = ('id', 'customer__email', 'first_name', 'last_name')
    
    # This is where we add the 'OrderItemInline'
    inlines = [OrderItemInline]