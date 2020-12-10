import { Component } from 'react';
import { ToastContainer } from 'react-toastify';

import fetchImgWithQuery from '../../services';
import Searchbar from '../Searchbar';
import ImageGallery from '../ImageGallery';
import Button from '../Button';
import PreLoader from '../PreLoader';
import Modal from '../Modal';

import { Container, ErrorText } from './AppStyle';

class App extends Component {
  state = {
    search: '',
    page: 1,
    imgArray: [],
    isLoading: false,
    showModal: false,
    largeImageURL: '',
    error: null,
  };

  onSubmitForm = async data => {
    this.setState({ search: data, page: 1, isLoading: true, error: null });

    try {
      const request = await fetchImgWithQuery(data);
      this.setState(({ page }) => ({ imgArray: [...request], page: page + 1 }));
      this.scrollImg();
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  uploadMorePhotos = async () => {
    const { search, page } = this.state;
    this.setState({ isLoading: true });

    try {
      const request = await fetchImgWithQuery(search, page);
      this.setState(({ imgArray, page }) => ({
        imgArray: [...imgArray, ...request],
        page: page + 1,
      }));
      this.scrollImg();
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  scrollImg = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };

  onClickImage = largeImageURL => {
    this.setState({ largeImageURL: largeImageURL });
    this.toggleModal();
  };

  render() {
    const {
      imgArray,
      isLoading,
      showModal,
      largeImageURL,
      error,
      search,
    } = this.state;
    const imgFound = imgArray.length > 0 && !error;
    const imgNotFound = search && imgArray.length === 0 && !error && !isLoading;

    return (
      <Container>
        <Searchbar onSubmitForm={this.onSubmitForm} />
        {error && (
          <ErrorText>Whoops, something went wrong. Try again.</ErrorText>
        )}
        {imgFound && (
          <>
            <ImageGallery
              onClickImage={this.onClickImage}
              imgArray={imgArray}
            />
            {!isLoading && <Button uploadMorePhotos={this.uploadMorePhotos} />}
            {isLoading && <PreLoader />}
            {showModal && (
              <Modal
                largeImageURL={largeImageURL}
                toggleModal={this.toggleModal}
              />
            )}
          </>
        )}
        {imgNotFound && (
          <ErrorText>
            No results were found for your search. Try again.
          </ErrorText>
        )}
        <ToastContainer autoClose={3000} />
      </Container>
    );
  }
}

export default App;
