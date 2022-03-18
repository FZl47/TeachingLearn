from django.urls import path
from .views import  *

urlpatterns = [
    path('<int:pk>',CourseDetail , name='CourseDetail'),
    path('all',AllCourse , name='AllCourse'),

    path('<int:pk>/AddOrderStudent',AddCourseToOrder , name='AddCourseToOrder'),
    path('<int:pk>/DeleteCourseInOrder',DeleteCourseInOrder , name='DeleteCourseInOrder'),

    path('<int:pk>/SubmitComment',SubmitComment,name='SubmitComment'),
    path('<int:pk_Course>/<int:pk_Comment>/DeleteComment',DeleteComment,name='DeleteComment'),
    path('<int:pk_Course>/<int:pk_Comment>/SubmitCommentAnswer',SubmitCommentAnswer,name='SubmitCommentAnswer'),
    path('<int:pk_Course>/<int:pk_Comment>/DeleteAnswerComment',DeleteAnswerComment,name='DeleteAnswerComment'),

    path('<int:pk>/PaymentCourse',PaymentCourse , name='PaymentCourse'),
]