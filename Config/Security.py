import json
from django.urls import path
from django.core.exceptions import PermissionDenied


#-----------------------       Sec         ----------------------------
CodeDec = {
    'a':'g2',
    'A':'G1',
    'b':'tt',
    'B':'En',
    'c':'xx',
    'C':'q3',
    'd':'kw',
    'D':'aa',
    'e':'rr',
    'E':'ft',
    'f':'1l',
    'F':'b8',
    'g':'po',
    'G':'pi',
    'h':'ty',
    'H':'uu',
    'i':'sd',
    'I':'0l',
    'j':'8j',
    'k':'2v',
    'K':'Zs',
    'l':'TW',
    'L':'9M',
    'm':'4G',
    'M':'U2',
    'n':'qe',
    'N':'sg',
    'o':'SF',
    'O':'IU',
    'p':'YY',
    'P':'RC',
    'q':'vv',
    'Q':'Q4',
    'r':'f2',
    'R':'8H',
    's':'FN',
    'S':'sA',
    't':'4w',
    'T':'t6',
    'u':'1k',
    'U':'1D',
    'v':'T3',
    'V':'S8',
    'w':'oq',
    'W':'px',
    'x':'gf',
    'X':'C3',
    'y':'2B',
    'Y':'LP',
    'z':'Kv',
    'Z':'Ba',
    '1':'jS',
    '2':'vs',
    '3':'ve',
    '4':'fr',
    '5':'0b',
    '6':'2m',
    '7':'em',
    '8':'re',
    '9':'Rt',
    '0':'Bv',
    '@':'PV',
    '-':'4S',
    '_':'J2',
    '$':'Oo',
    ':':'T2'
}

def Decode(Password):
    PasswordDecoded = ''
    for C in Password:
        try:
            PasswordDecoded += CodeDec[C]
        except:
            raise PermissionDenied
    return PasswordDecoded


def UnDecode(PasswordDecode):
    if PasswordDecode == None or PasswordDecode == '' : return None
    PasswordUnDecoded = ''
    for Index in range(len(PasswordDecode)):
        if Index % 2 == 0:
            SplitPasswordDecode = f'{PasswordDecode[Index]}{PasswordDecode[Index + 1]}'
            for Key, Val in CodeDec.items():
                if Val == SplitPasswordDecode:
                    PasswordUnDecoded += Key

    return PasswordUnDecoded


# ------------------        Data Name        --------------------------------

"""

UserName : QlYSqVS
Password : YPtIeRC

"""



#---------------------        Help          -------------------------

# How to Use in --> View
"""
        Context = {}
        UserName = Data.get('UserName')
        Password = Data.get('Password')
        UserState = User.objects.filter(UserName=UserName, Password=Password).first()
        if UserState != None:
            PasswordDecoded = Decode(Password)
            Context['PasswordDecoded'] = PasswordDecoded
            Context['Status'] = '200'
            Context['StatusText'] = 'خوش امدید'
        else:
            Context['Status'] = '404'
            Context['StatusText'] = 'کاربری با این مشخصات وجود ندارد'
            
        return JsonResponse(Context)
"""


# How to Sign Out
"""
    Set 'None*_' On Cookies
"""