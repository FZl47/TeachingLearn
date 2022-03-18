from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from Config.Tools import ValidationText, Set_Cookie_Functionality, ValidationNumber
from django.core.exceptions import PermissionDenied
from Config.User import GetUser_ByMODEL
from .models import Teacher
from Student.models import Student
from Course.models import *
from django.shortcuts import get_object_or_404, Http404
from django.utils import timezone
import json
import time


def Panel(request):
    Context = {}
    StateTeacher = GetUser_ByMODEL(request, 'Teacher')
    if StateTeacher == None:
        return redirect('/t/Login-Register')
    Context['Teacher'] = StateTeacher
    return render(request, 'Panel.html', Context)


def SubmitInformation(request):
    Context = {}
    Status = 0
    Data = request.POST
    Teacher = GetUser_ByMODEL(request, 'Teacher')
    NameAndFamily = Data.get('NameAndFamily') or None
    Email = Data.get('Email') or None
    PhoneNumber = Data.get('PhoneNumber') or None
    AboutMe = Data.get('AboutMe') or None
    Image = request.FILES.get('Image') or None
    StateImage = Data.get('StateImage') or None

    if Teacher is not None:
        if ValidationText(NameAndFamily, 3, 200) and ValidationText(Email, 3, 65) and ValidationText(PhoneNumber, 3,
                                                                                                     20) and ValidationText(
            AboutMe, 2, 5000):
            Teacher.NameAndFamily = NameAndFamily
            Teacher.PhoneNumber = PhoneNumber
            Teacher.Email = Email
            Teacher.AboutMe = AboutMe
            Context['Status'] = '200'
            Status = 200
            if StateImage == 'MostGet' and Image == None:
                Status = 203
            elif StateImage == 'MostGet' and Image != None:
                Teacher.Image = Image

            Teacher.save()
        else:
            Context['Status'] = '204'
            Status = 204
    else:
        # Context['Status'] = '404'
        # Status = 404
        return redirect('/t/Login-Register')

    if Status == 200:
        return Set_Cookie_Functionality('Your information has been saved successfully', 'Success', 5000, '2',
                                        '/t/Panel?ActiveCourse')
    if Status == 203:
        return Set_Cookie_Functionality('Photo not entered correctly. Please try again in a few minutes', 'Error', 6000,
                                        '2',
                                        '/t/Panel?Information')
    elif Status == 204:
        return Set_Cookie_Functionality('Please fill in the fields correctly', 'Error', 6000, '2',
                                        '/t/Panel?Information')
    return HttpResponse('')  # Useless


def CreateCourse(request):
    if request.POST:
        Status = 0
        Data = request.POST
        StateTeacher = GetUser_ByMODEL(request, 'Teacher')
        if StateTeacher is not None:
            Title = Data.get('TitleCourse') or None
            PreRequisites = Data.get('PreRequisites') or None
            References = Data.get('References') or None
            Image = request.FILES.get('Image') or None
            StateImage = Data.get('StateImage') or None
            Price = Data.get('Price') or None
            Description = Data.get('Description') or None
            if ValidationText(Title, 3, 200) and ValidationText(PreRequisites, 0, 200) and ValidationText(References, 0,
                                                                                                          1000) and ValidationNumber(
                Price, 0, 15) and ValidationText(Description, 3, 5000) and Image is not None:
                Course.objects.create(Teacher_id=StateTeacher.id, Title=Title, StateCourse='Active',
                                      PreRequisites=PreRequisites, References=References, Image=Image, Price=Price,
                                      Description=Description)
                Status = 200
            else:
                Status = 204
        else:
            return redirect('/t/Login-Register')
    else:
        return redirect('/')

    if Status == 200:
        return Set_Cookie_Functionality('Your course was successfully created', 'Success')
    elif Status == 204:
        return Set_Cookie_Functionality('Please enter the fields correctly', 'Error')

    return HttpResponse('')  # Useless


def LoginRegister(request):
    return render(request, 'LoginRegister.html')


@csrf_exempt
def LoginCheck(request):
    if request.is_ajax():
        Context = {}
        Data = json.loads(request.body)
        UserName = Data.get('UserName') or None
        Password = Data.get('Password') or None
        if ValidationText(UserName, 4, 100, True,True) and ValidationText(Password, 7, 100, True,True):
            StateTeacher = Teacher.objects.filter(UserName=UserName, Password=Password).first()
            if StateTeacher != None:
                Context = StateTeacher.DecodeUserNameAndPassword()
                Context['Status'] = '200'
            else:
                Context['Status'] = '404'
        else:
            Context['Status'] = '204'
        return JsonResponse(Context)
    raise PermissionDenied


