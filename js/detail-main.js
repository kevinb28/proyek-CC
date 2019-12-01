const urlParams = new URLSearchParams(window.location.search);
const mangaId = urlParams.get('mangaid');
// title.innerHTML = "Manga ID: " + mangaId;

const _BASE_URL_ = 'https://www.mangaeden.com/api/manga/';
const __BASE_IMG_URL__  = 'https://cdn.mangaeden.com/mangasimg/98x/';

fetch(_BASE_URL_ + mangaId + "/")
    .then((resp) => resp.json())
    .then(handleDetailResponse)
    .catch(error);

function handleDetailResponse(data) {
    console.log(data);

    var image = document.createElement('img')
    image.src = __BASE_IMG_URL__ + data.image;
    image.style = "object-fit: cover;";

    var title = document.createElement('h3')
    title.innerHTML = data.title;

    var arthor = document.createElement('div')
    if (data.artist != data.author) {
        arthor.innerHTML = data.artist + ", " + data.author;
    }
    else {
        arthor.innerHTML = data.artist;
    }

    var statusChapters = document.createElement('div')
    if (data.status == 1) {
        statusChapters.innerHTML = "Ongoing | ";
        document.getElementById('status').innerHTML = "Ongoing";
    }
    else {
        statusChapters.innerHTML = "Completed | ";
        document.getElementById('status').innerHTML = "Completed";
    }
    statusChapters.innerHTML += data.chapters_len + " Chapters";
    
    var topImage = document.getElementById('top-image')
    topImage.appendChild(image);

    var topTexts = document.getElementById('top-texts')
    topTexts.appendChild(title)
    topTexts.appendChild(arthor)
    topTexts.appendChild(statusChapters)

    // aka
    for (var alias of data.aka) {
        var akaElement = document.createElement('div');
        akaElement.innerHTML = alias;
        aka.appendChild(akaElement);
    }
    
    // genres
    for (var genre of data.categories) {
        var linkElement = document.createElement('a');
        linkElement.className = 'genre-link';

        var genreElement = document.createElement('span');
        genreElement.className += 'genre-rcorners';
        genreElement.innerHTML = genre;

        linkElement.appendChild(genreElement)
        genres.appendChild(linkElement);
    }

    // description
    description.innerHTML = data.description;

    // authors
    authors.innerHTML = data.artist || data.author;
    // other facts
    other = document.getElementById('other-facts');
    other.innerHTML = "released : " + data.released;

    // chapters
    for (var i = 0; i < data.chapters.length; i++) {
        var tr = document.createElement('tr');
        var tdChapNumb = document.createElement('td');
        var tdChapTitle = document.createElement('td');
        var chapLink = document.createElement('a');
        
        chapLink.href = "./read.html?chapterid=" + data.chapters[i][3];
         if (data.chapters[i][2]==null){
            chapLink.innerHTML = data.chapters[i][0];
        }
        else{
            chapLink.innerHTML = data.chapters[i][2];
        }
        //chapLink.innerHTML = data.chapters[i][0] + " " + data.chapters[i][2];
        var tdUpdateTime = document.createElement('td');

        tdChapNumb.innerHTML = data.chapters[i][0];
        // tdChapTitle.innerHTML = data.chapters[i][2];
        tdChapTitle.appendChild(chapLink);
        tdUpdateTime.innerHTML = unixTimestampToDate(data.chapters[i][1]);
        
        tr.appendChild(tdChapNumb);
        tr.appendChild(tdChapTitle);
        tr.appendChild(tdUpdateTime);
        chaptertable.appendChild(tr);
    }

}

function error(e) {
    console.log(e);
}

function unixTimestampToDate(timestamp) {
    var date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
}