// evenListenrs
document.querySelector("#video").addEventListener("click", showVideos);
document
    .querySelector("#description")
    .addEventListener("click", showDescription);
document
    .querySelector("#references")
    .addEventListener("click", showReferences);

//functions
function showVideos(e) {
    e.preventDefault();
    document.getElementById("video").classList.add("act");
    document.getElementById("references").classList.remove("act");
    document.getElementById("description").classList.remove("act");
    document.getElementById("accordionExample").classList.remove("d-none");
    document.getElementById("referencesExample").classList.add("d-none");
    document.getElementById("descriptionExample").classList.add("d-none");
}

function showDescription(e) {
    e.preventDefault();
    document.getElementById("video").classList.remove("act");
    document.getElementById("references").classList.remove("act");
    document.getElementById("description").classList.add("act");
    document.getElementById("accordionExample").classList.add("d-none");
    document.getElementById("referencesExample").classList.add("d-none");
    document
        .getElementById("descriptionExample")
        .classList.remove("d-none");
}

function showReferences(e) {
    e.preventDefault();
    document.getElementById("references").classList.add("act");
    document.getElementById("description").classList.remove("act");
    document.getElementById("video").classList.remove("act");
    document.getElementById("descriptionExample").classList.add("d-none");
    document.getElementById("accordionExample").classList.add("d-none");
    document.getElementById("referencesExample").classList.remove("d-none");
}