@csrf_exempt
def RegisterCheck(request):
    Context = {}
    if request.is_ajax():
        Data = json.loads(request.body)
        UserName = Data.get('UserName') or None
        Email = Data.get('Email') or None
        Password = Data.get('Password') or None
        if ValidationText(UserName, 4, 100, True,True) and ValidationText(Email, 4, 65,True) and ValidationText(Password, 7, 100,
                                                                                                      True,True):
            TeacherExists = Teacher.objects.filter(UserName=UserName).first()
            StudentExists = Student.objects.filter(UserName=UserName).first()
            if TeacherExists == None and StudentExists == None:
                StateTeacher = Teacher.objects.create(UserName=UserName, Email=Email, Password=Password)
                Context = StateTeacher.DecodeUserNameAndPassword()
                Context['Status'] = '200'
            else:
                Context['Status'] = '409'  # Teacher is Exists
        else:
            Context['Status'] = '204'  # No Content or Content Is Wrong

        return JsonResponse(Context)
    raise PermissionDenied


def ViewCourse(request, ID):
    Context = {}
    StateTeacher = GetUser_ByMODEL(request, 'Teacher')
    StateCourse = get_object_or_404(Course, id=ID)
    if StateTeacher is not None and StateCourse is not None:
        if StateCourse.Teacher_id == StateTeacher.id:
            Context['Teacher'] = StateTeacher
            Context['Course'] = StateCourse
            return render(request, 'ViewCourse.html', Context)
    raise Http404


@csrf_exempt
def CreateSectionCourse(request, ID):
    if request.method == 'POST':
        Data = request.POST
        Title = Data.get('Title') or None
        StateTeacher = GetUser_ByMODEL(request, 'Teacher')
        if StateTeacher != None:
            StateCourse = get_object_or_404(Course, id=ID, Teacher_id=StateTeacher.id)
            if StateCourse != None:
                if ValidationText(Title, 0, 150):
                    SectionCreated = SectionCourse.objects.create(Title=Title, Course_id=StateCourse.id)
                    StateCourse.UpdateTimeCourse()
                    return Set_Cookie_Functionality('Section was Created Successfully', 'Success')
            else:
                return Set_Cookie_Functionality('Course Not Found', 'Error')
        else:
            return redirect('/t/Login-Register')

    return HttpResponse('')  # Useless


def EditCourse(request, ID):
    # Todo : ID is ID Course
    if request.method == 'POST':
        Data = request.POST
        StateTeacher = GetUser_ByMODEL(request, 'Teacher')
        if StateTeacher != None:
            StateCourse = get_object_or_404(Course, id=ID, Teacher_id=StateTeacher.id)
            if StateCourse != None:
                Title = Data.get('TitleCourse') or None
                PreRequisites = Data.get('PreRequisites') or None
                References = Data.get('References') or None
                Image = request.FILES.get('Image') or None
                StateImage = Data.get('StateImage') or None
                Price = Data.get('Price') or None
                Description = Data.get('Description') or None
                StatusCourse = Data.get('StateCourse') or None
                if ValidationText(Title, 3, 200) and ValidationText(PreRequisites, 0, 200) and ValidationText(
                        References, 0, 1000) and ValidationText(Price, 0, 15) and ValidationText(Description, 3,
                                                                                                 5000) and ValidationText(
                        StateCourse):
                    StateCourse.Title = Title
                    StateCourse.PreRequisites = PreRequisites
                    StateCourse.References = References
                    StateCourse.Price = Price
                    StateCourse.Description = Description
                    StateCourse.StateCourse = StatusCourse
                    StateCourse.UpdateTimeCourse()
                    # StateCourse.save()  Save with Method UpdateTimeCourse

                    if StateImage == 'MostGet':
                        if Image != None:
                            StateCourse.Image = Image
                            StateCourse.save()
                        else:
                            return Set_Cookie_Functionality('Can not Upload Image Please Try Again in a few Minute',
                                                            'Error')
                    return Set_Cookie_Functionality('Course was Successfully Updated', 'Success')



        else:
            return redirect('/t/Login-Register')
    return redirect('/')


