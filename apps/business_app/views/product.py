from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets, permissions
from rest_framework.generics import GenericAPIView

from apps.business_app.models.product import Product
from apps.business_app.serializers.product import (
    ProductSerializer,
)

from apps.common.common_ordering_filter import CommonOrderingFilter
from apps.common.mixins.serializer_map import SerializerMapMixin
from apps.common.pagination import AllResultsSetPagination
from django.db.models import F


class ProductViewSet(SerializerMapMixin, viewsets.ModelViewSet, GenericAPIView):
    queryset = Product.objects.all().annotate(
        category_name=F("category__name"),
        price_by_weight=F("category__price_by_weight"),
        sub_category_name=F("sub_category__name"),
        priced_per_unit=F("category__priced_per_unit"),
        in_cuba=F("category__in_cuba"),
    )
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        CommonOrderingFilter,
    ]
    pagination_class = AllResultsSetPagination
    filterset_fields = [
        "category",
        "sub_category",
    ]
    search_fields = [
        "name",
        "description",
    ]
    ordering = ["name", "sub_category_name"]

    ordering_fields = [
        "name",
        "category_name",
        "sub_category_name",
        "description",
        "sub_category",
    ]
