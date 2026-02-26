from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count

from tickets.models import Ticket


class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role == "ADMIN":
            queryset = Ticket.objects.all()

        elif user.role == "STAFF":
            queryset = Ticket.objects.filter(assigned_to__user=user)

        elif user.role == "CLIENT":
            queryset = Ticket.objects.filter(client__user=user)

        else:
            queryset = Ticket.objects.none()

        summary = queryset.values("status").annotate(count=Count("status"))

        data = {
            "total_tickets": queryset.count(),
            "created": 0,
            "assigned": 0,
            "started": 0,
            "resolved": 0,
            "closed": 0,
        }

        for item in summary:
            status = item["status"].lower()
            data[status] = item["count"]

        return Response(data)