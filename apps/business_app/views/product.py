from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets
from rest_framework.generics import GenericAPIView

from apps.business_app.models.product import Product
from apps.business_app.serializers.product import (
    ProductSerializer,
    ReadProductSerializer,
)

from apps.common.common_ordering_filter import CommonOrderingFilter
from apps.common.mixins.serializer_map import SerializerMapMixin
from apps.common.pagination import AllResultsSetPagination

from apps.common.permissions import CommonRolePermission
from django.db.models import Value, F
from django.db.models.functions import Concat


class ProductViewSet(SerializerMapMixin, viewsets.ModelViewSet, GenericAPIView):
    queryset = (
        Product.objects.all()
        .select_related("category")
        .annotate(category_name=F("category__name"))
    )
    serializer_class = ProductSerializer
    permission_classes = [CommonRolePermission]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        CommonOrderingFilter,
    ]
    pagination_class = AllResultsSetPagination
    filterset_fields = [
        "category",
    ]
    search_fields = [
        "name",
        "description",
    ]
    ordering = ["name"]
    ordering_fields = ["name", "category__name", "description"]
