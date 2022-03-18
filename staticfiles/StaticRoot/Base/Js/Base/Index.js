function CreateMessage_Alert(Text, FuncWhenOK, ValueFunc = null, FuncWhenCancel = null) {
    CloseMessage_Alert()
    setTimeout(function () {
        document.body.className = ''

        let Container = document.createElement('div')
        let TextMessage = document.createElement('p')
        let BtnClose = document.createElement('button')
        let BtnOk = document.createElement('button')
        let BtnClose1 = document.createElement('i')


        Container.className = 'ContainerMessage_Alert'
        TextMessage.className = 'TextMessage_Alert'
        BtnClose.className = 'BtnClose_Alert BtnStyle_1'
        BtnOk.className = 'BtnOk_Alert BtnStyle_1'
        BtnClose1.className = 'fa fa-times BtnClose1_Alert'

        TextMessage.innerHTML = Text
        BtnClose.innerText = 'Cancel'
        BtnOk.innerText = 'Yes'

        BtnClose.onclick = function () {
            if (FuncWhenCancel != null) {
                FuncWhenCancel()
            }
            CloseMessage_Alert()
        }
        BtnClose1.onclick = function () {
            if (FuncWhenCancel != null) {
                FuncWhenCancel()
            }
            CloseMessage_Alert()
        }

        BtnOk.onclick = function () {
            if (ValueFunc != null) {
                FuncWhenOK(ValueFunc)
            } else {
                FuncWhenOK()
            }
            CloseMessage_Alert()
        }

        Container.appendChild(TextMessage)
        Container.appendChild(BtnClose)
        Container.appendChild(BtnClose1)
        Container.appendChild(BtnOk)
        ClickOutSideContainer(Container, function () {
            CloseMessage_Alert()
        }, 'OutSide')
        document.body.insertBefore(Container, document.body.firstElementChild)
        BlurAllElementsExceptMessage_Alert()
    })
}

function CloseMessage_Alert() {
    try {
        document.getElementsByClassName('ContainerMessage_Alert')[0].remove()
    } catch (e) {
    }
    Clear_BlurAllElementsExceptMessage_Alert()
}

function BlurAllElementsExceptMessage_Alert() {
    document.body.classList.add('BlurAllElementsExceptMessage_Alert')
    document.body.style.overflow = 'hidden'
}

function Clear_BlurAllElementsExceptMessage_Alert() {
    document.body.classList.remove('BlurAllElementsExceptMessage_Alert')
    document.body.style.overflow = ''
}


////////////////////////////////////   Slider       /////////////////////////////////

let Sliders = document.querySelectorAll('.Sliders')
for (let i of Sliders) {
    i.setAttribute('LengthSlider', i.querySelectorAll('.Slider').length)
    i.setAttribute('IndexElementActive', '0')
    if (i.getAttribute('Timer') != null && i.getAttribute('Timer') != '') {
        i.setAttribute('StateTimer', 'Active')
        TimingSlider(i)
    }
}


function ChangeSlider(ContainerSlider, Type, Btn) {
    let LenSlider = ContainerSlider.querySelectorAll('.Slider').length
    if (LenSlider != '0') {


        ContainerSlider.setAttribute('StateTimer', 'Disabled')

        if (Btn == 'Active') {
            let Prev_Next = null
            if (Type == 'Next') {
                ContainerSlider.setAttribute('IndexElementActive', Number(ContainerSlider.getAttribute('IndexElementActive')) - 1)
                Prev_Next = -1
            } else {
                ContainerSlider.setAttribute('IndexElementActive', Number(ContainerSlider.getAttribute('IndexElementActive')) + 1)
                Prev_Next = 1
            }
            if (Number(ContainerSlider.getAttribute('IndexElementActive')) < 0) {
                ContainerSlider.setAttribute('IndexElementActive', 0)
            }
            let Sliders = ContainerSlider.querySelectorAll('.Slider')
            let ElementActive = ContainerSlider.querySelector('.SliderActive')
            let IndexNextElementActive = Array.prototype.slice.call(Sliders).indexOf(ElementActive) + Prev_Next
            ElementActive.classList.remove('SliderActive')
            try {
                Sliders[IndexNextElementActive].classList.add('SliderActive')
            } catch (e) {
                Sliders[0].classList.add('SliderActive')
            }


            if (Number(ContainerSlider.getAttribute('LengthSlider')) - 1 == ContainerSlider.getAttribute('IndexElementActive')) {
                ContainerSlider.querySelector('.BtnPrevSlider').setAttribute('State', 'Disabled')
            } else {
                ContainerSlider.querySelector('.BtnPrevSlider').setAttribute('State', 'Active')
            }

            if (ContainerSlider.getAttribute('IndexElementActive') == 0) {
                ContainerSlider.querySelector('.BtnNextSlider').setAttribute('State', 'Disabled')
            } else {
                ContainerSlider.querySelector('.BtnNextSlider').setAttribute('State', 'Active')
            }
        }
        ContainerSlider.setAttribute('StateTimer', 'Active')
    }
}

