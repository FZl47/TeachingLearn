from django.shortcuts import render, get_object_or_404, Http404, redirect
from .models import Course, VisitCourse, Comment
from Student.models import Order, CoursePurchased
from Config.User import GetUser_ByMODEL
from django.core.exceptions import PermissionDenied
from Config.Tools import Set_Cookie_Functionality, ValidationText, SerializerTool
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from datetime import datetime


def CourseDetail(request, pk):
    Context = {}
    CourseGet = get_object_or_404(Course, pk=pk)
    VisitCourse.objects.create(Course_id=CourseGet.id)
    UserBoth = GetUser_ByMODEL(request, 'Student') or GetUser_ByMODEL(request, 'Teacher')
    Context['Course'] = CourseGet
    Context['User'] = GetUser_ByMODEL(request, 'Student')
    Context['UserBoth'] = UserBoth
    return render(request, 'CourseDetail.html', Context)

def AllCourse(request):
    Context = {}
    User = GetUser_ByMODEL(request,'Student') or GetUser_ByMODEL(request,'Teacher')
    Courses = Course.objects.all()[::-1]
    Context['Courses'] = Courses
    Context['User'] = User
    return render(request,'AllCourse.html',Context)


def AddCourseToOrder(request, pk):
    if request.method == 'POST' and request.is_ajax() == False:
        Student = GetUser_ByMODEL(request, 'Student')
        CourseGet = Course.objects.filter(id=pk).first()
        if Student != None:
            if CourseGet != None:
                OrderGet = Order.objects.filter(Student_id=Student.id, Course_id=CourseGet.id).first()
                CoursePurchasedGet = CoursePurchased.objects.filter(Student_id=Student.id,
                                                                    Course_id=CourseGet.id).first()
                if OrderGet == None and CoursePurchasedGet == None:
                    Order.objects.create(Student_id=Student.id, Course_id=CourseGet.id)
                    return Set_Cookie_Functionality('The course was successfully added to your cart', 'Success', 6000,
                                                    2, '/s/Panel')
                else:
                    return redirect('/s/Panel')
            else:
                raise Http404
        else:
            raise PermissionDenied
    else:
        raise PermissionDenied


@csrf_exempt
def DeleteCourseInOrder(request, pk):
    # Todo : pk is Primary Key Order
    Context = {}
    if request.method == 'POST' and request.is_ajax():
        Student = GetUser_ByMODEL(request, 'Student')
        if Student != None:
            OrderGet = Order.objects.filter(id=pk, Student_id=Student.id).first()
            if OrderGet != None:
                OrderGet.delete()
                Context['Status'] = '200'
            else:
                Context['Status'] = '404'
            return JsonResponse(Context)
        else:
            raise PermissionDenied
    else:
        raise PermissionDenied


def PaymentCourse(request, pk):
    if request.method == 'POST' and request.is_ajax() == False:
        Student = GetUser_ByMODEL(request, 'Student')
        if Student != None:
            OrderGet = Order.objects.filter(id=pk, Student_id=Student.id).first()
            if OrderGet != None:
                # Connect To Payment
                CourseOrder = OrderGet.Course
                CourseIsPayment = CoursePurchased.objects.filter(Student_id=Student.id,
                                                                 Course_id=CourseOrder.id).first()
                if CourseIsPayment == None:
                    HasDiscount = CourseOrder.HasDiscount()
                    if HasDiscount:
                        DiscountCourse = CourseOrder.GetDiscount()
                        TitleDiscount = DiscountCourse.Title
                        PercentDiscount = DiscountCourse.Percent
                        PriceWithDiscount = CourseOrder.GetPrice()
                        PriceWithOutDiscount = CourseOrder.GetPriceWithoutDiscount()
                        CoursePurchased.objects.create(Student_id=Student.id, Course_id=CourseOrder.id,
                                                       HasDiscount=True, TitleDiscount=TitleDiscount,
                                                       PercentDiscount=PercentDiscount,
                                                       PriceWithOutDiscount=PriceWithOutDiscount,
                                                       Price=PriceWithDiscount)
                    else:
                        PriceCourse = CourseOrder.GetPrice()
                        CoursePurchased.objects.create(Student_id=Student.id, Course_id=CourseOrder.id,
                                                       HasDiscount=False, Price=PriceCourse)
                    OrderGet.delete()
                    return Set_Cookie_Functionality('Payment Successfully', 'Success')
                else:
                    return Set_Cookie_Functionality('The course has already been Payed', 'Warning')
        else:
            raise PermissionDenied
    raise PermissionDenied


