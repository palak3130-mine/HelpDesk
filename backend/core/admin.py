from django.contrib import admin
from .models import CompanyType, Issue, SubIssue


admin.site.register(CompanyType)
admin.site.register(Issue)
admin.site.register(SubIssue)