@csrf_exempt
def DeleteCourse(request, ID):
    # Todo : ID is ID Course
    if request.method == 'POST' and request.is_ajax():
        Context = {}
        StateTeacher = GetUser_ByMODEL(request, 'Teacher')
        if StateTeacher != None:
            StateCourse = Course.objects.filter(id=ID, Teacher_id=StateTeacher.id).first()
            if StateCourse != None:
                StateCourse.delete()
                Context['Status'] = '200'
            else:
                Context['Status'] = '404'
        else:
            Context['__Redirect__'] = 'true'
            Context['__RedirectURL__'] = '/t/Login-Register'
        return JsonResponse(Context)
    else:
        raise PermissionDenied



@csrf_exempt
def ChangeSection(request, ID, SectionID):
    # Todo : ID is ID Course
    if request.method == 'POST':
        StateTeacher = GetUser_ByMODEL(request, 'Teacher')
        if StateTeacher != None:
            StateCourse = Course.objects.filter(id=ID, Teacher_id=StateTeacher.id).first()
            if StateCourse != None:
                StateSection = SectionCourse.objects.filter(id=SectionID, Course_id=StateCourse.id).first()
                if StateSection != None:
                    Data = request.POST
                    NewTitle = Data.get('Title') or None
                    if NewTitle != None:
                        StateSection.Title = NewTitle
                        StateSection.save()
                        StateCourse.UpdateTimeCourse()
                        return Set_Cookie_Functionality('Title Section Updated Successfully', 'Success')
    return redirect('/')


@csrf_exempt
def DeleteSection(request, ID, SectionID):
    # Todo : ID is ID Course
    Context = {}
    if request.method == 'POST' and request.is_ajax():
        StateTeacher = GetUser_ByMODEL(request, 'Teacher')
        if StateTeacher != None:
            StateCourse = Course.objects.filter(id=ID, Teacher_id=StateTeacher.id).first()
            if StateCourse != None:
                StateSection = SectionCourse.objects.filter(id=SectionID, Course_id=StateCourse.id).first()
                StateSection.delete()
                Context['Status'] = '200'
            else:
                Context['Status'] = '404'
        else:
            Context['Status'] = '404'
        return JsonResponse(Context)
    raise PermissionDenied


@csrf_exempt
def AddVideo(request, ID, SectionID):
    # Todo : ID is ID Course
    if request.method == 'POST' and request.is_ajax():
        Context = {}
        Data = request.POST
        Video = request.FILES.get('Video') or None
        DurationVideo = Data.get('Duration') or 0
        StateTeacher = GetUser_ByMODEL(request, 'Teacher')
        StateCourse = Course.objects.filter(id=ID, Teacher_id=StateTeacher.id).first()
        if StateCourse != None and Video != None and StateTeacher != None:
            StateSection = SectionCourse.objects.filter(id=SectionID, Course_id=StateCourse.id).first()
            if StateSection != None:
                VideoCreated = VideoCourse.objects.create(Section_id=StateSection.id)
                VideoCreated.StateVideo = '400'
                VideoCreated.Video = Video
                VideoCreated.StateVideo = '200'
                # VideoCreated.save()
                # UrlVideo = f'{request.scheme}://{request.META["HTTP_HOST"]}{VideoCreated.Video.url}'
                # VideoCapture = cv2.VideoCapture(UrlVideo)
                # Fps = VideoCapture.get(cv2.CAP_PROP_FPS)
                # TotalFrames = VideoCapture.get(cv2.CAP_PROP_FRAME_COUNT)
                # if TotalFrames != 0 and Fps != 0:
                #     Duration = TotalFrames / Fps
                # else:
                #     Duration = 0
                VideoCreated.DurationVideo = DurationVideo
                VideoCreated.save()
                StateCourse.UpdateTimeCourse()
                Context['Status'] = '200'
                return JsonResponse(Context)

        return redirect('/')
    raise PermissionDenied


