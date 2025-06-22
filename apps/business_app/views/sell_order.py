from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets, permissions
from rest_framework.generics import GenericAPIView

from apps.business_app.models.sell_order import SellOrder

from apps.business_app.serializers.sell_order import SellOrderSerializer
from apps.common.common_ordering_filter import CommonOrderingFilter
from apps.common.mixins.serializer_map import SerializerMapMixin


class SellOrderViewSet(SerializerMapMixin, viewsets.ModelViewSet, GenericAPIView):
    queryset = SellOrder.objects.all()
    serializer_class = SellOrderSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        CommonOrderingFilter,
    ]
    ordering = ["-updated_timestamp"]
    ordering_fields = [
        "shipping_type",
        "weight",
        "subtotal_without_shipping",
        "total_with_shipping",
        "updated_timestamp",
    ]
