document.querySelector("#Login").addEventListener("click", shoWLoginForm)
document.querySelector("#Register").addEventListener("click", shoWRegisterForm)

function shoWLoginForm(e) {
    e.preventDefault()
    document.getElementById("form").classList.add("login")
    document.getElementById("form").classList.remove("register")
    document.getElementById("loginForm").classList.remove("d-none")
    document.getElementById("registerForm").classList.add("d-none")
    document.getElementById("Login").classList.add("act")
    document.getElementById("Register").classList.remove("act")
}

function shoWRegisterForm(e) {
    document.getElementById("form").classList.remove("login")
    document.getElementById("form").classList.add("register")
    document.getElementById("loginForm").classList.add("d-none")
    document.getElementById("registerForm").classList.remove("d-none")
    document.getElementById("Login").classList.remove("act")
    document.getElementById("Register").classList.add("act")
}


let BtnRegister = document.querySelector('#sub-R')
BtnRegister.addEventListener('click', SubmitRegister)
let BtnLogin = document.querySelector('#sub-l')
BtnLogin.addEventListener('click', SubmitLogin)

let D_Validation = {
    'UserName': {
        'Bigger': 4,
        'Less': 100,
        'NoSpace': true,
        'Type': 'Text',
        'Lang': 'En'
    },
    'Password': {
        'Bigger': 7,
        'Less': 100,
        'NoSpace': true,
        'Type': 'Text',
        'Lang': 'En'
    },
    'Email': {
        'Bigger': 4,
        'Less': 65,
        'NoSpace': false,
        'Type': 'Email',
        'Lang': 'Any'
    }
}


function SubmitLogin() {
    let AllInputLogin = document.querySelectorAll('[InputLogin]')
    let StateLogin = true
    for (let Input of AllInputLogin) {
        let Type = Input.getAttribute('TypeInp')
        let FieldDic = D_Validation[Type]
        let Valid1 = CheckInputValidations(Input, FieldDic['Bigger'], FieldDic['Less'], 'Input', FieldDic['Type'], FieldDic['NoSpace'])
        let Valid2 = true
        if (FieldDic['Lang'] == 'En') {
            Valid2 = ValidationAllCharIsEnglish(Input)
        }
        if (Valid1 == true && Valid2 == true) {
            Input.classList.add('InputValid')
            Input.setAttribute('Valid', 'true')
        } else {
            Input.classList.remove('InputValid')
            Input.setAttribute('Valid', 'false')
        }
        let InputValid = Input.getAttribute('Valid') || 'false'
        if (InputValid == 'false') {
            StateLogin = false
        }
    }
    if (StateLogin) {
        let UserName = document.querySelector('#UserNameLogin')
        let Password = document.querySelector('#Password')
        let Data = {
            'UserName': UserName.value, 'Password': Password.value
        }
        SendAjax('/t/Login-Register/LoginCheck', Data, 'POST', function (response) {
            let Status = response.Status
            if (Status == '200') {
                ShowNotificationMessage('Welcome', 'Success')
                SetCookie('QlYSqVS', response.QlYSqVS)
                SetCookie('YPtIeRC', response.YPtIeRC)
                setTimeout(function () {
                    location.href = '/t/Panel'
                }, 1000)
            } else if (Status == '404') {
                ShowNotificationMessage('No account found', 'Error')
            } else if (Status == '204') {
                ShowNotificationMessage('Please enter the information correctly', 'Error')
            }
        })
    }
}


function SubmitRegister() {
    let AllInputFormRegister = document.querySelectorAll('[InputRegister]')
    let StateRegister = true
    for (let Input of AllInputFormRegister) {
        let Type = Input.getAttribute('TypeInp')
        let FieldDic = D_Validation[Type]
        let Valid1 = CheckInputValidations(Input, FieldDic['Bigger'], FieldDic['Less'], 'Input', FieldDic['Type'], FieldDic['NoSpace'])
        let Valid2 = true
        if (FieldDic['Lang'] == 'En') {
            Valid2 = ValidationAllCharIsEnglish(Input)
        }
        if (Valid1 == true && Valid2 == true) {
            Input.classList.add('InputValid')
            Input.setAttribute('Valid', 'true')
        } else {
            Input.classList.remove('InputValid')
            Input.setAttribute('Valid', 'false')
        }
        let InputValid = Input.getAttribute('Valid') || 'false'
        if (InputValid == 'false') {
            StateRegister = false
        }
    }
    if (StateRegister) {
        let Email = document.querySelector('#emailR')
        let UserName = document.querySelector('#Username')
        let Password = document.querySelector('#PasswordR')
        let Data = {
            'UserName': UserName.value,
            'Email': Email.value,
            'Password': Password.value,
        }
        SendAjax('/t/Login-Register/RegisterCheck', Data, 'POST', function (response) {
            let Status = response.Status
            if (Status == '200') {
                ShowNotificationMessage('Your account is Created', 'Success')
                SetCookie('QlYSqVS', response.QlYSqVS)
                SetCookie('YPtIeRC', response.YPtIeRC)
                setTimeout(function () {
                    location.href = '/t/Panel'
                }, 1000)
            } else if (Status == '409') {
                ShowNotificationMessage('This username already exists', 'Error')
            } else if (Status == '204') {
                ShowNotificationMessage('Please enter the information correctly', 'Error')
            }
        })
    }
}