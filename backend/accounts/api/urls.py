from django.urls import path

from accounts.api.views import UserMeView

urlpatterns = [path("me/", UserMeView.as_view(), name="user-me")]
