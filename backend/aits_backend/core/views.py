from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Count, Avg, F
from datetime import timedelta
from django.utils import timezone
from .models import Issue, Notification, AuditLog, Course, User, College, Department
from .serializers import IssueSerializer, NotificationSerializer, AuditLogSerializer, CourseSerializer, UserSerializer, StudentRegistrationSerializer

class IssueViewSet(viewsets.ModelViewSet):
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'Student':
            return Issue.objects.filter(student=user)
        elif user.role in ['Lecturer', 'HeadOfDepartment', 'AcademicRegistrar']:
            return Issue.objects.filter(course__department__college=user.college)
        return Issue.objects.none()

    @action(detail=False, methods=['get'])
    def stats(self, request):
        user = request.user
        queryset = self.get_queryset()
        overdue_threshold = timezone.now() - timedelta(days=7)
        stats = {
            'total_issues': queryset.count(),
            'open_issues': queryset.filter(status='Open').count(),
            'overdue_issues': queryset.filter(status__in=['Open', 'Assigned'], updated_at__lt=overdue_threshold).count(),
            'resolved_issues': queryset.filter(status='Resolved').count(),
            'avg_resolution_time': queryset.filter(status='Resolved').aggregate(
                avg_time=Avg(F('updated_at') - F('created_at'))
            )['avg_time'].days if queryset.filter(status='Resolved').exists() else 0
        }
        return Response(stats)

    @action(detail=False, methods=['get'])
    def courses(self, request):
        user = request.user
        courses = Course.objects.filter(department__college=user.college)
        return Response(CourseSerializer(courses, many=True).data)

    @action(detail=False, methods=['get'])
    def staff(self, request):
        user = request.user
        staff = User.objects.filter(
            role__in=['Lecturer', 'HeadOfDepartment'],
            college=user.college
        )
        return Response(UserSerializer(staff, many=True).data)

    def perform_create(self, serializer):
        issue = serializer.save(student=self.request.user)
        AuditLog.objects.create(issue=issue, user=self.request.user, action='Issue Created')
        Notification.objects.create(
            user=issue.student, issue=issue, message=f'Your issue #{issue.issue_id} has been logged', method='InApp'
        )

    def perform_update(self, serializer):
        issue = serializer.save()
        action = 'Issue Updated'
        if 'assigned_to' in serializer.validated_data:
            action = f'Issue Assigned to {issue.assigned_to.email}'
        AuditLog.objects.create(issue=issue, user=self.request.user, action=action)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['HeadOfDepartment', 'AcademicRegistrar']:
            return AuditLog.objects.filter(issue__course__department__college=user.college)
        return AuditLog.objects.filter(user=user)

class StudentRegistrationView(generics.CreateAPIView):
    serializer_class = StudentRegistrationSerializer
    permission_classes = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            print("Validation Errors:", serializer.errors)  # Debugging
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role
            }
        }, status=status.HTTP_201_CREATED)