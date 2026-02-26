from django.db import models
from .base import TimeStampedModel


class CompanyType(TimeStampedModel):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name