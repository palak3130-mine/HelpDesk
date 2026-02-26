from rest_framework import serializers
from core.models import Issue, SubIssue


class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = ["id", "name"]


class SubIssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubIssue
        fields = ["id", "name", "issue"]