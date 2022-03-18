SplitPrice()
GetCookieFunctionality_ShowNotification()


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
                    scaleLabel: {
                        display: false,
                        labelString: Unit,
                        fontSize: 10
                    },
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

function SetValidationOnBtnSubmitandEditAnswerComment() {
    let AllContainerAnswerTextComments = document.querySelectorAll('[ContainerAnswerText]')
    for (let TextArea of AllContainerAnswerTextComments) {
        TextArea.oninput = function (e) {
            let Element = e.currentTarget
            let Bigger = Element.getAttribute('Bigger')
            let Less = Element.getAttribute('Less')
            let Valid = CheckInputValidations(Element, Bigger, Less, 'None')
            let ContainerAnswer = Element.parentNode.parentNode
            let BtnSubmit = ContainerAnswer.querySelector('[BtnSubmitAnswerComment]')
            let IdComment = ContainerAnswer.getAttribute('IdComment')
            if (Valid) {
                BtnSubmit.classList.remove('Disabled')
                BtnSubmit.setAttribute('onclick', `SubmitAnswerComment('${Element.value}', '${IdComment}')`)
            } else {
                BtnSubmit.classList.add('Disabled')
                BtnSubmit.removeAttribute('onclick')
            }
        }
    }
}

SetValidationOnBtnSubmitandEditAnswerComment()

function SubmitAnswerComment(Text, IdComment) {
    let Data = {
        'Text': Text
    }
    let IdCourse = document.querySelector('#InfoCourse').getAttribute('IdCourse')
    SendAjax(`/c/${IdCourse}/${IdComment}/SubmitCommentAnswer`, Data, 'POST', function (response) {
        let Status = response.Status
        if (Status == '200') {
            let Object = response.Object
            let Element = document.createElement('div')
            Element.className = 'Comment'
            Element.setAttribute('ContainerCommentID', Object.id)
            let Node = `
                    <div class="InfoComment">
                        <p title="${Object.Student_GetNameAndFamily}">${Object.Student_GetNameAndFamily}</p>
                        <div>
                            <i class="fa fa-check-circle text-success"></i>
                            <p class="text-muted Small">${Object.TimePastSubmit}</p>
                            <div class="ItemsComment">
                                <i class="far fa-trash" Trash
                                   onclick="DeleteComment(this.parentNode.parentNode.parentNode.parentNode,'${Object.id}')"></i>
                            </div>
                        </div>
                    </div>
                    <p class="TextComment">
                        ${Object.Text}
                    </p>
                        <div class="text-right rtl">
                            <div class="ContainerAnsweredComment">
                                <div class="ItemsAnswerComment">
                                    <span class="TimePastSubmitAnswerComment">
                                        ${Object.TimePastSubmitAnswer}
                                    </span>
                                    <div>
                                        <i class="far fa-pen" Edit data-toggle="collapse"
                                           data-target="#Comment_${Object.id}"></i>
                                        <i class="far fa-trash" Trash
                                           onclick="DeleteAnswerComment('${Object.id}')"></i>
                                    </div>
                                </div>
                                <p class="TextAnswerComment">
                                    ${Object.TextAnswer}
                                </p>
                            </div>
                            <div class="ContainerAnswerComment collapse" id="Comment_${Object.id}"
                                 IdComment="${Object.id}">
                                <div class="d-flex justify-content-between">
                                    <p class="Label bold">Edit your Answer</p>
                                    <textarea ContainerAnswerText Bigger="1"
                                              Less="5000">${Object.TextAnswer}</textarea>
                                </div>
                                <button class="Disabled" BtnSubmitAnswerComment TypeSubmit="Edit">Edit</button>
                            </div>
                        </div>
                            `
            Element.innerHTML = Node
            let Container = document.querySelector(`[ContainerCommentID='${IdComment}']`)
            Container.replaceWith(Element)
            ShowNotificationMessage('Reply sent successfully', 'Success')
            SetValidationOnBtnSubmitandEditAnswerComment()

        } else if (Status == '203') {
            ShowNotificationMessage('Please fill Answer field ', 'Error')
        } else {
            ShowNotificationMessage('Some went wrong Please Try again ', 'Error')
        }
    })
}

