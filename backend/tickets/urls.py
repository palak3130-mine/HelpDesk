from django.urls import path
from tickets.views import (
    TicketListView,
    TicketCreateView,
    TicketStatusUpdateView,
    DashboardSummaryView,
    TicketActivityListView,
    TicketAllowedTransitionsView,
    FilterStaffByIssueView,
    LogoutView,
)
from .views.dashboard_view import (
    DashboardSummaryView,
    MonthlyAnalyticsView,
    ClientWiseAnalyticsView,
    StaffWiseAnalyticsView,
)
from .views.ticket_views import TicketDetailView

urlpatterns = [
    path("tickets/", TicketListView.as_view()),
    path("tickets/create/", TicketCreateView.as_view()),
    path("tickets/<int:pk>/update/", TicketStatusUpdateView.as_view()),
    path("dashboard/", DashboardSummaryView.as_view()),
    path("tickets/<int:ticket_id>/activity/", TicketActivityListView.as_view()),
    path("tickets/<int:ticket_id>/allowed-transitions/", TicketAllowedTransitionsView.as_view()),
    path("tickets/<int:ticket_id>/eligible-staff/", FilterStaffByIssueView.as_view()),
    path("dashboard/summary/", DashboardSummaryView.as_view()),
    path("dashboard/monthly/", MonthlyAnalyticsView.as_view()),
    path("dashboard/client-wise/", ClientWiseAnalyticsView.as_view()),
    path("dashboard/staff-wise/", StaffWiseAnalyticsView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("tickets/<int:pk>/", TicketDetailView.as_view()),
]