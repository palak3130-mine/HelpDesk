from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as django_filters
from django.db.models import Q

from tickets.models import Ticket, Client
from tickets.serializers import (
    TicketSerializer,
    TicketCreateSerializer,
    TicketStatusUpdateSerializer,
)


# ---------------------------------------------
# Custom Filter for Date Range
# ---------------------------------------------
class TicketFilter(django_filters.FilterSet):
    created_after = django_filters.DateFilter(
        field_name="created_at", lookup_expr="gte"
    )
    created_before = django_filters.DateFilter(
        field_name="created_at", lookup_expr="lte"
    )

    class Meta:
        model = Ticket
        fields = ["status", "issue", "assigned_to"]


# ---------------------------------------------
# Ticket List API
# ---------------------------------------------
class TicketListView(generics.ListAPIView):
    serializer_class = TicketSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = TicketFilter

    search_fields = [
        "description",
        "ticket_number",
    ]

    ordering_fields = ["created_at", "status"]
    ordering = ["-created_at"]

    def get_queryset(self):
        user = self.request.user

        if user.role == "ADMIN":
            return Ticket.objects.all()

        if user.role == "STAFF":
            return Ticket.objects.filter(assigned_to__user=user)

        if user.role == "CLIENT":
            return Ticket.objects.filter(client__user=user)

        return Ticket.objects.none()


# ---------------------------------------------
# Ticket Create API
# ---------------------------------------------
class TicketCreateView(generics.CreateAPIView):
    serializer_class = TicketCreateSerializer

    def perform_create(self, serializer):
        user = self.request.user

        if user.role != "CLIENT":
            raise permissions.PermissionDenied("Only clients can create tickets.")

        client = Client.objects.get(user=user)
        serializer.save(client=client)


# ---------------------------------------------
# Ticket Status Update API
# ---------------------------------------------
class TicketStatusUpdateView(generics.UpdateAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketStatusUpdateSerializer