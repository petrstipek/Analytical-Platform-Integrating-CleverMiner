from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema
from rest_framework import permissions
from rest_framework.generics import RetrieveUpdateAPIView

from accounts.api.serializer import UserMeSerializer


class UserMeView(RetrieveUpdateAPIView):
    serializer_class = UserMeSerializer
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        responses={200: OpenApiTypes.OBJECT},
        description="user me endpoint",
    )
    def get_object(self):
        return self.request.user
