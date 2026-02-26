from django.urls import path
from core.views import IssueListView, SubIssueListView

urlpatterns = [
    path("issues/", IssueListView.as_view()),
    path("subissues/", SubIssueListView.as_view()),
]