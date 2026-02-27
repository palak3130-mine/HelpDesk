from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as django_filters

from tickets.models import Ticket, Client
from tickets.serializers import (
    TicketSerializer,
    TicketCreateSerializer,
    TicketStatusUpdateSerializer,
)
from accounts.models import User
from rest_framework.exceptions import PermissionDenied
from rest_framework.exceptions import NotFound


class TicketDetailView(generics.RetrieveAPIView):
    serializer_class = TicketSerializer

    def get_queryset(self):
        return Ticket.objects.for_user(self.request.user)

    def get_object(self):
        queryset = self.get_queryset()
        ticket_id = self.kwargs["pk"]

        ticket = queryset.filter(id=ticket_id).first()

        if not ticket:
            raise NotFound("Ticket not found.")

        return ticket


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


class TicketListView(generics.ListAPIView):
    serializer_class = TicketSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = TicketFilter

    search_fields = ["description", "ticket_number"]
    ordering_fields = ["created_at", "status"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return Ticket.objects.for_user(self.request.user)


class TicketCreateView(generics.CreateAPIView):
    serializer_class = TicketCreateSerializer

    def perform_create(self, serializer):
        user = self.request.user

        if user.role != User.Role.CLIENT:
            raise permissions.PermissionDenied("Only clients can create tickets.")

        client = Client.objects.get(user=user)
        serializer.save(client=client)



class TicketStatusUpdateView(generics.UpdateAPIView):
    serializer_class = TicketStatusUpdateSerializer

    def get_queryset(self):
        return Ticket.objects.for_user(self.request.user)

    def perform_update(self, serializer):
        ticket = self.get_object()
        user = self.request.user

        # CLIENT cannot update
        if user.role == User.Role.CLIENT:
            raise PermissionDenied("Clients cannot update tickets.")

        # STAFF cannot close tickets
        if user.role == User.Role.STAFF and serializer.validated_data.get("status") == Ticket.Status.CLOSED:
            raise PermissionDenied("Staff cannot close tickets.")

        serializer.save()