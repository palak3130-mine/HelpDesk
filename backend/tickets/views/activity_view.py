from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound

from tickets.models import TicketActivity, Ticket
from tickets.serializers import TicketActivitySerializer


class TicketActivityListView(generics.ListAPIView):
    serializer_class = TicketActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        ticket_id = self.kwargs["ticket_id"]

        # 🔐 Secure ticket lookup using role-based filtering
        ticket = Ticket.objects.for_user(user).filter(id=ticket_id).first()

        if not ticket:
            raise NotFound("Ticket not found.")

        # Return activities only for accessible ticket
        return (
            TicketActivity.objects
            .filter(ticket=ticket)
            .order_by("-created_at")
        )