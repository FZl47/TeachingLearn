from django.db import models
from django.http import JsonResponse, HttpResponse
from Config.Tools import GetDifferenceTime
from django.utils import timezone
from datetime import timedelta, datetime
from Student.models import CoursePurchased
import calendar
import math
import requests
import json


def UploadTo_ImageCourse(instance, path):
    return f'ImagesCourse/{instance.id}/{instance.Title}{path}'


def UploadTo_VideoCourse(instance, filename):
    Format = filename.split('.')
    Format = Format[len(Format) - 1]
    P = f'VideoCourse/{instance.Section.Course.Title}/Section_{instance.Section.id}/Video_{instance.id}.{Format}'.replace(
        ' ', '_')
    return P


class VideoCourse(models.Model):
    Section = models.ForeignKey('Course.SectionCourse', on_delete=models.CASCADE)
    Video = models.FileField(upload_to=UploadTo_VideoCourse, null=True)
    DurationVideo = models.CharField(max_length=20, null=True, blank=True)
    DateTimeSubmit = models.DateTimeField(auto_now_add=True)
    StateVideo = (
        ('200', '200'),
        ('400', '400')
    )
    StateVideo = models.CharField(max_length=30, choices=StateVideo, default='400')

    def __str__(self):
        P = f'{self.Section.Course.Title}_{self.Section.id}_{self.id}'.replace(' ', '_')
        return P

    def GetDurationVideo(self):
        if self.DurationVideo != None:
            Duration = float(self.DurationVideo)
            if Duration != 0 and Duration > 0:
                Second = math.floor(Duration % 60)
                Minute = math.floor(Duration // 60)
                M = ''
                if Minute != 0:
                    M = f'{Minute}m'
                Duration = f'{M} {Second}s'
                return Duration
        return '0s'

    def GetTimePastSubmit(self):
        return GetDifferenceTime(self.DateTimeSubmit)


class SectionCourse(models.Model):
    Course = models.ForeignKey('Course.Course', on_delete=models.CASCADE)
    Title = models.CharField(max_length=150)
    DateTimeSubmit = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.Title

    def GetVideos(self):
        return VideoCourse.objects.filter(Section_id=self.id)

    def LenVideos(self):
        return VideoCourse.objects.filter(Section_id=self.id).__len__()


class Discount(models.Model):
    Course = models.ForeignKey('Course.Course', on_delete=models.CASCADE)
    Title = models.CharField(max_length=200, null=True, blank=True)
    Percent = models.CharField(max_length=5)
    Time = models.CharField(max_length=15)
    DateTimeSubmit = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.Course.Title}_{self.Time} hour'

    def TimeExpired(self):
        TimeSubmit = self.DateTimeSubmit
        Hour = int(self.Time)
        Res = (TimeSubmit + timedelta(hours=Hour))
        if datetime.now() > Res:
            self.delete()
        return str(Res)


class Comment(models.Model):
    Student = models.ForeignKey('Student.Student', on_delete=models.CASCADE)  # Student
    Course = models.ForeignKey('Course.Course', on_delete=models.CASCADE)
    Text = models.TextField()
    TextAnswer = models.TextField(null=True, blank=True,default=None)
    DateTimeSubmit = models.DateTimeField(auto_now_add=True)
    DateTimeSubmitAnswer = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f'{self.Student.GetNameAndFamily()}'

    def TimePastSubmit(self):
        return GetDifferenceTime(self.DateTimeSubmit)

    def TimePastSubmitAnswer(self):
        return GetDifferenceTime(self.DateTimeSubmitAnswer)

    def CommentAnswered(self):
        return True if self.TextAnswer != None and self.TextAnswer != '' else False


def change_image_path(instance, filepath):  # Unuseful
    filepath = filepath.split('.')[-1]
    return f'CoursesImages/{instance.id}-{instance.Name}.{filepath}'


class VisitCourse(models.Model):
    Course = models.ForeignKey('Course.Course', on_delete=models.CASCADE)
    DateTimeSubmit = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'View {self.Course.Title}'