function TimingSlider(Slider) {
    let StateTimer = Slider.getAttribute('StateTimer')
    let Timer = Slider.getAttribute('Timer')
    setInterval(function () {
        if (StateTimer == 'Active') {
            let BtnPrevSlider = Slider.querySelector('.BtnPrevSlider')
            let BtnNextSlider = Slider.querySelector('.BtnNextSlider')
            let IndexElementActive = Number(Slider.getAttribute('IndexElementActive'))
            let LengthSlider = Number(Slider.getAttribute('LengthSlider'))

            ChangeSlider(Slider, 'Prev', BtnPrevSlider.getAttribute('State'))

            if (IndexElementActive == LengthSlider - 1) {
                BtnNextSlider.setAttribute('State', 'Disabled')
                Slider.children[IndexElementActive].classList.remove('SliderActive')
                Slider.firstElementChild.classList.add('SliderActive')
                Slider.setAttribute('IndexElementActive', 0)
                BtnPrevSlider.setAttribute('State', 'Active')
            }
        }
    }, Timer)
}

function ScrollOnElement(ID_Element, Element = null) {
    if (ID_Element == null) {
        try {
            window.scrollTo(0, Element.scrollTop)
        } catch (e) {
        }
    }
    try {
        let Element = document.getElementById(ID_Element)
        window.scrollTo(0, Element.scrollTop) || Element.scrollIntoView()
    } catch (e) {
        // Element.scrollIntoView()
        window.scrollTo(0, Element.scrollTop)
    }
}

function GoToTopPage() {
    window.scrollTo(0, 0)
}

function GoToUrl(Url, Target = 'Self') {

    if (Target == 'Self') {
        window.location.href = Url
    } else if (Target == 'Blank') {
        window.open(Url, '_blank')
    }
}

function GoToProduct(Slug) {
    window.open(`/Product/${Slug}`, '_blank');
}


function CloseContainerProducts(ID_Container) {
    document.getElementById(ID_Container).classList.add('d-none')
    ClearEffectOnBody()
}

function ClearEffectOnBody() {
    document.body.removeAttribute('class')
}


function SendAjax(Url, Data = {}, Method = 'POST', Success, Failed) {

    function __Redirect__(response) {
        if (response.__Redirect__ == 'True') {
            setTimeout(function () {
                window.location.href = response.__RedirectURL__
            }, parseInt(response.__RedirectAfter__ || 0))
        }
    }

    if (Success == undefined) {
        Success = function (response) {
            __Redirect__(response)
        }
    }
    if (Failed == undefined) {
        Failed = function (response) {
            ShowNotificationMessage('ارتباط با سرور بر قرار نشد ', 'Error', 30000, 2)
        }
    }
    $.ajax(
        {
            url: Url,
            data: JSON.stringify(Data),
            type: Method,
            success: function (response) {
                __Redirect__(response)
                Success(response)
            },
            failed: function (response) {
                __Redirect__(response)
                Failed(response)
            },
            error: function (response) {
                __Redirect__(response)
                Failed(response)
                RemoveLoading()
            }
        }
    )
}

function ShowNotificationMessage(Text, Type, Timer = 5000, LevelOfNecessity = 2) {
    RemoveAllNotifications()

    let ContainerMessage = document.createElement('div')
    let Message = document.createElement('p')
    let BtnClose = document.createElement('i')

    ContainerMessage.classList.add('NotificationMessage')
    ContainerMessage.classList.add(`LevelOfNecessity_${LevelOfNecessity}`)
    ContainerMessage.classList.add(`Notification${Type}`)
    Message.innerText = Text
    BtnClose.className = 'fa fa-times BtnCloseNotification'


    ContainerMessage.appendChild(BtnClose)
    ContainerMessage.appendChild(Message)
    document.body.appendChild(ContainerMessage)
    setTimeout(function () {
        ContainerMessage.remove()
    }, Timer)

    BtnClose.onclick = function () {
        ContainerMessage.remove()
    }
}

function RemoveAllNotifications() {
    try {
        document.getElementsByClassName('NotificationMessage')[0].remove()
        document.getElementsByClassName('NotificationMessage')[1].remove()
    } catch (e) {
    }
}

function ValidListInputs(Inputs) {
    let State = true
    for (let Input of Inputs) {
        let Valid = Input.getAttribute('Valid')
        if (Valid == false || Valid == null || Valid == undefined) {
            State = false
        }
    }
    return State
}

function IsBlank(Value) {
    return (!Value || /^\s*$/.test(Value));
}


