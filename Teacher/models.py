from django.db import models
from Config.Security import Decode, UnDecode
from Course.models import Course, VisitCourse
from Student.models import CoursePurchased
from datetime import timedelta, datetime
import calendar
import json


def UploadTo(instance, filepath):
    filepath = filepath.split('.')[-1]
    return f'TeachersImages/{instance.id}-{instance.NameAndFamily}.{filepath}'


class Teacher(models.Model):
    NameAndFamily = models.CharField(max_length=200, null=True, blank=True)
    PhoneNumber = models.CharField(max_length=20, null=True, blank=True)
    Email = models.CharField(max_length=65, null=True, blank=True)
    AboutMe = models.TextField(null=True, blank=True)
    Image = models.ImageField(upload_to=UploadTo, null=True, blank=True)
    UserName = models.CharField(max_length=100, null=True, blank=True)
    Password = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.NameAndFamily or 'Teacher'

    def GetNameAndFamily(self):
        return self.__str__()

    def GetSrcPanel(self):
        return '/t/Panel'

    def DecodeUserNameAndPassword(self):
        # QlYSqVS_ : UserName
        # YPtIeRC_ : Password
        D = {
            'QlYSqVS': Decode(self.UserName),
            'YPtIeRC': Decode(self.Password)
        }
        return D

    def GetAllCourse(self):
        return Course.objects.filter(Teacher_id=self.id)[::-1]

    def GetLenCourse(self):
        return len(self.GetAllCourse()) or 0

    def GetCoursesActive(self):
        return Course.objects.filter(Teacher_id=self.id, StateCourse='Active')[::-1]

    def GetCoursesPause(self):
        return Course.objects.filter(Teacher_id=self.id, StateCourse='Pause')[::-1]

    def GetCoursesCompleted(self):
        return Course.objects.filter(Teacher_id=self.id, StateCourse='Completed')[::-1]

    def GetMoneyInMonth(self):
        Date = datetime.today()
        ThisYear = Date.year
        ThisMonth = Date.month
        Payments = CoursePurchased.objects.filter(Course__Teacher_id=self.id,DateTimeSubmit__year=ThisYear,DateTimeSubmit__month=ThisMonth)
        Money = 0
        for i in Payments:
            Money += float(i.Price)
        return Money or 0

    # Chart

    # Financial Statistics
    def GetFinancialStatistics_ThisMonth(self):
        MoneyInMonth = {}
        Date = datetime.today()
        ThisYear = Date.year
        ThisMonth = Date.month
        CoursePurchasedThisMonth = CoursePurchased.objects.filter(Course__Teacher_id=self.id,
                                                                  DateTimeSubmit__year=ThisYear,
                                                                  DateTimeSubmit__month=ThisMonth).order_by('id')
        for CoursePurchase in CoursePurchasedThisMonth:
            Today = CoursePurchase.DateTimeSubmit.day
            try:
                MoneyInMonth[f'day : {Today}']
                MoneyInMonth[f'day : {Today}'] += float(CoursePurchase.Price)
            except:
                MoneyInMonth[f'day : {Today}'] = float(CoursePurchase.Price)
        D = {
            "Labels": list(MoneyInMonth.keys()),
            "Values": list(MoneyInMonth.values())
        }
        D = json.dumps(D)
        D = json.loads(D)
        return D

    def GetFinancialStatistics_ThisYear(self):
        MoneyInMonth = {}
        Date = datetime.today()
        ThisYear = Date.year
        ThisMonth = Date.month
        CoursePurchasedThisMonth = CoursePurchased.objects.filter(Course__Teacher_id=self.id,
                                                                  DateTimeSubmit__year=ThisYear).order_by('id')

        for CoursePurchase in CoursePurchasedThisMonth:
            NameMonth = calendar.month_name[CoursePurchase.DateTimeSubmit.month]
            try:
                MoneyInMonth[f'{NameMonth}']
                MoneyInMonth[f'{NameMonth}'] += float(CoursePurchase.Price)
            except:
                MoneyInMonth[f'{NameMonth}'] = float(CoursePurchase.Price)
        D = {
            "Labels": list(MoneyInMonth.keys()),
            "Values": list(MoneyInMonth.values())
        }
        D = json.dumps(D)
        D = json.loads(D)
        return D

    # Visit All Course
    def GetDataChartVisitCourses_Today(self):
        VisitToDay = {}
        Date = datetime.today()
        ThisYear = Date.year
        ThisMonth = Date.month
        Today = Date.day
        VisitsCourses = VisitCourse.objects.filter(Course__Teacher_id=self.id, DateTimeSubmit__year=ThisYear,
                                                   DateTimeSubmit__month=ThisMonth, DateTimeSubmit__day=Today).order_by('id')
        CounterVisit = 0
        for Visit in VisitsCourses:
            Hour = Visit.DateTimeSubmit.hour
            try:
                CounterVisit += 1
                VisitToDay[f'hour:{Hour}']
                VisitToDay[f'hour:{Hour}'] = CounterVisit
            except:
                CounterVisit = 1
                VisitToDay[f'hour:{Hour}'] = CounterVisit
        D = {
            "Labels": list(VisitToDay.keys()),
            "Values": list(VisitToDay.values())
        }
        D = json.dumps(D)
        D = json.loads(D)
        return D

    def GetDataChartVisitCourses_ThisMonth(self):
        VisitMonth = {}
        Date = datetime.today()
        ThisYear = Date.year
        ThisMonth = Date.month
        VisitsCourses = VisitCourse.objects.filter(Course__Teacher_id=self.id, DateTimeSubmit__year=ThisYear,
                                                   DateTimeSubmit__month=ThisMonth).order_by('id')
        CounterVisit = 0
        for Visit in VisitsCourses:
            Today = Visit.DateTimeSubmit.day
            try:
                CounterVisit += 1
                VisitMonth[f'day:{Today}']
                VisitMonth[f'day:{Today}'] = CounterVisit
            except:
                CounterVisit = 1
                VisitMonth[f'day:{Today}'] = CounterVisit

        D = {
            "Labels": list(VisitMonth.keys()),
            "Values": list(VisitMonth.values())
        }
        D = json.dumps(D)
        D = json.loads(D)
        return D

    def GetDataChartVisitCourses_ThisYear(self):
        VisitYear = {}
        Date = datetime.today()
        ThisYear = Date.year
        VisitsCourses = VisitCourse.objects.filter(Course__Teacher_id=self.id, DateTimeSubmit__year=ThisYear).order_by('id')
        CounterVisit = 0
        for Visit in VisitsCourses:
            ThisMonthNumber = Visit.DateTimeSubmit.month
            ThisMonth = calendar.month_name[ThisMonthNumber]
            try:
                CounterVisit += 1
                VisitYear[f'{ThisMonth}']
                VisitYear[f'{ThisMonth}'] = CounterVisit
            except:
                CounterVisit = 1
                VisitYear[f'{ThisMonth}'] = CounterVisit
        D = {
            "Labels": list(VisitYear.keys()),
            "Values": list(VisitYear.values())
        }
        D = json.dumps(D)
        D = json.loads(D)
        return D