class Course(models.Model):
    Teacher = models.ForeignKey('Teacher.Teacher', on_delete=models.CASCADE)
    Title = models.CharField(max_length=200)
    Description = models.TextField()
    StateCourse = (
        ('Active', 'Active'),
        ('Pause', 'Pause'),
        ('Completed', 'Completed')
    )
    PreRequisites = models.CharField(max_length=200)
    References = models.CharField(max_length=1000)
    StateCourse = models.CharField(choices=StateCourse, max_length=20)
    DateTimeSubmit = models.DateTimeField(auto_now_add=True)
    LastTimeUpdated = models.DateTimeField(null=True, blank=True)
    Image = models.ImageField(upload_to=UploadTo_ImageCourse, null=True)
    Price = models.CharField(max_length=15)

    def __str__(self):
        return self.Title

    def TimePastSubmit(self):
        return GetDifferenceTime(self.DateTimeSubmit)

    def TimePastUpdated(self):
        TimeUpdated = self.LastTimeUpdated
        if TimeUpdated != None and TimeUpdated != '':
            return GetDifferenceTime(TimeUpdated)
        return 'Unknown'

    def CourseIsFree(self):
        if self.Price == '0':
            return True
        return False

    def GetLenVisits(self):
        return VisitCourse.objects.filter(Course_id=self.id).count()

    def GetPrice(self):
        if self.HasDiscount():
            Price = float(self.Price)
            return Price - (Price / 100) * float(self.GetDiscount().Percent)
        return self.Price

    def GetPriceWithoutDiscount(self):
        return self.Price

    def GetSections(self):
        return SectionCourse.objects.filter(Course_id=self.id).order_by('id')

    def GetLenSection(self):
        return len(self.GetSections())

    def GetVideosTimeHour(self):
        TimeVidSecond = 0
        Videos = VideoCourse.objects.filter(Section__Course_id=self.id).all()
        for Video in Videos:
            TimeVidSecond += float(Video.DurationVideo)
        return math.floor((math.floor(TimeVidSecond) / 3600))

    def GetVideoTime(self):
        TimeVidSecond = 0
        Videos = VideoCourse.objects.filter(Section__Course_id=self.id).all()
        for Video in Videos:
            TimeVidSecond += float(Video.DurationVideo)
        Min = 0
        Hour = math.floor(TimeVidSecond / 3600)
        if Hour != 0:
            Min = math.floor(TimeVidSecond % 60)
        else:
            Min = math.floor(TimeVidSecond / 60)
        H = ''
        T = ''
        if Hour > 0:
            H = f'{Hour}h'

        M = f'{Min}m'
        if H != '':
            T = f'{H} {M}'
        else:
            T = M
        return T

    def UpdateTimeCourse(self):
        self.LastTimeUpdated = timezone.now()
        self.save()

    def HasDiscount(self):
        D = Discount.objects.filter(Course_id=self.id).first()
        return True if D != None else False

    def GetDiscount(self):
        return Discount.objects.filter(Course_id=self.id).first()

    def UrlViewCourse(self):
        return f'Panel/Course/{self.id}'

    def UrlViewCourseStudents(self):
        return f'/c/{self.id}'

    def GetLenStudents(self):
        return CoursePurchased.objects.filter(Course_id=self.id).count()

    def GetReferences(self):
        return self.References.split(',')

    def GetAllComments(self):
        return Comment.objects.filter(Course_id=self.id).order_by('TextAnswer', '-id')

    def GetNewComments(self):
        return Comment.objects.filter(Course_id=self.id, TextAnswer=None).order_by('-id')

    def GetLenComments(self):
        return Comment.objects.filter(Course_id=self.id).count()

    def GetLenNewComments(self):
        return len(self.GetNewComments())

    def GetAllMoneyPayment(self):
        Payments = CoursePurchased.objects.filter(Course_id=self.id)
        Money = 0
        for i in Payments:
            Money += float(i.Price)
        return Money


    def GetCountAllVisits(self):
        Visits = VisitCourse.objects.filter(Course_id=self.id)
        VisitCount = 0
        for i in Visits:
            VisitCount += 1
        return VisitCount


    # Charts

    #  Charts Visits
    def GetDataChart_VisitsToday(self):
        ViewLen = {}
        Today = datetime.today()
        ThisYear = Today.year
        ThisMonth = Today.month
        ThisToday = Today.day
        ViewsCourseGet = VisitCourse.objects.filter(Course_id=self.id, DateTimeSubmit__year=ThisYear,
                                                    DateTimeSubmit__month=ThisMonth,
                                                    DateTimeSubmit__day=ThisToday).order_by('id')
        CounterLenView = 0
        for View in ViewsCourseGet:
            try:
                CounterLenView += 1
                ViewLen[f'hour:{View.DateTimeSubmit.hour}']
                ViewLen[f'hour:{View.DateTimeSubmit.hour}'] = int(CounterLenView)
            except:
                CounterLenView = 1
                ViewLen[f'hour:{View.DateTimeSubmit.hour}'] = CounterLenView
        D = {
            "Labels": list(ViewLen.keys()),
            "Values": list(ViewLen.values())
        }
        D = json.dumps(D)
        D = json.loads(D)
        return D


    def GetDataChart_VisitsMonth(self):
        ViewLen = {}
        Today = datetime.today()
        ThisYear = Today.year
        ThisMonth = Today.month
        ViewsCourseGet = VisitCourse.objects.filter(Course_id=self.id, DateTimeSubmit__year=ThisYear,
                                                    DateTimeSubmit__month=ThisMonth).order_by('id')
        CounterLenView = 0
        for View in ViewsCourseGet:
            try:
                CounterLenView += 1
                ViewLen[f'day:{View.DateTimeSubmit.day}']
                ViewLen[f'day:{View.DateTimeSubmit.day}'] = int(CounterLenView)
            except:
                CounterLenView = 1
                ViewLen[f'day:{View.DateTimeSubmit.day}'] = CounterLenView
        D = {
            "Labels": list(ViewLen.keys()),
            "Values": list(ViewLen.values())
        }
        D = json.dumps(D)
        D = json.loads(D)
        return D


    def GetDataChart_VisitsYear(self):
        ViewLen = {}
        Today = datetime.today()
        ThisYear = Today.year
        ViewsCourseGet = VisitCourse.objects.filter(Course_id=self.id, DateTimeSubmit__year=ThisYear).order_by('id')
        CounterLenView = 0
        for View in ViewsCourseGet:
            ThisMonth = calendar.month_name[View.DateTimeSubmit.month]
            try:
                CounterLenView += 1
                ViewLen[f'{ThisMonth}']
                ViewLen[f'{ThisMonth}'] = int(CounterLenView)
            except:
                CounterLenView = 1
                ViewLen[f'{ThisMonth}'] = CounterLenView
        D = {
            "Labels": list(ViewLen.keys()),
            "Values": list(ViewLen.values())
        }
        D = json.dumps(D)
        D = json.loads(D)
        return D


    # Charts Financial statistics

    def GetDataChart_MoneyMonth(self):
        MoneyAll = {}
        Date = datetime.today()
        ThisYear = Date.year
        ThisMonth = Date.month
        ListPurchased = CoursePurchased.objects.filter(Course_id=self.id, DateTimeSubmit__year=ThisYear,
                                                       DateTimeSubmit__month=ThisMonth).order_by('id')
        for Purchased in ListPurchased:
            Today = Purchased.DateTimeSubmit.day
            try:
                MoneyAll[f'day:{Today}']
                MoneyAll[f'day:{Today}'] += float(Purchased.Price)
            except:
                MoneyAll[f'day:{Today}'] = float(Purchased.Price)
        D = {
            "Labels": list(MoneyAll.keys()),
            "Values": list(MoneyAll.values())
        }
        D = json.dumps(D)
        D = json.loads(D)
        return D


    def GetDataChart_MoneyYear(self):
        MoneyAll = {}
        Date = datetime.today()
        ThisYear = Date.year
        ListPurchased = CoursePurchased.objects.filter(Course_id=self.id, DateTimeSubmit__year=ThisYear).order_by('id')
        for Purchased in ListPurchased:
            NumberMonth = Purchased.DateTimeSubmit.month
            MonthName = calendar.month_name[NumberMonth]
            try:
                MoneyAll[MonthName]
                MoneyAll[MonthName] += float(Purchased.Price)
            except:
                MoneyAll[MonthName] = float(Purchased.Price)
        D = {
            "Labels": list(MoneyAll.keys()),
            "Values": list(MoneyAll.values())
        }
        D = json.dumps(D)
        D = json.loads(D)
        return D