@csrf_exempt
def ChangeVideo(request, ID, SectionID, VideoID):
    # Todo : ID is ID Course
    Context = {}
    if request.method == 'POST' and request.is_ajax():
        Data = request.POST
        Video = request.FILES.get('Video') or None
        DurationVideo = Data.get('Duration') or 0
        StateTeacher = GetUser_ByMODEL(request, 'Teacher')
        if Video != None and StateTeacher != None:
            StateCourse = Course.objects.filter(id=ID, Teacher_id=StateTeacher.id).first()
            if StateCourse != None:
                StateSection = SectionCourse.objects.filter(id=SectionID, Course_id=StateCourse.id).first()
                if StateSection != None:
                    StateVideo = VideoCourse.objects.filter(id=VideoID, Section_id=StateSection.id).first()
                    if StateVideo != None:
                        StateVideo.StateVideo = '400'
                        StateVideo.Video = Video
                        StateVideo.StateVideo = '200'
                        StateVideo.DateTimeSubmit = timezone.now()
                        # StateVideo.save()
                        # UrlVideo = f'{request.scheme}://{request.META["HTTP_HOST"]}{StateVideo.Video.url}'
                        # VideoCapture = cv2.VideoCapture(UrlVideo)
                        # Fps = VideoCapture.get(cv2.CAP_PROP_FPS)
                        # TotalFrames = VideoCapture.get(cv2.CAP_PROP_FRAME_COUNT)
                        # if TotalFrames != 0 and Fps != 0:
                        #     Duration = TotalFrames / Fps
                        # else:
                        #     Duration = 0
                        StateVideo.DurationVideo = DurationVideo
                        StateVideo.save()
                        StateCourse.UpdateTimeCourse()
                        Context['Status'] = '200'
                    else:
                        Context['Status'] = '203'
                else:
                    Context['Status'] = '203'
            else:
                Context['Status'] = '203'
        else:
            Context['Status'] = '203'
        return JsonResponse(Context)
    raise PermissionDenied


@csrf_exempt
def DeleteVideo(request, ID, SectionID, VideoID):
    # Todo : ID is ID Course
    Context = {}
    if request.method == 'POST' and request.is_ajax():
        StateTeacher = GetUser_ByMODEL(request, 'Teacher')
        if StateTeacher != None:
            StateCourse = Course.objects.filter(id=ID, Teacher_id=StateTeacher.id).first()
            if StateCourse != None:
                StateSection = SectionCourse.objects.filter(id=SectionID, Course_id=StateCourse.id).first()
                if StateSection != None:
                    StateVideo = VideoCourse.objects.filter(id=VideoID, Section_id=StateSection.id).first()
                    StateVideo.delete()
                    Context['Status'] = '200'
        return JsonResponse(Context)
    raise PermissionDenied


@csrf_exempt
def AddDiscount(request, ID):
    # Todo : ID Is ID Course
    Context = {}
    if request.method == 'POST' and request.is_ajax():
        StateTeacher = GetUser_ByMODEL(request, 'Teacher')
        if StateTeacher != None:
            StateCourse = Course.objects.filter(id=ID, Teacher_id=StateTeacher.id).first()
            if StateCourse != None:
                if StateCourse.HasDiscount() == False:
                    Data = json.loads(request.body)
                    Title = Data.get('Title') or ''
                    Percent = Data.get('Percent') or None
                    Time = Data.get('Time') or None
                    if ValidationText(Percent, 0, 3) and ValidationText(Time, 0, 10):
                        D = Discount.objects.create(Course_id=StateCourse.id, Title=Title, Percent=Percent, Time=Time)
                        Context['Status'] = '200'
                    else:
                        Context['Status'] = '203'
                else:
                    Context['Status'] = '208'
            else:
                Context['Status'] = '404'
        else:
            Context['__Redirect__'] = 'true'
            Context['__RedirectURL__'] = '/t/Panel/Login-Register'
        return JsonResponse(Context)
    raise PermissionDenied

@csrf_exempt
def DeleteDiscount(request,ID):
    # Todo : ID is ID Course
    Context = {}
    if request.method == 'POST' and request.is_ajax():
        StateTeacher = GetUser_ByMODEL(request,'Teacher')
        if StateTeacher != None:
            StateCourse = Course.objects.filter(id=ID,Teacher_id=StateTeacher.id).first()
            if StateCourse != None:
                Discounts = Discount.objects.filter(Course_id=StateCourse)
                for i in Discounts:
                    i.delete()
                Context['Status'] = '200'
            else:
                Context['Status'] = '404'
        else:
            Context['__Redirect__'] = 'true'
            Context['__RedirectURL__'] = '/t/Panel/Login-Register'
        return JsonResponse(Context)
    raise PermissionDenied
