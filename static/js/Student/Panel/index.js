GetCookieFunctionality_ShowNotification()
function DeleteCourseInOrder(Element, ID) {
    Element.classList.add('d-none')
    SendAjax(`/c/${ID}/DeleteCourseInOrder`, {}, 'POST', function (response) {
        let Status = response.Status
        if (Status == '404') {
            Element.classList.remove('d-none')
            ShowNotificationMessage('Can not Delete Course Please try Again in a few Minute', 'Error')
        }
    })
}


document.querySelector("#profile").addEventListener("click", showProfile)
document.querySelector("#order").addEventListener("click", showOrder)
document.querySelector("#courses").addEventListener("click", showCoursesr)

//  document.querySelector("#btnSubmit").addEventListener("click", validateUserInfo);

function showProfile(e) {
    e.preventDefault()
    document.getElementById("profileInfo").classList.remove("d-none");
    document.getElementById("orderInfo").classList.add("d-none");
    document.getElementById("courseInfo").classList.add("d-none");
    document.getElementById("profile").classList.add("active");
    document.getElementById("profile").classList.remove("text-dark");
    document.getElementById("order").classList.remove("active");
    document.getElementById("courses").classList.remove("active");
    document.getElementById("order").classList.add("text-dark");
    document.getElementById("courses").classList.add("text-dark");
}

function showOrder(e) {
    e.preventDefault()
    document.getElementById("profileInfo").classList.add("d-none");
    document.getElementById("orderInfo").classList.remove("d-none");
    document.getElementById("courseInfo").classList.add("d-none");
    document.getElementById("profile").classList.remove("active");
    document.getElementById("profile").classList.add("text-dark");
    document.getElementById("order").classList.add("active");
    document.getElementById("order").classList.remove("text-dark");
    document.getElementById("courses").classList.add("text-dark");
    document.getElementById("courses").classList.remove("active");
}

function showCoursesr(e) {
    e.preventDefault()
    document.getElementById("profileInfo").classList.add("d-none");
    document.getElementById("courseInfo").classList.remove("d-none");
    document.getElementById("orderInfo").classList.add("d-none");
    document.getElementById("profile").classList.remove("active");
    document.getElementById("profile").classList.add("text-dark");
    document.getElementById("courses").classList.add("active");
    document.getElementById("courses").classList.remove("text-dark");
    document.getElementById("order").classList.add("text-dark");
    document.getElementById("order").classList.remove("active");
}

function validateUserInfo(e) {
    e.preventDefault()
    //validate firstname
    if (document.querySelector("#firstName").value === "") {
        document.querySelector("#firstName").classList.add("is-invalid")
    } else {
        document.querySelector("#firstName").classList.remove("is-invalid")
        document.querySelector("#firstName").classList.add("is-valid")
    }
    //validate lastname
    if (document.querySelector("#lastName").value === "") {
        document.querySelector("#lastName").classList.add("is-invalid")
    } else {
        document.querySelector("#lastName").classList.remove("is-invalid")
        document.querySelector("#lastName").classList.add("is-valid")
    }
    // Validation PhoneNumber
    let InputPhoneNumber = document.querySelector('#PhoneNumber')
    if (InputPhoneNumber.value === "") {
        InputPhoneNumber.classList.add("is-invalid")
    } else {
        InputPhoneNumber.classList.remove("is-invalid")
        InputPhoneNumber.classList.add("is-valid")
    }


    //validate username
    //    if (document.querySelector("#userName").value.length < 6) {
    //      document.querySelector("#userName").classList.add("is-invalid")
    //    } else {
    //       document.querySelector("#userName").classList.remove("is-invalid")
    //      document.querySelector("#userName").classList.add("is-valid")
    //  }
    //validate email
    if (document.querySelector("#email").value === "" || document.querySelector("#email").value.indexOf("@") < 0 || document.querySelector("#email").value.indexOf(".") < 0) {
        document.querySelector("#email").classList.add("is-invalid")
    } else {
        document.querySelector("#email").classList.remove("is-invalid")
        document.querySelector("#email").classList.add("is-valid")
    }
    //validate address
    //   if (document.querySelector("#address").value.length < 10) {
    //       document.querySelector("#address").classList.add("is-invalid")
    //   } else {
    //      document.querySelector("#address").classList.remove("is-invalid")
    //     document.querySelector("#address").classList.add("is-valid")
    // }
    //validate address2
    // if (document.querySelector("#address2").value.length < 10) {
    //   document.querySelector("#address2").classList.add("is-invalid")
    //} else {
    //    document.querySelector("#address2").classList.remove("is-invalid")
    //    document.querySelector("#address2").classList.add("is-valid")
    //  }
    //validate city
    if (document.querySelector("#city").value.length < 5) {
        document.querySelector("#city").classList.add("is-invalid")
    } else {
        document.querySelector("#city").classList.remove("is-invalid")
        document.querySelector("#city").classList.add("is-valid")
    }

}