function DeleteAnswerComment(IdComment) {
    CreateMessage_Alert('Are you Sure You want to Delete Answer comment ?', function () {
        let IdCourse = document.querySelector('#InfoCourse').getAttribute('IdCourse')
        SendAjax(`/c/${IdCourse}/${IdComment}/DeleteAnswerComment`, {}, 'POST', function (response) {
            let Status = response.Status
            if (Status == '200') {
                let Object = response.Object
                let Element = document.createElement('div')
                Element.className = 'Comment'
                Element.setAttribute('ContainerCommentID', Object.id)
                let Node = `
                     <div class="InfoComment">
                        <p title="${Object.Student_GetNameAndFamily}">${Object.Student_GetNameAndFamily}</p>
                        <div>
                            <p class="text-muted Small">${Object.TimePastSubmit}</p>
                            <div class="ItemsComment">
                                <i class="far fa-trash" Trash
                                   onclick="DeleteComment(this.parentNode.parentNode.parentNode.parentNode,'${Object.id}')"></i>
                            </div>
                        </div>
                    </div>
                    <p class="TextComment">
                        ${Object.Text}
                    </p>
                        <div data-toggle="collapse" class="CollapseBtn" data-target="#Comment_${Object.id}">
                            <p>Replay</p>
                            <i class="far fa-reply"></i>
                        </div>
                        <div class="text-right rtl">
                            <div class="collapse ContainerAnswerComment" id="Comment_${Object.id}"
                                 IdComment="${Object.id}">
                                <div class="d-flex justify-content-between">
                                    <p class="Label d-block bold">Your Answer</p>
                                    <textarea ContainerAnswerText Bigger="1" Less="5000"></textarea>
                                </div>
                                <button class="Disabled" BtnSubmitAnswerComment TypeSubmit="Submit">Submit</button>
                            </div>
                        </div>
                        `
                Element.innerHTML = Node
                let Container = document.querySelector(`[ContainerCommentID='${IdComment}']`)
                Container.replaceWith(Element)
                ShowNotificationMessage('Answer Comment was Successfully Deleted', 'Success')
                SetValidationOnBtnSubmitandEditAnswerComment()
            } else if (Status == '404') {
                ShowNotificationMessage('Some went Wrong Please Try again', 'Error')
            }
        })
    })
}

function DeleteComment(Element, IdComment) {
    CreateMessage_Alert('Are you Sure You want to Delete comment ?', function () {
        let IdCourse = document.querySelector('#InfoCourse').getAttribute('IdCourse')
        SendAjax(`/c/${IdCourse}/${IdComment}/DeleteComment`, {}, 'POST', function (response) {
            let Status = response.Status
            if (Status == '200') {
                ShowNotificationMessage('Comment was Successfully Deleted', 'Success')
                Element.classList.add('d-none')
            } else if (Status == '404') {
                ShowNotificationMessage('Some went Wrong Please Try again', 'Error')
            }
        })
    })
}


let BtnsSwitchComments = document.querySelectorAll('[BtnSwitchComments]')
for (let Btn of BtnsSwitchComments) {
    Btn.onclick = function (e) {
        SwitchContainerComments(e.currentTarget.getAttribute('BtnSwitchComments'))
    }
}

