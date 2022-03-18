from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path , include
from .view import Home

urlpatterns = [
    path('',Home),
    path('t/',include('Teacher.urls')), # Teacher
    path('s/' , include('Student.urls')),# Student
    path('c/' , include('Course.urls')),# Course
    path('admin/', admin.site.urls),
]
if settings.DEBUG:
    urlpatterns = urlpatterns + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns = urlpatterns + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)