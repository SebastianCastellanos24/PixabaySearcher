const result = document.querySelector("#result");
const form = document.querySelector("#form");
const paginationDiv = document.querySelector("#pagination")

const imagesPerPage = 30;
let totalPages;
let iterator;
let actualPage = 1;

window.onload = () => {
    form.addEventListener("submit", validateForm);
}

function validateForm(e) {
    e.preventDefault();
    const searcherKeyword = document.querySelector("#keyword").value;

    if(searcherKeyword === ""){
        showAlert("All files are required");
        return
    }

    searchImages();
}   

function showAlert(msg) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: msg,
        showConfirmButton: false,
        timer: 2000,
    })
}

function searchImages() {
    const keyword = document.querySelector("#keyword").value;
    const key = "23173645-5034b6a79447242ce2e177f13";
    const url = `https://pixabay.com/api/?key=${key}&q=${keyword}&per_page=${imagesPerPage}&page=${actualPage}`;
    fetch(url)
        .then( response => response.json())
        .then( result => {
            totalPages = calcPagination(result.totalHits);
            showImage(result.hits);
        })
}

// make pagination
function *makePaginations(total) {
    for(let i = 1; i <= total; i++ ){
        yield i;
    }
}

function calcPagination(total) {
    return parseInt(Math.ceil(total/imagesPerPage))
}

function showImage(images) {
    console.log(images);
    while(result.firstChild) {
        result.removeChild(result.firstChild);
    }

    images.map( image => {
        const { previewURL, likes, views, largeImageURL, type, user } = image;
        result.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white shadow-xl">
                    <img class="w-full" src="${previewURL}">
                    <div class="p-4 text-center">
                        <p class="font-medium"><span class="font-bold text-blue-600">Views: </span>${views}</p>
                        <p class="font-medium"><span class="font-bold text-blue-600">Likes: </span>${likes}</p>
                        <p class="font-medium"><span class="font-bold text-blue-600">Type: </span>${type}</p>
                        <p class="font-medium"><span class="font-bold text-blue-600">User: </span>${user}</p>
                        <a 
                            class="block w-full bg-blue-600 hover:bg-blue-700 text-white uppercase font-bold text-center rounded mt-5 p-1"
                            href=${largeImageURL} 
                            target="_black">
                            See image
                        </a>
                    </div>
                </div>
            </div>
        `
    })

    //clean pagination 
    while (paginationDiv.firstChild) {
        paginationDiv.removeChild(paginationDiv.firstChild);
    }

    printPaginations();
}

function printPaginations() {
    iterator = makePaginations(totalPages);
    while(true) {
        const { value, done } = iterator.next();

        if(done) return;

        //Make a button 
        const boton = document.createElement("a");
        boton.href = "#";
        boton.dataset.pagina = value;
        boton.textContent = value;

        boton.classList.add("next", "bg-blue-400", "px-4", "py-1", "mr-2", "font-bold", "mb-8", "uppercase", "rounded" );

        boton.onclick = () => {
            actualPage = value;
            searchImages();
        }

        paginationDiv.appendChild(boton);
    }   
}