function SwitchContainerComments(Type) {
    let ContainerNewComments = document.querySelector('[NewComments]')
    let ContainerAllComments = document.querySelector('[AllComments]')
    let BtnSwitchNewComment = document.querySelector('[BtnSwitchComments=NewComments]')
    let BtnSwitchAllComments = document.querySelector('[BtnSwitchComments=AllComments]')
    if (Type == 'NewComments') {
        BtnSwitchNewComment.classList.add('BtnSwitchActive')
        BtnSwitchAllComments.classList.remove('BtnSwitchActive')
        ContainerAllComments.classList.add('d-none')
        ContainerNewComments.classList.remove('d-none')
    } else if (Type == 'AllComments') {
        BtnSwitchNewComment.classList.remove('BtnSwitchActive')
        BtnSwitchAllComments.classList.add('BtnSwitchActive')
        ContainerAllComments.classList.remove('d-none')
        ContainerNewComments.classList.add('d-none')
    }
}


function AddDiscountCourse() {
    let Container = CreateContainerBlur('Default', null, null, 'Small')
    ClickOutSideContainer(Container, function () {
        DeleteContainerBlur()
    })

    let InfoCourse = document.querySelector('#InfoCourse')
    let IdCourse = InfoCourse.getAttribute('IdCourse')
    let PriceCourse = InfoCourse.getAttribute('Price')
    let Node = `<div class="ContainerFormAddDiscount">
                <div class="ContainerTitle">
                    <p>Add Discount</p>
                </div>
                <div class="ItemForm">
                    <p class="LabelInput">
                        Title (Optional) :
                    </p>
                    <div class="ItemFormInput InputValid">
                        <input type="text" min="0" max="99" TypeVal="Text" Valid="true"  InputTitleDiscount>
                    </div>
                </div>
                <div class="ItemForm">
                    <p class="LabelInput">
                        Percent :
                    </p>
                    <div class="ItemFormInput">
                        <input type="number" min="0" max="99" TypeVal="Number"  value="0" TypeInp="Percent"  InputForm Bigger="0" Less="3" SetIn="Container" InputFormAddDiscount InputPercentDiscount>
                    </div>
                </div>
                <div class="ItemForm">
                    <p class="LabelInput">
                        Time (hour):
                    </p>
                    <div class="ItemFormInput">
                        <input type="number" InputForm Bigger="0" Less="10" TypeVal="Number" value="0" SetIn="Container" InputFormAddDiscount InputTimeDiscount>
                    </div>
                </div>
                <div class="ContainerPriceAddDiscount">
                  <p class="Label">Price Course</p>
                  <p class="PriceWithDiscount" PriceSet>$ ${PriceCourse}</p>
                  <p class="PriceWithoutDiscount" >$ ${PriceCourse}</p>
                  <div class="float-right badge badge-info" PercentSet>0%</div>
                </div>
                <div class="ContainerButtonForm">
                    <button onclick="document.body.click()" class="BtnStyleNone">Close</button>
                    <button class="BtnStyle_5 Disabled" id="BtnAddDiscount">Add</button>
                </div>
            </div>
            `
    Container.innerHTML = Node
    let InputFormAddDiscount = document.querySelectorAll('[InputFormAddDiscount]')
    let PriceSet = document.querySelector('[PriceSet]')
    let PercentSet = document.querySelector('[PercentSet]')
    let BtnAddDiscount = document.querySelector('#BtnAddDiscount')
    for (let Input of InputFormAddDiscount) {
        Input.addEventListener('input', function () {
            let TypeInp = Input.getAttribute('TypeInp')
            if (TypeInp == 'Percent') {
                PriceCourse = parseInt(PriceCourse)
                let ValuePercent = Input.value
                PercentSet.innerHTML = ValuePercent + '%'
                PriceSet.innerHTML = `$ ${(PriceCourse - (PriceCourse / 100 * ValuePercent)).toFixed(2)}`
            }
            let Bigger = Input.getAttribute('Bigger')
            let Less = Input.getAttribute('Less')
            CheckInputValidations(Input, Bigger, Less, 'Container', 'Number')
            CheckValidInputsAddDiscount()
        })
    }

    function CheckValidInputsAddDiscount() {
        BtnAddDiscount.addEventListener('click', SubmitDiscount)
        BtnAddDiscount.classList.remove('Disabled')
        for (let Input of InputFormAddDiscount) {
            if (Input.value == 0) {
                Input.setAttribute('Valid', 'false')
                Input.parentNode.classList.remove('InputValid')
            }
            let Valid = Input.getAttribute('Valid') || 'false'
            if (Valid == 'false') {
                BtnAddDiscount.removeEventListener('click', SubmitDiscount)
                BtnAddDiscount.classList.add('Disabled')
            }
        }
    }

    function SubmitDiscount() {
        let Title = document.querySelector('[InputTitleDiscount]').value
        let Percent = document.querySelector('[InputPercentDiscount]').value
        let Time = document.querySelector('[InputTimeDiscount]').value
        let Data = {
            'Title': Title,
            'Percent': Percent,
            'Time': Time
        }
        SendAjax(`/t/Panel/${IdCourse}/AddDiscount`, Data, 'POST', function (response) {
            let Status = response.Status
            DeleteContainerBlur()
            if (Status == '200') {
                SetCookieFunctionality_ShowNotification('Discount was Successfully Applied', 'Success', 6000, 2)
                location.reload()
            } else if (Status == '203') {
                ShowNotificationMessage('Please Enter The Values Correctly', 'Error')
            } else if (Status == '208') {
                ShowNotificationMessage('The Discount has Already been Applied', 'Warning')
            } else if (Status == '404') {
                ShowNotificationMessage('Can not Add Discount Please Try Again in a few Minute', 'Error')
            }
        })
    }

}


