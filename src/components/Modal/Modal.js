import { Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Overlay, ImgContainer, Image } from './ModalStyle';

const modalRoot = document.querySelector('#modal-root');

export default class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = e => {
    if (e.code === 'Escape') {
      this.props.toggleModal();
    }
  };

  closeByBackdrop = ({ target, currentTarget }) => {
    if (target === currentTarget) this.props.toggleModal();
  };

  render() {
    const { largeImageURL } = this.props;

    return createPortal(
      <Overlay onClick={this.closeByBackdrop}>
        <ImgContainer>
          <Image src={largeImageURL} alt="" />
        </ImgContainer>
      </Overlay>,
      modalRoot,
    );
  }
}

Modal.propTypes = {
  largeImageURL: PropTypes.string.isRequired,
  toggleModal: PropTypes.func.isRequired,
};
