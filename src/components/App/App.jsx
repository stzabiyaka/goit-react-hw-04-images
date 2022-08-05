import { useState, useEffect } from 'react';
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
        setTotalPages(Math.ceil(result.totalHits / PER_PAGE));
        toast.info(`Hooray, we have found ${result.totalHits} images for you.`);
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
        toast.error(`Error occured: ${message}`);
      })
      .finally(setShowLoader(false));

    // if (isSearchQueryUpdated) {

    // }
  }, [searchQuery, page]);

  // async componentDidUpdate(prevProps, prevState) {
  //   const isSearchQueryUpdated =
  //     prevState.searchQuery !== this.state.searchQuery;
  //   const isPageUpdated = prevState.page !== this.state.page;

  //   if (isSearchQueryUpdated || isPageUpdated) {
  //     this.setState({ showLoader: true });
  //     try {
  //       const result = await imagesApi.fetchImagesBundle({
  //         query: this.state.searchQuery,
  //         page: this.state.page,
  //         perPage: PER_PAGE,
  //       });
  //       if (result.totalHits === 0) {
  //         toast.warning(
  //           'Sorry, there are no images, corresponding to your request.'
  //         );
  //         return;
  //       }
  //       if (isSearchQueryUpdated) {
  //         toast.info(
  //           `Hooray, we have found ${result.totalHits} images for you.`
  //         );
  //         this.setState({ totalPages: Math.ceil(result.totalHits / PER_PAGE) });
  //       }
  //       const hits = result.hits.map(element => {
  //         return {
  //           id: element.id,
  //           webformatURL: element.webformatURL,
  //           tags: element.tags,
  //           user: element.user,
  //           largeImageURL: element.largeImageURL,
  //         };
  //       });
  //       this.setState(prevState => ({
  //         images: [...prevState.images, ...hits],
  //       }));
  //     } catch (error) {
  //       this.setState({ error: error.message });
  //       toast.error(`Error occured ${this.state.error}`);
  //     } finally {
  //       this.setState({ showLoader: false });
  //     }
  //   }
  // }

  const changeSearchQuery = query => {
    if (searchQuery === query) {
      return;
    }
    setSearchQuery(query);
    setImages([]);
    setPage(1);
    setTotalPages(1);
  };

  const loadMoreImages = () => {
    if (page < totalPages) {
      setPage(state => state + 1);
    }
  };

  return (
    <Application>
      <Searchbar onSubmit={changeSearchQuery} />
      {searchQuery && <ImageGallery images={images} />}
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
