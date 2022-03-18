from django.urls import path
from .views import *

app_name = 'Student'
urlpatterns = [

    path('Panel',Panel),
    path('Panel/InfoSubmit', InfoSubmit),

    path('LoginRegister',LoginRegister),
    path('LoginRegister/LoginCheck',LoginCheck),
    path('LoginRegister/RegisterCheck',RegisterCheck),

]