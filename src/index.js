import './css/common.css';
import './css/gallery.css';
import ImgApiService from './js/img-service';
import LoadMoreBtn from './js/components/load-more-btn';
import getRefs from './js/get-refs';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

function findImagesFromApi() {
  const refs = getRefs();
  const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more"]',
    hidden: true,
  });
  const imgApiService = new ImgApiService();
  let coutImg = 0;
  let totalHits = 0;

  refs.searchForm.addEventListener('submit', onSearch);
  loadMoreBtn.refs.button.addEventListener('click', findImg);

  function onSearch(e) {
    e.preventDefault();

    imgApiService.query = e.currentTarget.elements.searchQuery.value;

    if (imgApiService.query === '') {
      return onSearchEmpty();
    }

    loadMoreBtn.show();
    imgApiService.resetPage();
    clearImgContainer();
    findImg();
  }

  function findImg() {
    loadMoreBtn.disable();

    if (totalHits !== 0 && coutImg > totalHits) {
      engOfSearch();
      return;
    } else if (totalHits !== 0 && coutImg <= totalHits) {
      resultOfSearch(totalHits);
    }

    imgApiService.getImg().then(images => {
      totalHits = images.totalHits;

      if (images.hits.length === 0) {
        notFoundImg();
      } else {
        appendImgMarkup(images.hits);
        coutImg += images.hits.length;
      }
      loadMoreBtn.enable();
    });
  }

  function appendImgMarkup(images) {
    refs.imgContainer.insertAdjacentHTML(
      'beforeend',
      images.reduce((acc, image) => {
        acc += `<div class="photo-card">
   <a class="gallery__link" href=${image.largeImageURL}>     
  <img
  class="gallery__image"
  src=${image.webformatURL} 
  data-source=${image.largeImageURL}
  alt="${image.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${image.likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${image.views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${image.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${image.downloads}</b>
    </p>
  </div>
  </a>
</div>`;
        return acc;
      }, '')
    );
    simpleLightbox.refresh();
  }

  const simpleLightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });

  function clearImgContainer() {
    refs.imgContainer.innerHTML = '';
  }

  function onSearchEmpty() {
    Notiflix.Notify.failure('Поиск не должен быть пустым');
  }

  function notFoundImg() {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  function engOfSearch() {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }

  function resultOfSearch(totalHits) {
    Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
  }
}

findImagesFromApi();
