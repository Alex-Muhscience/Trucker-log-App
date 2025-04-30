from django.contrib import admin
from django.urls import path, include
from logs.views import PlanTripView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('logs.urls')),
]