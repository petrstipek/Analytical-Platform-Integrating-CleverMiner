from django.urls import path

from cleverminer_tasks.api.procedures.views import (
    ProcedureSchemaView,
    ProcedureExampleView,
    ProcedureListView,
)

urlpatterns = [
    path("procedures/", ProcedureListView.as_view(), name="procedure-list"),
    path(
        "procedures/<str:procedure>/schema/",
        ProcedureSchemaView.as_view(),
        name="procedure-schema",
    ),
    path(
        "procedures/<str:procedure>/example/",
        ProcedureExampleView.as_view(),
        name="procedure-example",
    ),
]
