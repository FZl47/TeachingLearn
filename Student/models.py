from django.db import models
from Config.Security import UnDecode , Decode
from Config.Tools import GetDifferenceTime


class Order(models.Model):
    Student = models.ForeignKey('Student.Student',on_delete=models.CASCADE)
    Course = models.ForeignKey('Course.Course',on_delete=models.CASCADE)
    DateTimeSubmit = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.Student.GetNameAndFamily()

    def GetTimePastSubmit(self):
        return GetDifferenceTime(self.DateTimeSubmit)


class CoursePurchased(models.Model):
    Student = models.ForeignKey('Student.Student',on_delete=models.CASCADE)
    Course = models.ForeignKey('Course.Course',on_delete=models.CASCADE)
    HasDiscount = models.BooleanField(default=False)
    TitleDiscount = models.CharField(max_length=200, null=True, blank=True)
    PercentDiscount = models.CharField(max_length=5, null=True, blank=True)
    PriceWithOutDiscount = models.CharField(max_length=200, null=True, blank=True)
    Price = models.CharField(max_length=200, null=True, blank=True)
    DateTimeSubmit = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.Student.__str__()

    def GetTimePastSubmit(self):
        return GetDifferenceTime(self.DateTimeSubmit)


class Student(models.Model):
    FirstName = models.CharField(max_length=200,null=True,blank=True)
    LastName = models.CharField(max_length=200,null=True,blank=True)
    Email = models.CharField(max_length=70)
    PhoneNumber = models.CharField(max_length=20,null=True,blank=True)
    City = models.CharField(max_length=30,null=True,blank=True)
    DateTimeJoin = models.DateTimeField(auto_now_add=True)
    UserName = models.CharField(max_length=100)
    Password = models.CharField(max_length=100)

    def __str__(self):
        if self.FirstName != None and self.LastName != None:
            return self.FirstName + '' + self.LastName
        return 'User'

    def DecodeUserNameAndPassword(self):
        # QlYSqVS_ : UserName
        # YPtIeRC_ : Password
        return {
            'QlYSqVS': Decode(self.UserName),
            'YPtIeRC': Decode(self.Password)
        }

    def GetNameAndFamily(self):
        return self.__str__()

    def GetSrcPanel(self):
        return '/s/Panel'

    def GetCourseOrdersID(self):
        return Order.objects.filter(Student_id=self.id).values_list('Course_id',flat=True)

    def GetCourseOrders(self):
        return Order.objects.filter(Student_id=self.id)[::-1]

    def GetCoursePayedID(self):
        return CoursePurchased.objects.filter(Student_id=self.id).values_list('Course_id',flat=True)

    def GetCoursePayed(self):
        return CoursePurchased.objects.filter(Student_id=self.id)[::-1]







