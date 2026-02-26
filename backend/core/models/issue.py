from django.db import models
from .base import TimeStampedModel


class Issue(TimeStampedModel):
    name = models.CharField(max_length=150, unique=True)

    def __str__(self):
        return self.name