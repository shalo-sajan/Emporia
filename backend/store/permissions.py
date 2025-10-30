# store/permissions.py

from rest_framework import permissions

class IsApprovedSeller(permissions.BasePermission):
    """
    Custom permission to only allow approved sellers to access an object.
    """
    message = "You are not an approved seller."

    def has_permission(self, request, view):
        # Check if user is authenticated, is a 'SELLER', and has an approved profile
        return (
            request.user.is_authenticated and
            request.user.role == 'SELLER' and
            hasattr(request.user, 'sellerprofile') and
            request.user.sellerprofile.is_approved
        )

class IsProductOwner(permissions.BasePermission):
    """
    Custom permission to only allow the owner of a product to edit it.
    """
    message = "You do not have permission to modify this product."
    
    def has_object_permission(self, request, view, obj):
        # The product's seller must be the same as the logged-in user's profile
        return obj.seller == request.user.sellerprofile