from typing import Dict, Any

from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from cleverminer_tasks.registry.procedureConfigsRegistry import PROCEDURE_CONFIG_REGISTRY


class ProcedureListView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    @extend_schema(
        responses={200: OpenApiTypes.OBJECT},
        description="List all available procedures",
    )
    def get(self, request):
        procedures = sorted(PROCEDURE_CONFIG_REGISTRY.keys())
        return Response([{'procedure': p} for p in procedures])

class ProcedureSchemaView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        responses={200: OpenApiTypes.OBJECT},
        description="Show schema for procedure",
    )

    def get(self, request, procedure: str):
        config_cls = PROCEDURE_CONFIG_REGISTRY.get(procedure)
        if not config_cls:
            return Response({'error': f'Procedure {procedure} not found'}, status=status.HTTP_404_NOT_FOUND)
        schema: Dict[str, Any] = config_cls.model_json_schema()
        return Response(schema)

class ProcedureExampleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        responses={200: OpenApiTypes.OBJECT},
        description="Show example for procedure",
    )

    def get(self, request, procedure: str):
        config_cls = PROCEDURE_CONFIG_REGISTRY.get(procedure)
        if not config_cls:
            return Response({'error': f'Procedure {procedure} not found'}, status=status.HTTP_404_NOT_FOUND)

        example = {
            'procedure': procedure,
            'params_schema_title': getattr(config_cls, '__name__', 'Config'),
        }

        return Response(example)