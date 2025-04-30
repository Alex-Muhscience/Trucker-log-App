from django.urls import path
from .views import PlanTripView, DownloadLogView

urlpatterns = [
    path('plan-trip/', PlanTripView.as_view(), name='plan-trip'),
    path('download-log/<int:log_id>/', DownloadLogView.as_view(), name='download-log'),
]