from django.contrib import admin
from .models import User, College, Department, Course, Issue, Notification, AuditLog

class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'role', 'college', 'department')
    list_filter = ('role', 'college')
    search_fields = ('email', 'first_name', 'last_name')

admin.site.register(User, UserAdmin)
admin.site.register(College)
admin.site.register(Department)
admin.site.register(Course)
admin.site.register(Issue)
admin.site.register(Notification)
admin.site.register(AuditLog)