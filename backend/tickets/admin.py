from django.contrib import admin
from django import forms
from django.core.exceptions import ValidationError

from .models import Client, Staff, Ticket, TicketActivity
from core.models import SubIssue


# ---------------------------------------------------
# Custom Admin Form (for dynamic filtering)
# ---------------------------------------------------
class TicketAdminForm(forms.ModelForm):
    class Meta:
        model = Ticket
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Dynamic filtering for Add & Change view
        if 'issue' in self.data:
            try:
                issue_id = int(self.data.get('issue'))
                self.fields['sub_issue'].queryset = SubIssue.objects.filter(issue_id=issue_id)
                self.fields['assigned_to'].queryset = Staff.objects.filter(
                    specialty_id=issue_id,
                    is_active=True
                )
            except (ValueError, TypeError):
                pass

        elif self.instance.pk:
            self.fields['sub_issue'].queryset = SubIssue.objects.filter(
                issue=self.instance.issue
            )
            self.fields['assigned_to'].queryset = Staff.objects.filter(
                specialty=self.instance.issue,
                is_active=True
            )
        else:
            self.fields['sub_issue'].queryset = SubIssue.objects.none()
            self.fields['assigned_to'].queryset = Staff.objects.none()


# ---------------------------------------------------
# Ticket Admin
# ---------------------------------------------------
@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    form = TicketAdminForm

    # ------------------------------
    # Status Transition Rules
    # ------------------------------
    def get_allowed_transitions(self, current_status, user):

        transitions = {
            Ticket.Status.CREATED: [Ticket.Status.ASSIGNED],
            Ticket.Status.ASSIGNED: [Ticket.Status.STARTED],
            Ticket.Status.STARTED: [Ticket.Status.RESOLVED],
            Ticket.Status.RESOLVED: [Ticket.Status.CLOSED],
            Ticket.Status.CLOSED: [],
        }

        allowed = transitions.get(current_status, [])

        # Staff cannot close
        if user.role == "STAFF":
            allowed = [s for s in allowed if s != Ticket.Status.CLOSED]

        # Client cannot change status
        if user.role == "CLIENT":
            allowed = []

        return allowed

    # ------------------------------
    # Save Model Override
    # ------------------------------
    def save_model(self, request, obj, form, change):

        old_status = None

        if change:
            old_status = Ticket.objects.get(pk=obj.pk).status

            if old_status != obj.status:
                allowed = self.get_allowed_transitions(old_status, request.user)

                if obj.status not in allowed:
                    raise ValidationError(
                        f"Transition from {old_status} to {obj.status} is not allowed for your role."
                    )

        super().save_model(request, obj, form, change)

        # Log activity
        if change and old_status != obj.status:
            TicketActivity.objects.create(
                ticket=obj,
                changed_by=request.user,
                old_status=old_status,
                new_status=obj.status
            )


# ---------------------------------------------------
# Other Registrations
# ---------------------------------------------------
admin.site.register(Client)
admin.site.register(Staff)
admin.site.register(TicketActivity)