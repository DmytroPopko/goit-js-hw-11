const API_KEY = '29842496-3845217212e1068d319854a8f';
const BASE_URL = 'https://pixabay.com/api/';

export default class ImgApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async getImg() {
    const axios = require('axios').default;
    const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&page=${this.page}`;

    const options = {
      method: 'get',
      url,
      params: {
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: '40',
      },
    };

    try {
      const response = await axios(options);
      this.incrementPage();
      console.log(this);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
