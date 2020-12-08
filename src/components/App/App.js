import { Component } from 'react';

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

  onSubmitForm = data => {
    this.setState({ search: data, page: 1, isLoading: true, error: null });
    fetchImgWithQuery(data)
      .then(data => {
        this.setState(({ page }) => ({
          imgArray: [...data],
          page: page + 1,
        }));
        this.scrollImg();
      })
      .catch(error => this.setState({ error }))
      .finally(() => this.setState({ isLoading: false }));
  };

  uploadMorePhotos = () => {
    const { search, page } = this.state;
    this.setState({ isLoading: true });
    fetchImgWithQuery(search, page)
      .then(data => {
        this.setState(({ imgArray, page }) => ({
          imgArray: [...imgArray, ...data],
          page: page + 1,
        }));
        this.scrollImg();
      })
      .catch(error => this.setState({ error }))
      .finally(() => this.setState({ isLoading: false }));
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
      </Container>
    );
  }
}

export default App;
