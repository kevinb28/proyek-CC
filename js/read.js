const urlParams = new URLSearchParams(window.location.search);
const chapterId = urlParams.get('chapterid');

const __BASE_CHAP__ = "https://www.mangaeden.com/api/chapter/";
const __BASE_IMG1__ = "https://www.mangaeden.com/img/";
const __BASE_IMG2__ = "https://cdn.mangaeden.com/mangasimg/98x/";

let pages = [];
let cursor = 0;
let pageList = [];

fetch(__BASE_CHAP__ + chapterId + "/")
    .then((resp) => resp.json())
    .then(handlePagesResponse)
    .catch(error);

/**
 * 
 * @param {*} data 
 * data includes page(s) url.
 */
function handlePagesResponse(data) {
    console.log(data);
    pages = data.images;
    pageList = pages;

    showPage(4);

    window.onscroll = function() {
        var d = document.documentElement;
        var offset = d.scrollTop + window.innerHeight;
        var height = d.offsetHeight;
        
        if (offset >= height) {
            console.log('At the bottom');
            showPage(2);
        }
    };

}

function showPage(number = 5) {
    if (pageList.length <= 0) {
        return;
    }
    pagesElement = document.getElementById('pages');
    setTimeout(function(){ loadImage(pagesElement, number - 1) }, 1250);
    console.log("showing " + number + " number of page.")
}

function loadImage(pagesElement, number) {
    if (pageList.length <= 0 || number <= 0) {
        return;
    }
    page = pageList.pop();

    var pageElement = document.createElement('img');
    pageElement.src = __BASE_IMG2__ + page[1];
    pageElement.className += "manga-page-image";

    pagesElement.appendChild(pageElement);
    setTimeout(function(){ loadImage(pagesElement, number - 1) }, 1250);
}

function error(e) {
    console.log(e);
}