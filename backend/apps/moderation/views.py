from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Block, Report, Verification
from .serializers import BlockSerializer, ReportSerializer, VerificationSerializer


class BlockViewSet(viewsets.ModelViewSet):
    serializer_class = BlockSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Block.objects.filter(blocker=self.request.user).select_related("blocked")

    def perform_create(self, serializer):
        serializer.save(blocker=self.request.user)


class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Report.objects.filter(reporter=self.request.user)

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)


class VerificationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        verification = Verification.objects.filter(user=request.user).first()
        if not verification:
            return Response(
                {"status": "not_verified"},
                status=status.HTTP_200_OK,
            )
        return Response(VerificationSerializer(verification).data)

    def post(self, request):
        verification, created = Verification.objects.get_or_create(
            user=request.user,
            defaults={"status": Verification.Status.PENDING},
        )
        if not created and verification.status == Verification.Status.REJECTED:
            verification.status = Verification.Status.PENDING
            verification.save(update_fields=["status", "submitted_at"])

        return Response(
            VerificationSerializer(verification).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )
