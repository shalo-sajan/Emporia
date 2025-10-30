# orders/serializers.py

from rest_framework import serializers
from .models import Order, OrderItem
from store.models import Product
from store.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    # We include a nested ProductSerializer to show product details
    # We set it to read_only=True because we'll handle creation manually
    product = ProductSerializer(read_only=True)
    
    # This 'product_id' is what the frontend will send in the cart
    # It's 'write_only' because we only use it to *create* the OrderItem
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), write_only=True, source='product'
    )
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'price', 'quantity']
        read_only_fields = ['price'] # Price will be set from the Product


class OrderSerializer(serializers.ModelSerializer):
    # This is our nested serializer. It will handle the list of items
    # in the cart.
    items = OrderItemSerializer(many=True)
    
    # We'll send back the total cost, which is a 'model method'
    total_cost = serializers.SerializerMethodField(read_only=True)
    
    # We'll send back the customer's email
    customer_email = serializers.EmailField(source='customer.email', read_only=True)

    class Meta:
        model = Order
        # These are the fields the frontend will POST
        fields = [
            'id', 
            'first_name', 
            'last_name', 
            'email', 
            'address', 
            'postal_code', 
            'city',
            'items', # The nested list of cart items
            'total_cost',
            'customer_email',
            'paid',
            'razorpay_order_id',
        ]
        read_only_fields = ['id', 'total_cost', 'customer_email', 'paid', 'razorpay_order_id']

    def get_total_cost(self, obj):
        return obj.get_total_cost()

    def create(self, validated_data):
        """
        This is the custom logic for creating an Order and its
        associated OrderItems from the nested 'items' data.
        """
        # Pop the 'items' data from the validated data
        items_data = validated_data.pop('items')
        
        # We set the 'customer' automatically from the request user
        validated_data['customer'] = self.context['request'].user
        
        # Create the Order instance (e.g., with shipping info)
        order = Order.objects.create(**validated_data)

        total_cost = 0
        
        # Loop through each item in the cart data
        for item_data in items_data:
            product = item_data['product'] # This is the Product object
            quantity = item_data['quantity']

            # Check if there is enough stock
            if product.stock < quantity:
                # If not, roll back the transaction and raise an error
                order.delete() # Delete the order we just created
                raise serializers.ValidationError(
                    f"Not enough stock for {product.name}. Available: {product.stock}"
                )

            # Create the OrderItem
            order_item = OrderItem.objects.create(
                order=order,
                product=product,
                # --- This is a crucial step ---
                # We save the price from the *Product* at the time of purchase
                price=product.price, 
                quantity=quantity
            )
            
            # --- Update the product stock ---
            product.stock -= quantity
            product.save()

        return order