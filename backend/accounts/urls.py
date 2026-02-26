from django.urls import path
from accounts.views import ProfileView

urlpatterns = [
    path("me/", ProfileView.as_view()),
]