function CheckInputValidations(Input, Bigger, Less, SetIn = 'Input', Type = 'Text', NoSpace = false) {
    let State
    let Value = Input.value
    let ValueLength = Value.length
    if (Type == 'Email') {
        Value = ValidationEmail(Value)
    }
    if (Type == 'Number') {
        Value = ValidationIsNumber(Value)
    }
    if (Value != '' && Value != ' ' && Value != null && Value != undefined && IsBlank(Value) != true && Value != false) {
        if (ValueLength < Less && ValueLength > Bigger) {
            State = true
        } else {
            State = false
        }
    } else {
        State = false
    }


    if (SetIn != 'None') {
        if (SetIn == 'Container') {
            let Container = Input.parentNode
            if (State == true) {
                Container.classList.add('InputValid')
            } else {
                Container.classList.remove('InputValid')
            }
        }
        if (SetIn == 'Icon') {
            let Icon = Input.parentNode.querySelector('i')
            if (State == true) {
                Icon.classList.remove('fa-times-circle')
                Icon.classList.add('fa-check-circle')
            } else {
                Icon.classList.add('fa-times-circle')
                Icon.classList.remove('fa-check-circle')
            }
        }
        if (SetIn == 'Input') {
            if (State == true) {
                Input.classList.add('InputValid')
                Input.classList.remove('InputInValid')
            } else {
                Input.classList.remove('InputValid')
                Input.classList.add('InputInValid')
            }
        }
    }

    if (NoSpace == true && Type == 'Text') {
        Input.value = Value.replace(/\s+/g, '')
    }

    Input.setAttribute('Valid', State)
    return State
}


//////////////////////////////////                  Scroll          ///////////////////////////////////////////////

let HeightWindowBaseTemplate = window.innerHeight
window.onscroll = function () {
    try {
        if (window.scrollY > HeightWindowBaseTemplate) {
            document.getElementById('ButtonGoToTopPage').classList.add('ButtonGoToTopIsShow')
        } else {
            document.getElementById('ButtonGoToTopPage').classList.remove('ButtonGoToTopIsShow')
        }
    } catch (e) {
    }
}

//////////////////////////////////                Functionality Cookie         ///////////////////////////////////////////////

function SetCookieFunctionality_ShowNotification(Text, Type, Timer = 5000, LevelOfNecessity = 2) {
    document.cookie = `Functionality_N=${Text}~${Type}~${Timer}~${LevelOfNecessity};path=/`
}


