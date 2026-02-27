from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound

from tickets.models import Ticket


class TicketAllowedTransitionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, ticket_id):
        user = request.user

        # 🔐 Secure ticket lookup using role-based filtering
        ticket = (
            Ticket.objects
            .for_user(user)
            .filter(id=ticket_id)
            .first()
        )

        if not ticket:
            raise NotFound("Ticket not found.")

        allowed = ticket.get_allowed_transitions(user)

        return Response({
            "current_status": ticket.status,
            "allowed_statuses": allowed
        })