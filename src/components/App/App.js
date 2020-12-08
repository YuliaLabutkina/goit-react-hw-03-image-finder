import { Component } from 'react';

import fetchImgWithQuery from '../../services';
import Searchbar from '../Searchbar';
import ImageGallery from '../ImageGallery';
import Button from '../Button';
import PreLoader from '../PreLoader';
import Modal from '../Modal';

import Container from './AppStyle';

class App extends Component {
  state = {
    search: '',
    page: 1,
    imgArray: [],
    isLoading: false,
    showModal: false,
    largeImageURL: '',
  };

  onSubmitForm = data => {
    this.setState({ search: data, page: 1, isLoading: true });
    fetchImgWithQuery(data).then(data => {
      this.setState(({ page }) => ({
        imgArray: [...data],
        page: page + 1,
        isLoading: false,
      }));
      this.scrollImg();
    });
  };

  uploadMorePhotos = () => {
    const { search, page } = this.state;
    this.setState({ isLoading: true });
    fetchImgWithQuery(search, page).then(data => {
      this.setState(({ imgArray, page }) => ({
        imgArray: [...imgArray, ...data],
        page: page + 1,
        isLoading: false,
      }));
      this.scrollImg();
    });
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
    const { imgArray, isLoading, showModal, largeImageURL } = this.state;

    return (
      <Container>
        <Searchbar onSubmitForm={this.onSubmitForm} />
        {imgArray.length > 0 && (
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
      </Container>
    );
  }
}

export default App;
