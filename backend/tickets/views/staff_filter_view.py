from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, NotFound

from tickets.models import Ticket
from tickets.models.staff import Staff  # adjust if needed


class FilterStaffByIssueView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, ticket_id):
        user = request.user

        # 🔒 Clients cannot see eligible staff
        if user.role == user.Role.CLIENT:
            raise PermissionDenied("Clients cannot view eligible staff.")

        # 🔐 Secure ticket lookup
        ticket = (
            Ticket.objects
            .for_user(user)
            .filter(id=ticket_id)
            .first()
        )

        if not ticket:
            raise NotFound("Ticket not found.")

        # 👇 Fetch Staff model (not User)
        staff_queryset = Staff.objects.filter(
            specialty=ticket.issue
        ).select_related("user")

        data = [
            {
                "id": staff.user.id,
                "username": staff.user.username
            }
            for staff in staff_queryset
        ]

        return Response(data)