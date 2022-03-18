//varibles



//eventListenrs
//event click on submit btn
document.querySelector("#btnSubmit").addEventListener("click" , validateUserInfo);




//functions
function validateUserInfo(e){
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
    //validate username
    if (document.querySelector("#userName").value.length < 6) {
        document.querySelector("#userName").classList.add("is-invalid")
    } else {
        document.querySelector("#userName").classList.remove("is-invalid")
        document.querySelector("#userName").classList.add("is-valid")
    }
    //validate email
    if (document.querySelector("#email").value === "" || document.querySelector("#email").value.indexOf("@") < 0 || document.querySelector("#email").value.indexOf(".") < 0) {
        document.querySelector("#email").classList.add("is-invalid")
    } else {
        document.querySelector("#email").classList.remove("is-invalid")
        document.querySelector("#email").classList.add("is-valid")
    }
    //validate address
    if (document.querySelector("#address").value.length < 10) {
        document.querySelector("#address").classList.add("is-invalid")
    } else {
        document.querySelector("#address").classList.remove("is-invalid")
        document.querySelector("#address").classList.add("is-valid")
    }
    //validate address2
    if (document.querySelector("#address2").value.length < 10) {
        document.querySelector("#address2").classList.add("is-invalid")
    } else {
        document.querySelector("#address2").classList.remove("is-invalid")
        document.querySelector("#address2").classList.add("is-valid")
    }
    //validate city
    if (document.querySelector("#city").value.length < 5) {
        document.querySelector("#city").classList.add("is-invalid")
    } else {
        document.querySelector("#city").classList.remove("is-invalid")
        document.querySelector("#city").classList.add("is-valid")
    }
    
}
