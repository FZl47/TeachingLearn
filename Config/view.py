from django.shortcuts import redirect , render
from Course.models import Course , VisitCourse
from Config.User import GetUser_ByMODEL

def Home(request):
    Context = {}
    User =  GetUser_ByMODEL(request,'Student') or GetUser_ByMODEL(request,'Teacher')
    Courses = Course.objects.all()
    Context['CoursesFree'] = [ Course for Course in Courses if Course.CourseIsFree() ==  True ][:4]
    Context['CoursesPopularity'] = sorted(Courses,key=lambda Course : Course.GetLenVisits())[:4][::-1]
    Context['User'] = User
    return render(request,'Home/Index.html',Context)