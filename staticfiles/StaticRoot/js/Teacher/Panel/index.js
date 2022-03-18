SplitPrice()
GetCookieFunctionality_ShowNotification()


function ToggleMenuAside(Btn) {
    let StateMenu = Btn.getAttribute('StateMenu')
    let ContainerBase = document.querySelector('#ContainerBase')
    if (StateMenu == 'Close') {
        Btn.setAttribute('StateMenu', 'Open')
        ContainerBase.classList.add('ContainerAsideMenuIsOpen')
        Btn.classList.replace('fa-bars', 'fa-times')
    } else {
        Btn.setAttribute('StateMenu', 'Close')
        ContainerBase.classList.remove('ContainerAsideMenuIsOpen')
        Btn.classList.replace('fa-times', 'fa-bars')

    }
}

function ToggleMenuAsideClickItemMenu(StateMenu) {
    let Btn = document.querySelector('#IconHamburgerMenu')
    let ContainerBase = document.querySelector('#ContainerBase')
    if (StateMenu == 'Close') {
        Btn.setAttribute('StateMenu', 'Open')
        ContainerBase.classList.add('ContainerAsideMenuIsOpen')
        Btn.classList.replace('fa-bars', 'fa-times')
    } else {
        Btn.setAttribute('StateMenu', 'Close')
        ContainerBase.classList.remove('ContainerAsideMenuIsOpen')
        Btn.classList.replace('fa-times', 'fa-bars')
    }
}


Chart.defaults.global.defaultFontColor = "#666";
let AllChartLine = document.querySelectorAll('[ChartLine]')
for (let i of AllChartLine) {
    let Labels = eval(i.getAttribute('LabelsChart'))
    let Data = eval(i.getAttribute('DataChart'))
    let Unit = i.getAttribute('UnitChart')
    SetChartLine(i, Labels, Data, Unit)
}

function SetChartLine(Element, Labels, Data, Unit) {
    new Chart(Element, {
        type: 'line',

        data: {
            labels: Labels,
            datasets: [{
                label: '',
                data: Data,
                fill: true,
                borderColor: '#fa63a7',
                backgroundColor: 'rgb(255,255,255)',
                borderWidth: '1.5',
                tension: 0.5,
                pointStyle: 'rectRot',
            }]
        },
        options: {
            tooltips: {
                callbacks: {
                    label: (item) => `${item.yLabel} ${Unit}`,
                },
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display: true
                    },
                    ticks: {
                        display: false
                    }
                }],
                yAxes: [{
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 4,
                        fontSize: 10
                    }
                }],
            },
            legend: {
                display: false
            },
        }
    });
}


let AllBtnAsideMenu = document.querySelectorAll('[BtnAsideMenu]')
for (let Btn of AllBtnAsideMenu) {
    Btn.addEventListener('click', function (e) {
        let Icon = e.currentTarget
        ShowContainer(Icon)
        ToggleMenuAsideClickItemMenu('Open')
    })
}


function ShowContainer(Icon) {
    let AllContainer = document.querySelectorAll('[Container]')
    for (let Container of AllContainer) {
        Container.classList.add('ContainerIsHide')
    }
    let Element = document.querySelector(`[ContainerLinked=${Icon.getAttribute('ContainerLink')}]`)
    Element.classList.remove('ContainerIsHide')
}


let FuncSetActiveContainer = ShowContainer
let AttrSearchContainer = 'ContainerLink'
let ValAttrContainerDefault = 'Dashboard'
let UrlContainer = window.location.href
let ValueForItemMenu = UrlContainer.split('?')[1]
if (ValueForItemMenu != undefined && ValueForItemMenu != '' && ValueForItemMenu != ' ') {
    let ItemsInMenuForURL = document.querySelector(`[${AttrSearchContainer}=${ValueForItemMenu}]`)
    if (ValueForItemMenu == 'Home') {
        GoToUrl('/')
    }
    if (ItemsInMenuForURL != null) {
        FuncSetActiveContainer(ItemsInMenuForURL)
    } else {
        let ItemsInMenuForURL = document.querySelector(`[${AttrSearchContainer}=${ValAttrContainerDefault}]`)
        FuncSetActiveContainer(ItemsInMenuForURL)
    }
} else {
    let ItemsInMenuForURL = document.querySelector(`[${AttrSearchContainer}=${ValAttrContainerDefault}]`)
    FuncSetActiveContainer(ItemsInMenuForURL)
}


let FormInformation = document.querySelector('#FormInformation')
FormInformation.addEventListener('input', function () {
    setTimeout(function () {
        CheckingStateBtnSubmitForm('BtnSubmitInformation', 'InputFormInfo')
    })
})


function CheckingStateBtnSubmitForm(IdButton, SelectorInputs) {
    let AllInputFormInfo = document.querySelectorAll(`[${SelectorInputs}]`)
    let BtnSubmit = document.querySelector(`#${IdButton}`)
    BtnSubmit.classList.remove('Disabled')
    BtnSubmit.type = 'submit'
    for (let Input of AllInputFormInfo) {
        let Valid = Input.getAttribute('Valid') || 'false'
        if (Valid == 'false') {
            BtnSubmit.classList.add('Disabled')
            BtnSubmit.type = 'button'
        }
    }
}

let FormSubmitCourse = document.querySelector('#FormSubmitCourse')
FormSubmitCourse.addEventListener('input', function () {
    setTimeout(function () {
        CheckingStateBtnSubmitForm('ButtonFormSubmitCourse', 'InputFormSubmitCourse')
    })
})


let InputPriceFormSubmitCourse = document.querySelector('[InputPriceFormSubmitCourse]')
InputPriceFormSubmitCourse.addEventListener('input', function () {
    let ItemPriceFormSubmitCourse = document.querySelector('#PriceSubmitCourse')
    ItemPriceFormSubmitCourse.setAttribute('Number', InputPriceFormSubmitCourse.value)
    SplitPrice(ItemPriceFormSubmitCourse)
})
