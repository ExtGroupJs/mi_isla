from rest_framework import filters, viewsets
from rest_framework.generics import GenericAPIView

from apps.business_app.models.sub_category_model import SubCategory
from django_filters.rest_framework import DjangoFilterBackend

from apps.business_app.serializers.sub_category_serializer import SubCategorySerializer
from apps.common.common_ordering_filter import CommonOrderingFilter
from apps.common.mixins.serializer_map import SerializerMapMixin

from rest_framework.permissions import IsAuthenticatedOrReadOnly


class SubCategoryViewSet(SerializerMapMixin, viewsets.ModelViewSet, GenericAPIView):
    queryset = SubCategory.objects.all().select_related("super_category")
    serializer_class = SubCategorySerializer
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
    ordering = ["name", "super_category__name"]
    ordering_fields = [
        "name",
    ]
    filterset_fields = [
        "super_category",
    ]