function DeleteDiscount() {
    CreateMessage_Alert('Are You Sure You Want Remove Discount Course ?', function () {
        let IdCourse = document.querySelector('#InfoCourse').getAttribute('IdCourse')
        SendAjax(`/t/Panel/${IdCourse}/DeleteDiscount`, {}, 'POST', function (response) {
            let Status = response.Status
            if (Status == '200') {
                SetCookieFunctionality_ShowNotification('Discount Successfully Removed', 'Success', 6000, 2)
                location.reload()
            } else if (Status == '404') {
                ShowNotificationMessage('Can not Remove Discount Please Try Again in a few Minute', 'Error')
            }
        })
    })
}


function ChangeInfoCourse() {
    let Container = document.querySelector('#ContainerEditCourse')
    ClickOutSideContainer(Container, function () {
        ClearEffectOnBody()
        Container.classList.add('d-none')
    })
    Container.classList.remove('d-none')
    document.body.classList.add('BlurAllElementsExceptContainerBlur')
    ScrollOnElement(null, Container)
}


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


function AddVideoCourse(SectionID, AddVideoInSecText) {
    let Container = CreateContainerBlur('Default', null, null, 'Small')

    ClickOutSideContainer(Container, function () {
        DeleteContainerBlur()
    })
    let Node = `

                       <div class="ContainerFormAddVideo" id="ContainerFormAddVideo">
                            <div class="ContainerTitle">
                                <p>Add Video</p>
                            </div>
                            <div class="TextAddVideoInSection">
                               Add Video in : <strong> ${AddVideoInSecText}</strong>
                            </div>
                            <div class="ItemForm">
                                <p class="LabelInput">Video :</p>
                                <div class="ItemFormInput">
                                    <input type="file" name='Video' id="AddVideoInputFile" accept="video/mp4,video/x-m4v,video/*"  State="MostGet" InputForm
                                           InputAddVideo>
                                </div>
                            </div>
                            <div class="ContainerButtonForm">
                                <button class="BtnStyleNone" onclick="document.body.click()">Close</button>
                                <button class="BtnStyle_5 Disabled" id="BtnAddVideo">Add</button>
                            </div>
                        </div>

                         <div class="ContainerUploadingVideoMessage d-none col-sm-12">
                                <div>
                                    <p class="TextPleaseWait">Please wait</p>
                                    <div>
                                        <p class="TextUploading">Uploading
                                        <i class="far fa-spinner fa-spin"></i>
                                    </div>
                                </div>
                                <img src="/static/image/ImageDefault/GifUploadingVideo.gif" class="col-sm-12" alt="Gif Video">
                          </div>


            `
    Container.innerHTML = Node
    let InputAddVideo = document.querySelector('#AddVideoInputFile')
    let BtnAddVideo = document.querySelector('#BtnAddVideo')
    InputAddVideo.addEventListener('change', function (e) {
        GetDurationVideo(this)
        setTimeout(function () {
            let State = ValidationFile(InputAddVideo, 'Container')
            if (State) {
                BtnAddVideo.classList.remove('Disabled')
                BtnAddVideo.addEventListener('click', UploadVideoAdded)
            } else {
                BtnAddVideo.classList.add('Disabled')
                BtnAddVideo.removeAttribute('click', UploadVideoAdded)
            }
        })
    })

    function UploadVideoAdded() {
        let IdCourse = document.querySelector('#InfoCourse').getAttribute('IdCourse')
        let InputDurationVideo = document.createElement('input')
        InputDurationVideo.type = 'text'
        InputDurationVideo.name = 'Duration'
        InputDurationVideo.value = InputAddVideo.getAttribute('Duration') || '0'
        let Form = document.createElement('form')
        Form.appendChild(InputAddVideo)
        Form.appendChild(InputDurationVideo)
        let ContainerFormAddVideo = document.querySelector('#ContainerFormAddVideo')
        let AllContainerUploadingVideoMessage = document.querySelectorAll('.ContainerUploadingVideoMessage')
        for (let i of AllContainerUploadingVideoMessage) {
            i.classList.remove('d-none')
        }
        ContainerFormAddVideo.classList.add('d-none')
        $.ajax({
            type: 'POST',
            url: `/t/Panel/Course/${IdCourse}/${SectionID}/AddVideo`,
            enctype: 'multipart/form-data',
            processData: false,
            dataType: 'json',
            contentType: false,
            data: new FormData(Form),
            success: function (response) {
                for (let i of AllContainerUploadingVideoMessage) {
                    i.classList.add('d-none')
                }
                if (response.Status == '200') {
                    SetCookieFunctionality_ShowNotification('Video Uploaded Successfully', 'Success', 6000, 2)
                    location.reload()
                } else {
                    SetCookieFunctionality_ShowNotification('Cannot Upload video Please Try again', 'Error', 6000, 2)
                }
            },
            failed: function (response) {
                ShowNotificationMessage('Can not Add Video Please Try again in a few Minutes', 'Error')
                DeleteContainerBlur()
            }
        })

    }
}


