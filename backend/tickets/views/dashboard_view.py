from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from tickets.permissions import IsAdminUserRole, IsAdminOrStaff
from tickets.services.dashboard_service import (
    get_status_summary,
    get_monthly_summary,
    get_client_wise_summary,
    get_staff_wise_summary,
)


class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = get_status_summary(request.user)
        return Response(data)


class MonthlyAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = get_monthly_summary(request.user)
        return Response(data)


class ClientWiseAnalyticsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrStaff]

    def get(self, request):
        data = get_client_wise_summary(request.user)
        return Response(data)


class StaffWiseAnalyticsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request):
        data = get_staff_wise_summary(request.user)
        return Response(data)