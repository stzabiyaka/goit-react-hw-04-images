import { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Application } from 'components/App';
import { Searchbar } from 'components/Searchbar';
import { ImageGallery } from 'components/ImageGallery';
import { ThreeCircles } from 'react-loader-spinner';
import { Button } from 'components/Button';
import * as imagesApi from 'services/images-api';

import 'react-toastify/dist/ReactToastify.css';

const PER_PAGE = 12;

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showLoader, setShowLoader] = useState(false);
  const isSearchQueryUpdated = useRef(false);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }
    setShowLoader(true);

    imagesApi
      .fetchImagesBundle({
        query: searchQuery,
        page: page,
        perPage: PER_PAGE,
      })
      .then(result => {
        if (result.totalHits === 0) {
          toast.warning(
            'Sorry, there are no images, corresponding to your request.'
          );
          return;
        }
        if (isSearchQueryUpdated.current) {
          toast.info(
            `Hooray, we have found ${result.totalHits} images for you.`
          );
          setTotalPages(Math.ceil(result.totalHits / PER_PAGE));
          isSearchQueryUpdated.current = false;
        }
        const hits = result.hits.map(element => {
          return {
            id: element.id,
            webformatURL: element.webformatURL,
            tags: element.tags,
            user: element.user,
            largeImageURL: element.largeImageURL,
          };
        });
        setImages(state => [...state, ...hits]);
      })
      .catch(({ message }) => {
        toast.error(`Error occured ${message}`);
      })
      .finally(() => {
        setShowLoader(false);
      });
  }, [searchQuery, page]);

  const changeSearchQuery = query => {
    if (searchQuery === query) {
      return;
    }
    setSearchQuery(query);
    setImages([]);
    setPage(1);
    setTotalPages(1);
    isSearchQueryUpdated.current = true;
  };

  const loadMoreImages = () => {
    if (page < totalPages) {
      setPage(state => state + 1);
    }
  };

  return (
    <Application>
      <Searchbar onSubmit={changeSearchQuery} />
      {images.length !== 0 && <ImageGallery images={images} />}
      {showLoader && (
        <ThreeCircles
          height="100"
          width="100"
          outerCircleColor="#301bf5"
          middleCircleColor="#311bf5e1"
          innerCircleColor="#311bf58f"
          ariaLabel="three-circles-rotating"
        />
      )}
      {images.length !== 0 && page !== totalPages && (
        <Button onClick={loadMoreImages} disabled={showLoader} />
      )}
      <ToastContainer autoClose={3000} theme="colored" />
    </Application>
  );
};