function DeleteCourse() {
    CreateMessage_Alert('Do You Want to Delete Course ?', function () {
        CreateMessage_Alert('Are You Sure You Want to Delete The Course ?', function () {
            ClickOutSideContainer(this, function () {
                CloseMessage_Alert()
            })
            let IdCourse = document.querySelector('#InfoCourse').getAttribute('IdCourse')
            SendAjax(`/t/Panel/${IdCourse}/DeleteCourse`, {}, 'POST', function (response) {
                if (response.Status == '200') {
                    SetCookieFunctionality_ShowNotification('Course was Successfully Deleted', 'Success')
                    location.href = '/t/Panel'
                }
                if (response.Status == '404') {
                    ShowNotificationMessage('Can not Delete Course Please Try Again in a few Minute', 'Error')
                }
            })
        })
    })
}


let AllIconEditVideoCourse = document.querySelectorAll('.ItemVideo [Edit]')
for (let BtnEdit of AllIconEditVideoCourse) {
    BtnEdit.addEventListener('click', function () {
        let VideoID = BtnEdit.parentNode.getAttribute('VideoID')
        let SectionID = BtnEdit.parentNode.getAttribute('SectionID')
        let TextChangeVideo = BtnEdit.getAttribute('TextChangeVideo')
        let LinkVideoPast = BtnEdit.getAttribute('LinkVideoPast')
        if (VideoID != null && SectionID != null && TextChangeVideo != null) {
            ChangeVideoCourseContainer(VideoID, SectionID, TextChangeVideo, LinkVideoPast)
        } else {
            ShowNotificationMessage('Problem in Changing Video', 'Error')
        }
    })
}

