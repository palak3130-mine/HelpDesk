from django.urls import path
from tickets.views import (
    TicketListView,
    TicketCreateView,
    TicketStatusUpdateView,
    DashboardSummaryView,
    TicketActivityListView,
    TicketAllowedTransitionsView,
    FilterStaffByIssueView
)

urlpatterns = [
    path("tickets/", TicketListView.as_view()),
    path("tickets/create/", TicketCreateView.as_view()),
    path("tickets/<int:pk>/update/", TicketStatusUpdateView.as_view()),
    path("dashboard/", DashboardSummaryView.as_view()),
    path("tickets/<int:ticket_id>/activity/", TicketActivityListView.as_view()),
    path("tickets/<int:ticket_id>/allowed-transitions/", TicketAllowedTransitionsView.as_view()),
    path("tickets/<int:ticket_id>/eligible-staff/", FilterStaffByIssueView.as_view()),
]