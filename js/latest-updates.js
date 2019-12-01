const __BASE_URL__      = 'https://www.mangaeden.com/api/';
const __MANGA_LIST__    = 'list/0/';
const __MANGA_DETAIL__  = 'https://www.mangaeden.com/api/manga/';

const __BASE_IMG_URL__  = 'https://cdn.mangaeden.com/mangasimg/98x/';

// memory
let mangas      = [];
let mangaList   = [];

fetch(__BASE_URL__ + __MANGA_LIST__)
    .then((resp) => resp.json())
    .then(handleResponse)
    .catch(error);

function handleResponse(data) {
    mangas = sortByTimestamp(data.manga);
    mangaList = mangas;
    console.log(mangas);
    showManga(7);
}

/**
 * 
 * @param {*} number 
 * new method.
 * better way to load manga element.
 * 
 */
function showManga(number = 7) {
    list_element = document.getElementById('list');
    loadMangaElement(list_element, number);
}

/**
 * 
 * @param {*} list_element html tag element. Element with id `list`.
 * @param {*} number number of manga to be loaded.
 * 
 */
function loadMangaElement(list_element, number) {
    if (mangaList.length <= 0 || number <= 0) {
        return;
    }
    
    // get manga from list
    let manga = mangaList.pop();

    // get manga on card element
    var mangaOnCard = displayOnCard(manga, number);

    // show it on page in list_element.
    list_element.appendChild(mangaOnCard);

    // load next Manga on list
    loadMangaElement(list_element, number - 1);
}

/**
 * 
 * @param {*} list_element | element in html page.
 * @param {*} manga | manga object, response from manga eden api
 * @param {*} number | number of seconds for image load delay.
 * 
 * display manga object in card.
 * 
 */
function displayOnCard(manga, number = 7) {
    var div_child   = document.createElement('div');
    div_child.onclick = () => {
        location.href = './detail.html?mangaid=' + manga.i;
    };
    // child contains: 
    let img         = document.createElement('img');
    var title       = document.createElement('div');
    var genres      = document.createElement('div');
    var describe    = document.createElement('div');
    var lastUpdate  = document.createElement('div');

    if (manga.im) {
        setTimeout( function(){
        	img.src = __BASE_IMG_URL__ + manga.im;
        }, 350 * number);
    } else {
        img.src = "https://cdn.mangaeden.com/images/no_image.svg";
    }
    img.className += 'box-img';
    img.alt = manga.t;
    
    title.innerHTML = manga.t;
    title.className += 'box-title';

    for (var genre of manga.c) {
        genres.innerHTML += genre + ", ";
    }
    genres.className += 'box-genre';

    if (manga.status == 1) {
        describe.innerHTML = "Completed; ";
    } else {
        describe.innerHTML = "Ongoing; ";
    }
    describe.innerHTML += manga.h + " views";

    lastUpdate.innerHTML += "last update " + unixTimestampToDate(manga.ld);

    div_child.appendChild(img);
    div_child.appendChild(title);
    div_child.appendChild(genres);
    div_child.appendChild(describe);
    div_child.appendChild(lastUpdate);
    div_child.className += 'box';

    // list_element.appendChild(div_child);

    return div_child;
}

function sortByTimestamp(mangas) {
    thesorted = mangas.sort(function(x, y){
        return x.ld - y.ld;
    });
    return thesorted;
}

function error(e) {
    console.log(e);
}

/**
 * 
 * @param {*} timestamp | 
 * 
 * converts unix timestamp to date.
 */
function unixTimestampToDate(timestamp) {
    var date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
}