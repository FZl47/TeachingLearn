# {% load FilterTags %} For Use Set This in Template

import math
from django import template

register = template.Library()

@register.filter
@register.simple_tag()
def Length_Less(NumberGeted,Length):
    if int(NumberGeted) < int(Length):
        return True
    return False

@register.filter
@register.simple_tag()
def Length_Bigger(NumberGeted,Length):
    if int(NumberGeted) > int(Length):
        return True
    return False


@register.filter
@register.simple_tag()
def ConvertQueryDictToList(QueryDict):
    List = []
    State = None
    for i in QueryDict:
        List.append(i)
        State = True
    if State == None:
        return None
    return List


@register.filter
@register.simple_tag()
def ValueIsNone(Value):
    if Value == None or Value == '' or Value == ' ' or Value == 'None' :
        return True
    return False

@register.filter
@register.simple_tag()
def Round(Number,i):
    if Number != None and Number != '' and Number != ' ':
        D = str(round(Number,i))
        Z1 = int(D.split('.')[0])
        Z2 = int(D.split('.')[1])
        if Z2 == 0:
            return Z1
        else:
            return D
    return ''

@register.filter
@register.simple_tag()
def CheckValTagIsNone(Val):
    if Val == '' or Val == ' ' or Val == None :
        return 'TagMustNull'
    return ''

@register.filter
@register.simple_tag()
def GetValInListString(Str,Index):
    List = str(Str).split(',')
    if Index >= len(List):
        return None
    return List[Index]

@register.filter
@register.simple_tag()
def ConvertStringToList_Str(Str):
    List = str(Str).split(',')
    return List

@register.filter
@register.simple_tag()
def SearchInList(List,Value):
    List = list(List)
    for i in List:
        if Value == i:
            return i
    return None

@register.filter
@register.simple_tag()
def NoneNull(Value):
    if Value == None:
        return ''
    return Value

@register.filter
@register.simple_tag()
def TrueOrFalse(Value):
    if Value == '' or Value == ' ' or Value == None :
        return 'false'
    return 'true'

@register.filter
@register.simple_tag()
def NoneVal(ValCheck,ValSet):
    if ValCheck == None:
        return ValSet
    else:
        if ValCheck != '' and ValCheck != ' ':
            return ValCheck
        else:
            return ValSet

@register.filter
@register.simple_tag()
def ValInList(List,Value):
    if Value in List:
        return 'true'
    return 'false'


@register.filter
@register.simple_tag()
def ListIsNone(List):
    try:
        List[0]
        return False
    except:
        return True

@register.filter
@register.simple_tag()
def GetValueInDic(Dic,Key):
    try:
        return Dic[Key]
    except:
        return ''

@register.filter
@register.simple_tag()
def GetKeysDic(Dic):
    return Dic.keys()

@register.filter
@register.simple_tag()
def GetValuesDic(Dic):
    return Dic.values()