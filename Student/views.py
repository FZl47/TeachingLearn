from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import PermissionDenied
from .models import Student
from Config.User import GetUser_ByMODEL
from Config.Security import Decode, UnDecode
from Config.Tools import ValidationText, ValidationNumber
from Config.Tools import Set_Cookie_Functionality
from Teacher.models import Teacher
import json


def Panel(request):
    Context = {}
    Student = GetUser_ByMODEL(request, 'Student')
    if Student == None:
        return redirect('/s/LoginRegister')

    Context['Student'] = Student
    return render(request, 'Panel/Panel.html', Context)


def InfoSubmit(request):
    Context = {}
    if request.method == 'POST':
        Student = GetUser_ByMODEL(request,'Student')
        if Student != None:
            Data = request.POST
            FirstName = Data.get('FirstName') or None
            LastName = Data.get('LastName') or None
            PhoneNumber = Data.get('PhoneNumber') or None
            Email = Data.get('Email') or None
            City = Data.get('City') or None
            if ValidationText(FirstName, 1, 200) and ValidationText(LastName, 1, 200) and ValidationText(PhoneNumber, 4, 15) and ValidationText(
                Email, 1, 70) and ValidationText(City, 1, 30):
                Student.FirstName = FirstName
                Student.LastName = LastName
                Student.PhoneNumber = PhoneNumber
                Student.Email = Email
                Student.City = City
                Student.save()
                return Set_Cookie_Functionality('Information saved successfully','Success')
        else:
            raise PermissionDenied
    else:
        raise PermissionDenied


def LoginRegister(request):
    return render(request, 'LoginRegisterStudent.html')


@csrf_exempt
def LoginCheck(request):
    Context = {}
    Data = json.loads(request.body)
    UserName = Data.get('UserName') or None
    Password = Data.get('Password') or None
    if ValidationText(UserName, 4, 100, True) and ValidationText(Password, 7, 100, True):
        StudentExists = Student.objects.filter(UserName=UserName, Password=Password).first()
        if StudentExists != None:
            Context = StudentExists.DecodeUserNameAndPassword()
            Context['Status'] = '200'
        else:
            Context['Status'] = '404'
    else:
        Context['Status'] = '204'
    return JsonResponse(Context)


@csrf_exempt
def RegisterCheck(request):
    Context = {}
    Data = json.loads(request.body)
    UserName = Data.get('UserName') or None
    Password = Data.get('Password') or None
    Email = Data.get('Email') or None
    if ValidationText(UserName, 4, 100, True) and ValidationText(Password, 7, 100, True) and ValidationText(Email, 4,
                                                                                                            65):
        StudentExists = Student.objects.filter(UserName=UserName).first()
        TeacherExists = Teacher.objects.filter(UserName=UserName).first()
        if StudentExists == None and TeacherExists == None:
            StudentCreated = Student.objects.create(UserName=UserName, Password=Password, Email=Email)
            Context = StudentCreated.DecodeUserNameAndPassword()
            Context['Status'] = '200'
        else:
            Context['Status'] = '409'
    else:
        Context['Status'] = '204'
    return JsonResponse(Context)
