from django.urls import path, include

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("api/", include("cleverminer_tasks.api.urls")),
]