function ChangeVideoCourseContainer(VideoID, SectionID, TextChangeVideo, LinkVideoPast) {

    let Container = CreateContainerBlur('Default', null, null, 'Small')
    ClickOutSideContainer(Container, function () {
        DeleteContainerBlur()
    })

    let Node = `
                     <div class="ContainerFormAddVideo" id="ContainerFormAddVideo">
                                    <div class="ContainerTitle">
                                        <p>Change Video</p>
                                    </div>
                                    <div class="TextAddVideoInSection">
                                    ${LinkVideoPast != null ? `<strong><a href="${LinkVideoPast}" target="_blank">Video now</a></strong>` : ''}
                                       <br>
                                       <p>${TextChangeVideo}</p>
                                    </div>
                                    <div class="ItemForm">
                                        <p class="LabelInput">New Video :</p>
                                        <div class="ItemFormInput">
                                            <input type="file" name='Video' id="AddVideoInputFile" accept="video/mp4,video/x-m4v,video/*"  State="MostGet" InputForm
                                                   InputAddVideo>
                                        </div>
                                    </div>
                                    <div class="ContainerButtonForm">
                                        <button class="BtnStyleNone" onclick="document.body.click()">Close</button>
                                        <button class="BtnStyle_5 Disabled" id="BtnAddVideo">Add</button>
                                    </div>
                                </div>

                                 <div class="ContainerUploadingVideoMessage d-none col-sm-12">
                                        <div>
                                            <p class="TextPleaseWait">Please wait</p>
                                            <div>
                                                <p class="TextUploading">Uploading
                                                <i class="far fa-spinner fa-spin"></i>
                                            </div>
                                        </div>
                                        <img src="/static/image/ImageDefault/GifUploadingVideo.gif" class="col-sm-12" alt="Gif Video">
                     </div>
                    `
    Container.innerHTML = Node
    let InputAddVideo = document.querySelector('#AddVideoInputFile')
    let BtnAddVideo = document.querySelector('#BtnAddVideo')
    InputAddVideo.addEventListener('change', function (e) {
        GetDurationVideo(this)
        setTimeout(function () {
            let State = ValidationFile(InputAddVideo, 'Container')
            if (State) {
                BtnAddVideo.classList.remove('Disabled')
                BtnAddVideo.addEventListener('click', UploadVideoAdded)
            } else {
                BtnAddVideo.classList.add('Disabled')
                BtnAddVideo.removeAttribute('click', UploadVideoAdded)
            }
        })
    })

    function UploadVideoAdded() {
        let IdCourse = document.querySelector('#InfoCourse').getAttribute('IdCourse')
        let InputDurationVideo = document.createElement('input')
        InputDurationVideo.type = 'text'
        InputDurationVideo.name = 'Duration'
        InputDurationVideo.value = InputAddVideo.getAttribute('Duration') || '0'
        let Form = document.createElement('form')
        Form.appendChild(InputAddVideo)
        Form.appendChild(InputDurationVideo)
        let ContainerFormAddVideo = document.querySelector('#ContainerFormAddVideo')
        let AllContainerUploadingVideoMessage = document.querySelectorAll('.ContainerUploadingVideoMessage')
        for (let i of AllContainerUploadingVideoMessage) {
            i.classList.remove('d-none')
        }
        ContainerFormAddVideo.classList.add('d-none')
        $.ajax({
            type: 'POST',
            url: `/t/Panel/Course/${IdCourse}/${SectionID}/${VideoID}/ChangeVideo`,
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            data: new FormData(Form),
            success: function (response) {
                for (let i of AllContainerUploadingVideoMessage) {
                    i.classList.add('d-none')
                }
                if (response.Status == '200') {
                    SetCookieFunctionality_ShowNotification('Video uploaded successfully', 'Success', 6000, 2)
                    location.reload()
                } else {
                    SetCookieFunctionality_ShowNotification('Cannot Upload video Please Try again', 'Error', 6000, 2)
                }
            },
            failed: function (response) {
                ShowNotificationMessage('Can not Add Video Please Try again in a few Minutes', 'Error')
                document.body.click() // Close Container Blur
            }
        })

    }
}

