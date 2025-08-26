from django.urls import path
from .views import TeamRegistrationView

urlpatterns = [
    path('register/', TeamRegistrationView.as_view(), name='team-registration'),
]