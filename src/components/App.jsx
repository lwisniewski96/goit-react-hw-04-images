import { useState, useEffect } from 'react';
import { ThreeCircles } from 'react-loader-spinner';
import toast, { Toaster } from 'react-hot-toast';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Searchbar } from './Searchbar/Searchbar';
import { fetchImages } from 'services/apiService';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';
import Modal from './Modal/Modal';
import css from './App.module.css';

function App() {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [modalImageURL, setModalImageURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [endCollection, setEndCollection] = useState(false);
  const [tags, setTags] = useState('');

  const openModal = (url, tags) => {
    setShowModal(true);
    setModalImageURL(url);
    setTags(tags);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalImageURL('');
    setTags('');
  };

  const handleFormSubmit = query => {
    setQuery(query);
    setPage(1);
    setImages([]);
    setEndCollection(false);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!query) return;

      setIsLoading(true);

      try {
        const data = await fetchImages(query, page);

        setImages(prevImages => [...prevImages, ...data.hits]);

        if (!data.totalHits) {
          toast.success(
            'Sorry, there are no images matching your search query. Please try again'
          );
        }

        const totalPages = Math.ceil(data.totalHits / 12);

        if (page === totalPages) {
          setEndCollection(true);
          toast.success('No more pictures');
        }
      } catch (error) {
        console.log('Error', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [query, page]);

  const showLoadMoreBtn = images.length > 0 && !endCollection;

  return (
    <div className={css.app}>
      <Toaster position="top-right" reverseOrder={false} />
      {showModal && (
        <Modal onClose={closeModal}>
          <img src={modalImageURL} alt={tags} />
        </Modal>
      )}
      <Searchbar onSubmit={handleFormSubmit} />
      <ImageGallery images={images} onClick={openModal} />
      {showLoadMoreBtn && <Button onClick={handleLoadMore} />}
      {isLoading && (
        <Loader>
          <ThreeCircles
            height="100"
            width="100"
            color="#70060d"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="three-circles-rotating"
            outerCircleColor=""
            innerCircleColor=""
            middleCircleColor=""
          />
        </Loader>
      )}
      <div id="modal-root"></div>
    </div>
  );
}

export default App;
