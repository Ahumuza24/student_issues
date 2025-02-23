from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IssueViewSet, NotificationViewSet, AuditLogViewSet, StudentRegistrationView

router = DefaultRouter()
router.register(r'issues', IssueViewSet, basename='issue')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'audit-logs', AuditLogViewSet, basename='auditlog')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', StudentRegistrationView.as_view(), name='student-register'),
]
