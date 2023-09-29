import axios from 'axios';


const KEY = '37030220-55e5b35e4370d44ae057df5d9';


const pageLimit = 12;

axios.defaults.baseURL = 'https://pixabay.com/api/';


export const fetchImages = async (query, page) => {
  const { data } = await axios({
    params: {
      key: KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: pageLimit,
      page: page,
    },
  });
  return data;
};
