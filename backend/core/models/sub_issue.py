from django.db import models
from .base import TimeStampedModel
from .issue import Issue
from smart_selects.db_fields import ChainedForeignKey


class SubIssue(TimeStampedModel):

    issue = models.ForeignKey(
        Issue,
        on_delete=models.CASCADE
    )

    name = models.CharField(max_length=150)

    def __str__(self):
        return f"{self.issue.name} - {self.name}"