function GetDurationVideo(Input) {
    let Duration = 0
    try {
        let Vid = document.createElement('video');
        let U = URL.createObjectURL(Input.files[0]);
        Vid.src = U;
        Vid.ondurationchange = function () {
            Duration = Vid.duration
            Input.setAttribute('Duration', Duration)
        };
    } catch (e) {
        Duration = 0
        Input.setAttribute('Duration', Duration)
    }
}

let AllBtnDeleteVideo = document.querySelectorAll('.ItemVideo [Trash]')
for (let BtnDelete of AllBtnDeleteVideo) {
    BtnDelete.addEventListener('click', function () {
        CreateMessage_Alert('Are You Sure you Want Delete Video ? ', function () {
            let CourseID = document.querySelector('#InfoCourse').getAttribute('IdCourse')
            let SectionID = BtnDelete.parentNode.getAttribute('SectionID')
            let VideoID = BtnDelete.parentNode.getAttribute('VideoID')
            SendAjax(`/t/Panel/Course/${CourseID}/${SectionID}/${VideoID}/DeleteVideo`, {}, 'POST', function (response) {
                if (response.Status == '200') {
                    SetCookieFunctionality_ShowNotification('Your Video has been Successfully Deleted', 'Success', 6000, 2)
                    location.reload()
                }
            })
        })
    })
}


function CreateSectionCourse() {
    let Container = CreateContainerBlur('Default', null, null, 'Small')
    ClickOutSideContainer(Container, function () {
        DeleteContainerBlur()
    })

    let IdCourse = document.querySelector('#InfoCourse').getAttribute('IdCourse')
    let Node = `
              <div class="ContainerFormCreateSectionCourse">
                    <div class="ContainerTitle">
                        <p>Create Section Course</p>
                    </div>
                    <form action="/t/Panel/Course/${IdCourse}/CreateSectionCourse" method="post" content="UTF-8" id="FormCreateSectionCourse">
                        <div class="ItemForm">
                            <p class="LabelInput">Title Section :</p>
                            <div class="ItemFormInput">
                                <input type="text" name="Title" InputForm Bigger="0" Less="150" SetIn="Container" InputTitleSectionCourse>
                            </div>
                        </div>
                        <div class="ContainerButtonForm">
                            <button class="BtnStyleNone" type="button" onclick="document.body.click()">Close</button>
                            <button class="BtnStyle_5 Disabled" id="BtnCreateSectionCourse" type="button">Create</button>
                        </div>
                    </form>
                </div>
            `
    Container.innerHTML = Node

    let FormCreateSectionCourse = document.querySelector('#FormCreateSectionCourse')
    FormCreateSectionCourse.onsubmit = function () {
        location.reload()
    }

    let InputTitle = document.querySelector('[InputTitleSectionCourse]')
    InputTitle.addEventListener('input', CheckStateInputTitleSectionCourse)

    function CheckStateInputTitleSectionCourse() {
        let Bigger = InputTitle.getAttribute('Bigger')
        let Less = InputTitle.getAttribute('Less')
        let SetIn = InputTitle.getAttribute('SetIn')
        CheckInputValidations(InputTitle, Bigger, Less, SetIn)
        let BtnCreate = document.querySelector('#BtnCreateSectionCourse')
        let Valid = InputTitle.getAttribute('Valid') || 'false'
        if (Valid == 'true') {
            BtnCreate.type = 'submit'
            BtnCreate.classList.remove('Disabled')
        } else {
            BtnCreate.type = 'button'
            BtnCreate.classList.add('Disabled')
        }
    }
}

