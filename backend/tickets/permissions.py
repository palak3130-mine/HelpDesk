from rest_framework.permissions import BasePermission
from accounts.models import User


class IsAdminUserRole(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == User.Role.ADMIN
        )


class IsStaffUserRole(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == User.Role.STAFF
        )


class IsClientUserRole(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == User.Role.CLIENT
        )


class IsAdminOrStaff(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in [
                User.Role.ADMIN,
                User.Role.STAFF,
            ]
        )