function GetCookieFunctionality_ShowNotification() {
    let AllCookies = document.cookie.split(';')
    let Cookie_Key
    let Cookie_Val
    for (let Co of AllCookies) {
        let Key = Co.split('=')[0]
        let Value = Co.split('=')[1]
        if (Key == 'Functionality_N' || Key == ' Functionality_N' || Key == ' Functionality_N ') {
            Cookie_Key = Key
            Cookie_Val = Value
        }
    }
    let Text
    let Type
    let Timer
    let LevelOfNecessity
    try {
        Text = Cookie_Val.split('~')[0] || 'نا مشخص'
        Text = Text.replace('"', '')
        Text = Text.replace("'", '')
        Type = Cookie_Val.split('~')[1] || 'Warning'
        Timer = Cookie_Val.split('~')[2] || 8000
        LevelOfNecessity = Cookie_Val.split('~')[3] || 2
    } catch (e) {
    }
    if (Cookie_Key == 'Functionality_N' || Cookie_Key == ' Functionality_N' || Cookie_Key == ' Functionality_N ') {
        ShowNotificationMessage(Text, Type, Timer, LevelOfNecessity)
    }
    document.cookie = `${Cookie_Key}=Closed; expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
}


////////////////////////////////////// Remove In  List //////////////////////////////////////////////////

function RemoveInList(List, Index) {
    let Counter = 0
    Index = parseInt(Index)
    let NewList = []
    for (let i of List) {
        if (Counter != Index) {
            NewList.push(i)
        }
        Counter++
    }
    return NewList
}

//////////////////////////////////   List Is None ///////////////////////////////////////////////////////////

function ListIsNone(List) {
    let State = false
    if (List[0] == undefined) {
        State = true
    }
    return State
}

////////////////////////////////////   Value in  List  ///////////////////////////////////////////////////

function ValueInList(List, Value) {
    let State = false
    List.filter(function (e) {
        if (e == Value) {
            State = true
        }
    })
    return State
}

////////////////////////////////////  Replace With Index  ///////////////////////////////////////////////
String.prototype.ReplaceWithIndex = function (StartIndex, EndIndex, NewStr) {
    return this.substring(0, StartIndex) + NewStr + this.substring(EndIndex);
};


/////////// Get Value in Attribute ToHref in Element in Redirect To Value Geted  ///////////////////////

function GoToUrlElement(This) {
    let Href = This.getAttribute('ToHref')
    GoToUrl(Href, 'Blank')
}

/////////////////////////////    Loading Notification  /////////////////////////////////////////////////
function RemoveLoading() {
    let ElementLoading = document.getElementsByClassName('LoadingNotification')[0]
    ElementLoading.remove()
    document.body.classList.remove('DisabledAllElementsExceptLoadingNotification')
}

//////////////////////////////////        Cookie          ////////////////////////////////////////

function GetCookieByName(Name) {
    let Res = null
    let Cookie = document.cookie
    for (let i of Cookie.split(';')) {
        let S1 = i.split('=')[0]
        let S2 = i.split('=')[1]
        if (S1 == Name || S1 == ` ${Name}` | S1 == `${Name} `) {
            Res = S2
        }
    }
    return Res
}

function SetCookie(Name, Value, ExpireDay = 30, Path = '/') {
    let T = new Date()
    T.setTime(T.getTime() + (ExpireDay * 24 * 60 * 60 * 1000))
    T = T.toUTCString()
    if (ExpireDay == 'Session') {
        T = ''
    }
    document.cookie = `${Name}=${Value};expires=${T};path=${Path}`
}

////////////////////////////  Split Number   /////////////////////////////////////////////////////////

function SplitPrice(Element = null) {
    let SplitPriceNumber
    if (Element == null) {
        SplitPriceNumber = document.getElementsByClassName('SplitNumber')
    } else {
        SplitPriceNumber = new Array(Element)
    }
    for (let P of SplitPriceNumber) {
        let ListChar = []
        let Price = String(P.getAttribute('Number'))
        let Result = Price
        let LengthNumber = Price.length

        if (LengthNumber > 3) {
            Result = ''
            for (let o of Price) {
                ListChar.push(o)
            }
            ListChar.reverse()
            let CounterList = 0
            for (let i of ListChar) {
                CounterList++
                if (CounterList % 4 == 0) {
                    ListChar.splice(CounterList - 1, 0, ' , ')
                }
            }
        }
        for (let C of ListChar.reverse()) {
            Result += C
        }
        P.innerText = Result
    }
}

//////////////////////////////      Title  Element       //////////////////////////////////////////////
let AllTitle_ = document.querySelectorAll('[Title_]')
for (let Element of AllTitle_) {
    let TextTitle = Element.getAttribute('Title_')

    function CreateTitleContainer() {
        let P = document.createElement('p')
        P.className = 'Title_Style_Customize'
        P.innerHTML = TextTitle
        Element.insertBefore(P, Element.firstChild)
    }

    CreateTitleContainer()
}

////////////////////////////////      Create Container Blur   /////////////////////////////////////////////
function CreateContainerBlur(Top = 'Default', Class = null, Style = null, Size = 'Medium') {
    DeleteContainerBlur()
    let Container = document.createElement('div')
    let Container2 = document.createElement('div')
    //  let IconClose = document.createElement('i')
    // IconClose.onclick = DeleteContainerBlur
    // IconClose.setAttribute('id','ContainerBlurIconClose')
    // IconClose.className = 'fa fa-times ContainerBlurIconClose'
    Container.setAttribute('ContainerBlur', '')
    Container.setAttribute('Size', Size)
    Container.className = 'ContainerBlur'
    Container2.className = 'ContainerContentBlur'
    Class != null ? Container.classList.add(Class) : ''
    Style != null ? Container.style = Style : ''
    Top != 'Default' ? Container.style.top = Top + '%' : Container.style.top = '1%'
    //   Container2.appendChild(IconClose)
    Container.appendChild(Container2)
    document.body.insertBefore(Container, document.body.firstElementChild)
    document.body.classList.add('BlurAllElementsExceptContainerBlur')
    ScrollOnElement(null, Container)
    return Container2
}

function DeleteContainerBlur() {
    try {
        document.querySelector('[ContainerBlur]').remove()
    } catch (e) {
    }
    document.body.classList.remove('BlurAllElementsExceptContainerBlur')
}


////////////////     Click Out Side Container Blur And Other Container With Blur    /////////////////

function ClickOutSideContainer(Container, FuncWhenOutSideClick, State = 'Inside') {
    document.addEventListener('click', ClickOutSideCnt = function (event) {
        let IsClickInContainer = Container.contains(event.target);
        if (!IsClickInContainer) {
            if (State == 'OutSide') {
                FuncWhenOutSideClick()
                State = 'Inside'
                document.removeEventListener('click', ClickOutSideCnt)
            }
            State = 'OutSide'
        }
    });
}

////////////////     Click Out Side Container or Not    /////////////////


function ReturnClickInContainer(Container) {
    let StateResult = false
    document.addEventListener('click', ClickInSideOrNot = function (event) {
        let StateClick = Container.contains(event.target)
        if (StateClick) {
            StateResult = true
        }
    })
    document.removeEventListener('click', ClickInSideOrNot)
    return StateResult
}

////////////////     Settings Container Menu    /////////////////


function OpenMenuContainer(Menu) {
    Menu.classList.remove('MenuIsClose')
    Menu.classList.add('MenuIsOpen')
}

function CloseMenuContainer(Menu) {
    Menu.classList.remove('MenuIsOpen')
    Menu.classList.add('MenuIsClose')
}


//////////////////////////////////       Trun Chate Letters   ////////////////////////////////////////////
function TrunCateLetter(Text, ToNumber) {
    Text = String(Text)
    let LenText = Text.length
    let Y = Text.substr(0, ToNumber)
    if (parseInt(LenText) > parseInt(ToNumber)) {
        Y += ' . . .'
    }
    return Y
}

//////////////////////////////////      Full Screen Element   ////////////////////////////////////////////
function OpenFullscreen(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}

//////////////////////////////////       Sign Out Account   ////////////////////////////////////////////
function SignOutAccount(Path = '/') {
    CreateMessage_Alert('Are you Sure you want sign out ?', function () {
        SetCookie('QlYSqVS', 'None*_', '0', Path)
        SetCookie('YPtIeRC', 'None*_', '0', Path)
        location.reload()
    }, Path)
}

//////////////////////////////////       Menu      ////////////////////////////////////////////

function CreateMenu(Content = '', Style = '', Class = '', ID = '') {
    let Container = document.createElement('div')
    Container.className = `_ContainerMenu ${Class}`
    Container.style = Style
    Container.id = ID
    let IconCloseMenu = `<i class="far fa-times IconCloseMenu" IconCloseMenu></i>`
    let Br = `<br>`
    Container.innerHTML = IconCloseMenu
    Container.innerHTML += Br
    Container.innerHTML += Br
    Container.innerHTML += Content
    Container.setAttribute('ContainerMenu', '')
    document.body.appendChild(Container)
    EffectOnBodyMenuIsOpen()
    return Container
}

function EffectOnBodyMenuIsOpen() {
    document.body.classList.add('EffectOnBodyMenuIsOpen')
}


//////////////////////////////////      Menu Touch   ////////////////////////////////////////////


function SetTouchPadOnElement(Element, Type, arguments) {
    if (Type == 'Width') {
        let Direction = arguments.Direction || 'Rtl'
        let Max = arguments.Max || 'WidthWindow'
        let Min = arguments.Min || 0
        let OnTouchEndF = arguments.OnTouchEnd || function () {
        }
        let OnTouchStartF = arguments.OnTouchStart || function () {
        }
        Element.classList.add('MenuIsClose')
        Element.ontouchstart = function (e) {
            if (Element.getAttribute('StateOnTouchStart') == 'true') {
                OnTouchStartF(e)
                Element.setAttribute('StateOnTouchStart', 'false')
                Element.classList.remove('MenuIsOpen')
                Element.classList.remove('MenuIsClose')
            }
        }
        Element.ontouchmove = function (e) {
            if (Element == e.target) {
                SetTouchIncreaseWidthElement(Element, e, Direction, Max, Min)
                Element.setAttribute('StateOnTouchStart', 'true')
                Element.style.transition = 'all 0s'
            }
        }
        Element.ontouchend = function (e) {
            OnTouchEndF(e)
            let Element = e.currentTarget
            let ElementInfo = Element.getBoundingClientRect()
            Element.classList.remove('MenuIsOpen')
            Element.classList.remove('MenuIsClose')
            let MaxWidthOpen
            let MaxPX
            let MaxPercentage
            MaxPX = parseInt(Max.split('px')[0])
            MaxWidthOpen = MaxPX
            if (!Number.isInteger(MaxWidthOpen)) {
                MaxPercentage = Number.isInteger(Max.split('%')[0])
                MaxWidthOpen = (Element.parentNode.getBoundingClientRect().width * MaxPercentage) / 100
            }
            if (ElementInfo.width > (MaxWidthOpen / 2 - 20)) {
                OpenMenuHamburger(Element)
            } else {
                CloseMenuHamburger(Element)
            }
            Element.removeAttribute('style')
        }
    } else if (Type == 'Move') {
        Element.ontouchmove = function (e) {
            if (Element == e.target) {
                SetTouchMoveElement(e)
            }
        }
    } else if (Type == 'Both') {
        let Direction = arguments.Direction || 'Rtl'
        let Max = arguments.Max || 'WidthWindow'
        let Min = arguments.Min || 0
        Element.ontouchmove = function (e) {
            SetTouchIncreaseWidthElement(Element, e, Direction, Max, Min)
            SetTouchMoveElement(e)
            Element.style.transition = 'all 0s'
        }
    }
    return Element
}

function CollectionHas(A, B) {
    for (let i = 0, len = A.length; i < len; i++) {
        if (A[i] == B) return true;
    }
    return false;
}

function FindElementParentBySelector(Element, Selector) {
    let All = document.querySelectorAll(Selector);
    let Cur = Element.parentNode;
    while (Cur && !CollectionHas(All, Cur)) {
        Cur = Cur.parentNode;
    }
    return Cur;
}


function SetTouchIncreaseWidthElement(ElementMenu, e, Direction, Max = 'WidthWindow', Min = 0) {
    let UnitWidthX = e.targetTouches[0].clientX
    let WidthWindow = window.outerWidth
    if (Direction == 'Ltr') {
        UnitWidthX = WidthWindow - UnitWidthX
    }
    let Element = e.target
    if (Max != 'WidthWindow') {
        let MaxPX = Max.split('px')[0]
        WidthWindow = Number(MaxPX);
        if (!Number.isInteger(WidthWindow)) {
            let MaxPercentage = Max.split('%')[0]
            WidthWindow = (Element.parentNode.getBoundingClientRect().width * MaxPercentage) / 100
            if (!Number.isInteger(WidthWindow)) {
                throw ('ValueError in ValueType SetTouch Functionality')
            }
        }
    }

    if (UnitWidthX <= WidthWindow && UnitWidthX >= Min) {
        Element.style.width = UnitWidthX + 'px'
        Element.setAttribute('Width', `${UnitWidthX}px`)
    }

}


function SetTouchMoveElement(e) {
    let UnitMoveX = e.targetTouches[0].clientX
    let UnitMoveY = e.targetTouches[0].clientY
    SetElementOnScreenX(e.target, UnitMoveX)
    SetElementOnScreenY(e.target, UnitMoveY)
}


function SetElementOnScreenX(Element, X) {
    let WidthWindow = parseInt(window.outerWidth)
    let InformationElement = Element.getBoundingClientRect()
    let Width = InformationElement.width
    if (X <= WidthWindow && X >= 0) {
        Element.style.left = `${X}px`
        Element.setAttribute('Left', `${X}px`)
    }
}

function SetElementOnScreenY(Element, Y) {
    let HeightWindow = parseInt(window.outerHeight)
    let InformationElement = Element.getBoundingClientRect()
    let Height = InformationElement.height
    if (Y <= HeightWindow && Y >= 0) {
        Element.style.top = `${Y}px`
        Element.setAttribute('Top', `${Y}px`)
    }
}


let VarStateEventClickDoc
let StateSetClickOutSideMenu = true

function SetClickOutSideMenu(Element) {
    if (StateSetClickOutSideMenu) {
        //  RemoveElementWhenPasteToMenu()
        for (let i of Element.children) {
            i.addEventListener('click', function (e) {
                if (e.target.getAttribute('IconCloseMenu') == null) {
                    OpenMenuContainer(Element)
                }
            })
        }
        document.addEventListener('click', VarStateEventClickDoc = function (event) {
            let IconOpenMenu = document.getElementById('IconHamburgerMenu')
            let StateClickMenu = Element.contains(event.target)
            let StateClickIconOpen = IconOpenMenu.contains(event.target)
            if (!StateClickMenu && !StateClickIconOpen) {
                CloseMenuHamburger(Element)
            }
        })
    }
    StateSetClickOutSideMenu = false
}


// let ElementMenuWithTouch = SetTouchPadOnElement(CreateMenu(ElementsInMenu), 'Width', {
//         'Direction': 'Ltr', 'Max': '210px', 'Min': '0', 'OnTouchEnd': function (e) {
//             let Element = e.target
//             let ElementInfo = Element.getBoundingClientRect()
//             Element.classList.remove('MenuIsOpen')
//             Element.classList.remove('MenuIsClose')
//             if (ElementInfo.width > 125) {
//                 OpenMenuHamburger()
//             } else {
//                 CloseMenuHamburger()
//             }
//             Element.removeAttribute('style')
//         }, 'OnTouchStart': function (e) {
//         }
//     }
// ) ------------------------ For Example --------------------------


function OpenMenuHamburger(ElementMenuWithTouch) {
    SetClickOutSideMenu(ElementMenuWithTouch)
    OpenMenuContainer(ElementMenuWithTouch)
}

function OpenMenuHamburgerID(ID) {
    let Element = document.getElementById(ID)
    OpenMenuHamburger(Element)
}


function CloseMenuHamburger(ElementMenuWithTouch) {
    CloseMenuContainer(ElementMenuWithTouch)
}

function CloseMenuHamburgerID(ID) {
    let Element = document.getElementById(ID)
    CloseMenuContainer(Element)
}


//////////////////////////////////      Get And Paste Element To Element   ////////////////////////////////////////////

function PasteElementToElement(Element, ToElement, Attr = '') {
    if (Attr != '' && Attr != ' ') {
        for (let Key in Attr) {
            Element.setAttribute(Key, Attr[Key]);
        }
    }
    ToElement.appendChild(Element)
}

//---------------------                          ClickFunc                           -----------------
// Run Function Passed In Attribute Elements

let AllClickFunc = document.querySelectorAll('[ClickFunc]')
for (let i of AllClickFunc) {
    i.onclick = function (e) {
        try {
            let Element = e.currentTarget
            let ValAttr = Element.getAttribute('ClickFunc')
            let NameFunc = ValAttr.split('(')[0]
            let ValFunc = ValAttr.split('(')[1]
            ValFunc = ValFunc.replace(')', '') || []
            if (typeof ValFunc == "string") {
                ValFunc = new Array(ValFunc)
            }
            let FuncRuned = window[NameFunc].apply(window, ValFunc)

        } catch (e) {
            throw (` Attribute "ClickFunc" In One of The Elements or Most Is Wrong`)
        }
    }
}


/*let FuncSetActiveContainer = ActiveContainer
let AttrSearchContainer = 'ContainerItemMenu'
let ValAttrContainerDefault = 'Info'
let UrlContainer = window.location.href
let ValueForItemMenu = UrlContainer.split('?')[1]
if (ValueForItemMenu != undefined && ValueForItemMenu != '' && ValueForItemMenu != ' ') {
    let ItemsInMenuForURL = document.querySelector(`[${AttrSearchContainer}=${ValueForItemMenu}]`)
    if (ValueForItemMenu == 'Home') {
        GoToUrl('/')
    }
    if (ItemsInMenuForURL != null) {
        FuncSetActiveContainer(ItemsInMenuForURL)
    }
} else {
    ItemsInMenuForURL = document.querySelector(`[${AttrSearchContainer}=${ValAttrContainerDefault}]`)
    FuncSetActiveContainer(ItemsInMenuForURL)
}*/


let AllCheckInputVal = document.querySelectorAll('[CheckInputVal]')
for (let i of AllCheckInputVal) {
    let Bigger = i.getAttribute('Bigger')
    let Less = i.getAttribute('Less')
    let TypeVal = i.getAttribute('TypeVal') || 'Text'
    let SetIn = i.getAttribute('SetIn') || 'Input'
    if (TypeVal == 'File') {
        ValidationFile(i, SetIn)
    } else {
        CheckInputValidations(i, Bigger, Less, SetIn, TypeVal)
    }
}


function ValidationEmail(Email) {
    const Re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return Re.test(String(Email).toLowerCase());
}

function ValidationIsNumber(Text) {
    Text.match(/\D/g)
    let State = false
    if (Text.match(/\D/g) == null && Number.isInteger(parseInt(Text))) {
        State = true
    } else {
        State = false
    }
    return State
}


function ValidationFile(Input, SetIn = 'Input') {
    let State = false
    let Value = Input.value
    let StateInputFile = Input.getAttribute('State')
    if (StateInputFile == 'MostGet') {
        if (Value != '' && Value != ' ' && !IsBlank(Value)) {
            State = true
        } else {
            State = false
        }
    }


    if (State == true || StateInputFile != 'MostGet') {
        if (SetIn == 'Input') {
            Input.classList.add('InputValid')
        } else if (SetIn == 'Icon') {
            let Icon = Input.parentNode.querySelector('i')
            Icon.className = 'far fa-check-circle'
        } else if (SetIn == 'Container') {
            Input.parentNode.classList.add('InputValid')
        }
        State = true
    } else {
        if (SetIn == 'Input') {
            Input.classList.remove('InputValid')
        } else if (SetIn == 'Icon') {
            let Icon = Input.parentNode.querySelector('i')
            Icon.className = 'far fa-times-circle'
        } else if (SetIn == 'Container') {
            Input.parentNode.classList.remove('InputValid')
        }
        State = false
    }
    Input.setAttribute('Valid', State)
    return State
}

function ValidationAlphabet(e) {
    let Code = ('charCode' in e) ? e.charCode : e.keyCode;
    let State = false
    if (!(Code == 32) && // space
        !(Code > 47 && Code < 58) &&
        !(Code > 64 && Code < 91) &&
        !(Code > 96 && Code < 123)) {
        State = false
        e.preventDefault();
    } else {
        State = true
    }
    return State
}

function ValidationInput(Element, Input, Bigger, Less) {

    let Value = Input.value
    let IconState = Element.querySelector('i')
    if (Value != '' && Value != ' ' && Value != null && Value.trim() != '' && CheckInputValidations(Input, parseInt(Bigger), parseInt(Less), 'None')) {
        IconState.className = 'fal fa-check-circle'
        Input.setAttribute('Valid', 'true')
    } else {
        IconState.className = 'fal fa-times-circle'
        Input.setAttribute('Valid', 'false')
    }

}

function ImageExists(ImageUrl) {
    let Ht = new XMLHttpRequest();
    Ht.open('HEAD', ImageUrl, false);
    Ht.send();
    return Ht.status != 404 ? true : false
}

function ValidationOnlyAlephbaAndNumber(e) {
    let State = false
    var code = ('charCode' in e) ? e.charCode : e.keyCode;
    if (!(code == 32) && // space
        !(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
        State = true
        e.preventDefault();
    } else {
        State = false
    }
    return State
}


function ValidationAllCharIsEnglish(Input) {
    let State = false
    let EnglishRegex = /^[A-Za-z0-9]*$/;
    if (EnglishRegex.test(Input.value)) {
        State = true
        Input.setAttribute('Valid', 'true')
        Input.classList.add('InputValid')
    } else {
        State = false
        Input.setAttribute('Valid', 'false')
        Input.classList.remove('InputValid')
    }
    return State
}

// ----------------------------------   Animation Scroll   ---------------------------
let AllElementsWithAnimation = document.querySelectorAll('[AnimationScroll]')
let AllElementsWithAnimation_2 = document.querySelectorAll('[AnimationScroll_2]')
let ScrollOnElementVar = (entries, Observer) => {
    entries.forEach(Entry => {
        let ClassAnimation = Entry.target.getAttribute('AnimationScroll')
        let ClassAnimation_2 = Entry.target.getAttribute('AnimationScroll_2')
        if (Entry.isIntersecting) {
            Entry.target.classList.add(ClassAnimation)
            if (ClassAnimation_2 != null) {
                Entry.target.classList.add(ClassAnimation_2)
            }
        } else {
            Entry.target.classList.remove(ClassAnimation)
            if (ClassAnimation_2 != null) {
                Entry.target.classList.remove(ClassAnimation_2)
            }
        }
    })
}


let Observer = new IntersectionObserver(ScrollOnElementVar, {
    threshold: [0.02]
});
AllElementsWithAnimation.forEach(Element => {
    if (Element) {
        Observer.observe(Element)
    }
})

// ------------------------------  Form & Item Form  -------------------------------

function EffectOnItemFormInput(Element) {
    Element.classList.add('ItemFormInputFocus')
}

function ClearEffectOnItemFormInput(Element) {
    Element.classList.remove('ItemFormInputFocus')
}

let AllInputFormBaseJS = document.querySelectorAll('[InputForm]')
for (let I of AllInputFormBaseJS) {
    I.addEventListener('focus', function (e) {
        EffectOnItemFormInput(e.currentTarget.parentNode)
    })
    I.addEventListener('focusout', function (e) {
        ClearEffectOnItemFormInput(e.currentTarget.parentNode)
    })
}


function SignOutAccountMenu() {
    setTimeout(function () {
        CloseMenuContainer(document.getElementById('ContainerMenuHamburger'))
    })
    SignOutAccount()
}


let AllInputForm = document.querySelectorAll('[InputForm]')
for (let Input of AllInputForm) {
    let TypeInput = Input.type
    if (TypeInput != 'file') {
        Input.addEventListener('input', function (e) {
            let Input = e.currentTarget
            let Bigger = Input.getAttribute('Bigger')
            let Less = Input.getAttribute('Less')
            let TypeVal = Input.getAttribute('TypeVal') || 'Text'
            let SetIn = Input.getAttribute('SetIn') || 'Icon'
            CheckInputValidations(Input, Bigger, Less, SetIn, TypeVal)
        })
    } else {
        Input.addEventListener('change', function (e) {
            let Input = e.currentTarget
            let SetIn = Input.getAttribute('SetIn') || 'Icon'
            ValidationFile(Input, SetIn)
            let IdImageTag = Input.getAttribute('IdImageTag')
            let ImageTag = document.querySelector(`#${IdImageTag}`)
            let State = Input.getAttribute('Valid') || 'false'
            if (ImageTag != null) {
                Input.parentNode.querySelector('[name="StateImage"]').value = 'MostGet'
                Input.setAttribute('State', 'MostGet')
                if (State == 'true') {
                    const [Image] = Input.files
                    if (Image) {
                        ImageTag.src = URL.createObjectURL(Image)
                    }
                } else {
                    ImageTag.src = '__None__'
                }
            }
        })
    }
}


let TagsWithTimer = document.querySelectorAll('[TimerCounterDown]')
for (let T of TagsWithTimer) {
    let ToDate = T.getAttribute('ToDateTimer')
    TimerCountDown(T, ToDate)
}

function TimerCountDown(Element, ToDate) {
    let countDownDate = new Date(ToDate);
    let x = setInterval(function () {
        let now = new Date().getTime();
        let distance = countDownDate - now;
        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        let Res = `${days}:${hours}:${minutes}`;
        Element.innerHTML = Res
        if (distance < 0) {
            clearInterval(x);
            Element.innerHTML = "EXPIRED";
        }
    }, 1000);
}
