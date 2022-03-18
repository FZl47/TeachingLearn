from django.urls import path , include
from .views import *

app_name = 'Teacher'
urlpatterns = [
    path('Panel', Panel),
    path('Panel/SubmitInformation',SubmitInformation),
    path('Panel/CreateCourse',CreateCourse),
    path('Panel/<int:ID>/EditCourse',EditCourse),
    path('Panel/<int:ID>/DeleteCourse',DeleteCourse),

    path('Panel/<int:ID>/AddDiscount',AddDiscount),
    path('Panel/<int:ID>/DeleteDiscount',DeleteDiscount),

    path('Panel/Course/<int:ID>',ViewCourse),
    path('Panel/Course/<int:ID>/CreateSectionCourse',CreateSectionCourse),
    path('Panel/Course/<int:ID>/<int:SectionID>/ChangeSection',ChangeSection),
    path('Panel/Course/<int:ID>/<int:SectionID>/DeleteSection',DeleteSection),

    path('Panel/Course/<int:ID>/<int:SectionID>/AddVideo',AddVideo),
    path('Panel/Course/<int:ID>/<int:SectionID>/<int:VideoID>/ChangeVideo',ChangeVideo),
    path('Panel/Course/<int:ID>/<int:SectionID>/<int:VideoID>/DeleteVideo',DeleteVideo),

    path('Login-Register',LoginRegister),
    path('Login-Register/RegisterCheck',RegisterCheck),
    path('Login-Register/LoginCheck',LoginCheck)

]