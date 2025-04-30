from rest_framework import filters, viewsets
from rest_framework.generics import GenericAPIView

from apps.business_app.models.category import Category
from apps.business_app.models.shipping_type import ShippingType
from apps.business_app.serializers.category import (
    CategorySerializer,
)
from django_filters.rest_framework import DjangoFilterBackend

from apps.business_app.serializers.shipping_type import ShippingTypeSerializer
from apps.common.common_ordering_filter import CommonOrderingFilter
from apps.common.mixins.serializer_map import SerializerMapMixin

from rest_framework.permissions import IsAuthenticatedOrReadOnly


class ShippingTypeViewSet(SerializerMapMixin, viewsets.ModelViewSet, GenericAPIView):
    queryset = ShippingType.objects.all()
    serializer_class = ShippingTypeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        CommonOrderingFilter,
    ]

    search_fields = [
        "name",
        "description",
    ]
    ordering = ["id"]
    ordering_fields = [
        "id",
        "name",
    ]
