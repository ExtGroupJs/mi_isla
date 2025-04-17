from rest_framework import filters, viewsets
from rest_framework.generics import GenericAPIView

from apps.business_app.models.category import Category, Model
from apps.business_app.serializers.category import (
    CategorySerializer,
    ReadModelSerializer,
)
from django_filters.rest_framework import DjangoFilterBackend

from apps.common.common_ordering_filter import CommonOrderingFilter
from apps.common.mixins.serializer_map import SerializerMapMixin

from apps.common.permissions import CommonRolePermission, SellViewSetPermission
from django.db.models import F
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny


class CategoryViewSet(SerializerMapMixin, viewsets.ModelViewSet, GenericAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [CommonRolePermission]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        CommonOrderingFilter,
    ]
    filterset_fields = [
        "brand",
    ]
    search_fields = [
        "name",
        "extra_info",
    ]
    ordering = ["name"]
    ordering_fields = [
        "name",
    ]

    def get_permissions(self):
        if self.action == "list":
            permission_classes = [SellViewSetPermission]
        else:
            permission_classes = self.permission_classes
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=["GET"], permission_classes=[AllowAny])
    def catalog(self, request):
        return self.list(request)
