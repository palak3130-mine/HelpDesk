from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from accounts.models import User
from tickets.models import Ticket


class FilterStaffByIssueView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, ticket_id):
        ticket = Ticket.objects.get(id=ticket_id)

        # assuming staff have field: specialty (ForeignKey to Issue)
        staff = User.objects.filter(
            role="STAFF",
            specialty=ticket.issue
        )

        data = [
            {
                "id": s.id,
                "username": s.username
            }
            for s in staff
        ]

        return Response(data)