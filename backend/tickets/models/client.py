from django.db import models
from django.conf import settings
from core.models import CompanyType
from core.models.base import TimeStampedModel


class Client(TimeStampedModel):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'CLIENT'}
    )

    company_name = models.CharField(max_length=255)

    company_type = models.ForeignKey(
        CompanyType,
        on_delete=models.PROTECT
    )

    contract_duration = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    email = models.EmailField()

    whatsapp_number = models.CharField(max_length=20)

    def __str__(self):
        return self.company_name