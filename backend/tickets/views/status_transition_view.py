from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from tickets.models import Ticket


class TicketAllowedTransitionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, ticket_id):
        ticket = Ticket.objects.get(id=ticket_id)

        # This method must already exist in your Ticket model
        allowed = ticket.get_allowed_transitions(request.user)

        return Response({
            "current_status": ticket.status,
            "allowed_statuses": allowed
        })