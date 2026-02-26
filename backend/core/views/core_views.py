from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from core.models import Issue, SubIssue
from core.serializers import IssueSerializer, SubIssueSerializer


class IssueListView(generics.ListAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]


class SubIssueListView(generics.ListAPIView):
    queryset = SubIssue.objects.all()
    serializer_class = SubIssueSerializer
    permission_classes = [IsAuthenticated]