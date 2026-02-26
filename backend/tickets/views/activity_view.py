from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from tickets.models import TicketActivity
from tickets.serializers import TicketActivitySerializer


class TicketActivityListView(generics.ListAPIView):
    serializer_class = TicketActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        ticket_id = self.kwargs["ticket_id"]
        return TicketActivity.objects.filter(ticket_id=ticket_id).order_by("-created_at")