from django.urls import path
from .views import GenerateResponseAPIView

urlpatterns = [
    path('generate/', GenerateResponseAPIView.as_view(), name='generate-response'),
]
