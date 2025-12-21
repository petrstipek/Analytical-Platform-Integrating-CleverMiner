from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema
from rest_framework import permissions
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response


class HealthView(GenericAPIView):
    @extend_schema(
        responses={200: OpenApiTypes.OBJECT},
        description="Check if the API is running",
    )
    def get(self, request):
        return Response({"status": "ok"})


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user and request.user.is_staff:
            return True
        return getattr(obj, "owner_id", None) == request.user.id
