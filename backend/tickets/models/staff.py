from django.db import models
from django.conf import settings
from core.models import Issue
from core.models.base import TimeStampedModel


class Staff(TimeStampedModel):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'STAFF'}
    )

    specialty = models.ForeignKey(
        Issue,
        on_delete=models.PROTECT
    )

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.user.username