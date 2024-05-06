import axios from 'axios';
import Notiflix from 'notiflix';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let currentPage = 1;
let searchQuery = '';

const apiKey = '43741429-5506f652f07f70aab0dd2cbe4';
const baseURL = 'https://pixabay.com/api/';

async function fetchImages(query, page) {
    try {
        const response = await axios.get(`${baseURL}?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`);
        const { hits, totalHits } = response.data;
        if (hits.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            return;
        }
        if (page === 1) {
            Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        }
        displayImages(hits);
        if (currentPage * 40 >= totalHits) {
            loadMoreBtn.style.display = 'none';
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        } else {
            loadMoreBtn.style.display = 'block';
        }
    } catch (error) {
        Notiflix.Notify.failure('An error occurred while fetching data.');
    }
}

function displayImages(images) {
    const markup = images.map(image => `
        <div class="photo-card">
            <a href="${image.largeImageURL}" target="_blank">
                <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy">
            </a>
            <div class="info">
                <p class="info-item"><b>Likes:</b> ${image.likes}</p>
                <p class="info-item"><b>Views:</b> ${image.views}</p>
                <p class="info-item"><b>Comments:</b> ${image.comments}</p>
                <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
            </div>
        </div>
    `).join('');
    gallery.innerHTML += markup;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    searchQuery = event.currentTarget.elements.searchQuery.value;
    currentPage = 1;
    gallery.innerHTML = ''; // Clear the gallery
    await fetchImages(searchQuery, currentPage);
});

loadMoreBtn.addEventListener('click', async () => {
    currentPage += 1;
    await fetchImages(searchQuery, currentPage);
});