let AllBtnChangeSection = document.querySelectorAll('.SectionCourseItem [Edit]')
for (let BtnEdit of AllBtnChangeSection) {
    BtnEdit.addEventListener('click', function () {
        let Container = CreateContainerBlur('Default', null, null, 'Small')
        ClickOutSideContainer(Container, function () {
            DeleteContainerBlur()
        })
        let PastTitle = BtnEdit.parentNode.parentNode.parentNode.getAttribute('TitlePast')
        let SectionID = BtnEdit.parentNode.parentNode.parentNode.getAttribute('SectionID')
        let IdCourse = document.querySelector('#InfoCourse').getAttribute('IdCourse')
        let Node = `
                    <div class="ContainerFormCreateSectionCourse">
                        <div class="ContainerTitle">
                            <p>Change Title Section Course</p>
                        </div>
                        <form action="/t/Panel/Course/${IdCourse}/${SectionID}/ChangeSection" method="post" content="UTF-8" id="FormCreateSectionCourse">
                            <div class="ItemForm">
                                <p class="LabelInput small">Title now : ${PastTitle}</p>
                                <p class="LabelInput">New Title Section :</p>
                                <div class="ItemFormInput">
                                    <input type="text" name="Title" InputForm Bigger="0" Less="150" SetIn="Container" InputTitleSectionCourse>
                                </div>
                            </div>
                            <div class="ContainerButtonForm">
                                <button class="BtnStyleNone" type="button" onclick="document.body.click()">Close</button>
                                <button class="BtnStyle_5 Disabled" id="BtnCreateSectionCourse" type="button">Change</button>
                            </div>
                        </form>
                    </div>
                `
        Container.innerHTML = Node
        let FormCreateSectionCourse = document.querySelector('#FormCreateSectionCourse')
        FormCreateSectionCourse.onsubmit = function () {
            location.reload()
        }

        let InputTitle = document.querySelector('[InputTitleSectionCourse]')
        InputTitle.addEventListener('input', CheckStateInputTitleSectionCourse)

        function CheckStateInputTitleSectionCourse() {
            let Bigger = InputTitle.getAttribute('Bigger')
            let Less = InputTitle.getAttribute('Less')
            let SetIn = InputTitle.getAttribute('SetIn')
            CheckInputValidations(InputTitle, Bigger, Less, SetIn)
            let BtnCreate = document.querySelector('#BtnCreateSectionCourse')
            let Valid = InputTitle.getAttribute('Valid') || 'false'
            if (Valid == 'true') {
                BtnCreate.type = 'submit'
                BtnCreate.classList.remove('Disabled')
            } else {
                BtnCreate.type = 'button'
                BtnCreate.classList.add('Disabled')
            }
        }

    })
}

let AllBtnDeleteSection = document.querySelectorAll('.SectionCourseItem [Trash]')
for (let BtnDelete of AllBtnDeleteSection) {
    BtnDelete.addEventListener('click', function () {
        CreateMessage_Alert('Are You Sure you Want to Delete your Section ?', function () {
            let SectionID = BtnDelete.parentNode.parentNode.parentNode.getAttribute('SectionID')
            let IdCourse = document.querySelector('#InfoCourse').getAttribute('IdCourse')
            SendAjax(`/t/Panel/Course/${IdCourse}/${SectionID}/DeleteSection`, {}, 'POST', function (response) {
                let Status = response.Status
                if (Status == '200') {
                    SetCookieFunctionality_ShowNotification('Section was Successfully Deleted', 'Success', 6000, 2)
                    location.reload()
                } else if (Status == '404') {
                    ShowNotificationMessage('Difficulty Finding Sections', 'Error')
                } else {
                    location.href = '/'
                }
            })
        })
    })
}