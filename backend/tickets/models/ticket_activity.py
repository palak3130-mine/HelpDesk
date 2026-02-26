from django.db import models
from django.conf import settings
from core.models.base import TimeStampedModel


class TicketActivity(TimeStampedModel):

    ticket = models.ForeignKey(
        'tickets.Ticket',
        on_delete=models.CASCADE,
        related_name='activities'
    )

    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    old_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.ticket.ticket_number} - {self.old_status} → {self.new_status}"