def SubmitComment(request, pk):
    if request.method == 'POST' and request.is_ajax() == False:
        Data = request.POST
        Text = Data.get('Text') or None
        Student = GetUser_ByMODEL(request, 'Student')
        CourseGet = get_object_or_404(Course, pk=pk)
        if Student != None:
            if ValidationText(Text, 3, 5000):
                Comment.objects.create(Course_id=CourseGet.id, Student_id=Student.id, Text=Text)
                return Set_Cookie_Functionality('Your comment was successfully submitted','Success','6000','2',CourseGet.UrlViewCourseStudents())
                # return redirect(CourseGet.UrlViewCourseStudents())
            else:
                return Set_Cookie_Functionality('Please fill in the fields correctly', 'Error', '6000', '2',
                                                CourseGet.UrlViewCourseStudents())

    raise PermissionDenied


@csrf_exempt
def DeleteComment(request, pk_Course, pk_Comment):
    Context = {}
    Teacher = GetUser_ByMODEL(request, 'Teacher')
    if request.method == 'POST' and request.is_ajax() and Teacher != None:
        CourseGet = Course.objects.filter(Teacher_id=Teacher.id, id=pk_Course).first()
        if CourseGet != None:
            CommentGet = Comment.objects.filter(Course_id=CourseGet.id, id=pk_Comment).first()
            if CommentGet != None:
                CommentGet.delete()
                Context['Status'] = '200'
            else:
                Context['Status'] = '404'
        else:
            Context['Status'] = '404'
        return JsonResponse(Context)
    raise PermissionDenied


@csrf_exempt
def SubmitCommentAnswer(request, pk_Course, pk_Comment):
    Context = {}
    Teacher = GetUser_ByMODEL(request, 'Teacher')
    if request.method == 'POST' and request.is_ajax() and Teacher != None:
        Data = json.loads(request.body)
        Text = Data.get('Text') or None
        CourseGet = Course.objects.filter(Teacher_id=Teacher.id, id=pk_Course).first()
        if CourseGet != None:
            CommentGet = Comment.objects.filter(id=pk_Comment, Course_id=CourseGet.id).first()
            if CommentGet != None:
                if ValidationText(Text, 1, 5000):
                    CommentGet.TextAnswer = Text
                    CommentGet.DateTimeSubmitAnswer = datetime.now()
                    CommentGet.save()
                    Context['Status'] = '200'
                    Context['Object'] = SerializerTool(Comment, [CommentGet], '__All__',
                                                       ['TimePastSubmit', 'TimePastSubmitAnswer'])[0]
                    Context['Object']['Student_GetNameAndFamily'] = CommentGet.Student.GetNameAndFamily()
                else:
                    Context['Status'] = '203'
            else:
                Context['Status'] = '404'
        else:
            Context['Status'] = '404'
        return JsonResponse(Context)
    raise PermissionDenied


@csrf_exempt
def DeleteAnswerComment(request, pk_Course, pk_Comment):
    Context = {}
    Teacher = GetUser_ByMODEL(request, 'Teacher')
    if request.method == 'POST' and request.is_ajax() and Teacher != None:
        CourseGet = Course.objects.filter(Teacher_id=Teacher.id, id=pk_Course).first()
        if CourseGet != None:
            CommentGet = Comment.objects.filter(Course_id=CourseGet.id, id=pk_Comment).first()
            if CommentGet != None:
                CommentGet.TextAnswer = ''
                CommentGet.DateTimeSubmitAnswer = None
                CommentGet.save()
                Context['Status'] = '200'
                Context['Object'] = SerializerTool(Comment, [CommentGet], '__All__',
                                                   ['TimePastSubmit'])[0]
                Context['Object']['Student_GetNameAndFamily'] = CommentGet.Student.GetNameAndFamily()
            else:
                Context['Status'] = '404'
        else:
            Context['Status'] = '404'

        return JsonResponse(Context)
    raise PermissionDenied
