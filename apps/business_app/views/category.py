from rest_framework import filters, viewsets
from rest_framework.generics import GenericAPIView

from apps.business_app.models.category import Category
from apps.business_app.serializers.category import (
    CategorySerializer,
)
from django_filters.rest_framework import DjangoFilterBackend

from apps.common.common_ordering_filter import CommonOrderingFilter
from apps.common.mixins.serializer_map import SerializerMapMixin

from apps.common.permissions import CommonRolePermission, SellViewSetPermission
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly


class CategoryViewSet(SerializerMapMixin, viewsets.ModelViewSet, GenericAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        CommonOrderingFilter,
    ]

    search_fields = [
        "name",
        "extra_info",
    ]
    ordering = ["name"]
    ordering_fields = [
        "name",
    ]
