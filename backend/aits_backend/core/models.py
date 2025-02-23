# core/models.py
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils import timezone
from django.core.mail import send_mail

# Custom User Manager to handle email-based superuser creation
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class College(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Department(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    college = models.ForeignKey(College, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class User(AbstractUser):
    ROLES = (
        ('Student', 'Student'),
        ('Lecturer', 'Lecturer'),
        ('HeadOfDepartment', 'Head of Department'),
        ('AcademicRegistrar', 'Academic Registrar'),
    )
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLES)
    college = models.ForeignKey(College, on_delete=models.SET_NULL, null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    username = None  # Disable username field

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = CustomUserManager()  # Assign custom manager

    def __str__(self):
        return self.email

class Course(models.Model):
    course_id = models.AutoField(primary_key=True)
    course_code = models.CharField(max_length=10)
    course_name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('course_code', 'department')

    def __str__(self):
        return f"{self.course_code} - {self.course_name}"

class Issue(models.Model):
    ISSUE_TYPES = (('MissingMarks', 'Missing Marks'), ('Appeals', 'Appeals'), ('Corrections', 'Corrections'))
    STATUSES = (('Open', 'Open'), ('Assigned', 'Assigned'), ('Resolved', 'Resolved'), ('Closed', 'Closed'))
    issue_id = models.AutoField(primary_key=True)
    student = models.ForeignKey(User, related_name='issues_logged', on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    issue_type = models.CharField(max_length=20, choices=ISSUE_TYPES)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUSES, default='Open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    assigned_to = models.ForeignKey(User, related_name='issues_assigned', on_delete=models.SET_NULL, null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.pk:
            old_issue = Issue.objects.get(pk=self.pk)
            old_status = old_issue.status
        else:
            old_status = None

        super().save(*args, **kwargs)

        if old_status != self.status:
            if self.assigned_to:
                Notification.objects.create(
                    user=self.assigned_to,
                    issue=self,
                    message=f"Issue #{self.issue_id} assigned to you: {self.status}",
                    method='Email'
                )
                send_mail(
                    subject=f"AITS: Issue #{self.issue_id} Status Update",
                    message=f"Issue #{self.issue_id} is now {self.status}. Description: {self.description}",
                    from_email=None,
                    recipient_list=[self.assigned_to.email],
                    fail_silently=True,
                )
            Notification.objects.create(
                user=self.student,
                issue=self,
                message=f"Your issue #{self.issue_id} is now {self.status}",
                method='InApp'
            )

        if self.status in ['Open', 'Assigned'] and (timezone.now() - self.updated_at).days > 7:
            registrar = User.objects.filter(role='AcademicRegistrar', college=self.student.college).first()
            if registrar:
                Notification.objects.create(
                    user=registrar,
                    issue=self,
                    message=f"Issue #{self.issue_id} overdue for 7+ days",
                    method='Email'
                )

    def __str__(self):
        return f"Issue #{self.issue_id} - {self.issue_type}"

class Notification(models.Model):
    METHODS = (('Email', 'Email'), ('InApp', 'InApp'))
    notification_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE)
    message = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    method = models.CharField(max_length=20, choices=METHODS)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification for {self.user.email}"

class AuditLog(models.Model):
    log_id = models.AutoField(primary_key=True)
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=100)
    action_timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Log #{self.log_id} - {self.action}"