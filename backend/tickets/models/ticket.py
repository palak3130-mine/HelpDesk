import uuid
from django.db import models
from core.models import Issue, SubIssue
from .client import Client
from .staff import Staff
from core.models.base import TimeStampedModel
from smart_selects.db_fields import ChainedForeignKey
from accounts.models import User


class TicketQuerySet(models.QuerySet):
    """
    Role-based filtering at model layer.
    """

    def for_user(self, user):
        if user.role == User.Role.ADMIN:
            return self

        if user.role == User.Role.STAFF:
            return self.filter(assigned_to__user=user)

        if user.role == User.Role.CLIENT:
            return self.filter(client__user=user)

        return self.none()


class Ticket(TimeStampedModel):

    class Status(models.TextChoices):
        CREATED = 'CREATED', 'Created'
        ASSIGNED = 'ASSIGNED', 'Assigned'
        STARTED = 'STARTED', 'Started'
        RESOLVED = 'RESOLVED', 'Resolved'
        CLOSED = 'CLOSED', 'Closed'

    ticket_number = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True
    )

    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name='tickets'
    )

    issue = models.ForeignKey(
        Issue,
        on_delete=models.PROTECT
    )

    sub_issue = ChainedForeignKey(
        SubIssue,
        chained_field="issue",
        chained_model_field="issue",
        show_all=False,
        auto_choose=True,
        sort=True,
        on_delete=models.PROTECT
    )

    description = models.TextField()

    assigned_to = ChainedForeignKey(
        Staff,
        chained_field="issue",
        chained_model_field="specialty",
        show_all=False,
        auto_choose=False,
        sort=True,
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.CREATED
    )

    assigned_at = models.DateTimeField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)

    # 👇 Attach custom manager
    objects = TicketQuerySet.as_manager()

    def get_allowed_transitions(self, user):
        transitions = {
            "CREATED": ["ASSIGNED"],
            "ASSIGNED": ["STARTED"],
            "STARTED": ["RESOLVED"],
            "RESOLVED": ["CLOSED"],
            "CLOSED": [],
        }
        return transitions.get(self.status, [])

    def save(self, *args, **kwargs):
        is_new = self.pk is None

        if not is_new:
            old_status = Ticket.objects.get(pk=self.pk).status

            if old_status == self.Status.CLOSED:
                raise ValueError("Closed tickets cannot be modified.")

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.ticket_number} - {self.status}"