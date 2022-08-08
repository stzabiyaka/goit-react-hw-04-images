import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Overlay, ModalContainer, Picture } from '.';

const modalRoot = document.querySelector('#modal-root');

export const Modal = ({ imageUrl, imageAlt, onClose }) => {
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleKeyDown = event => {
    if (event.code === 'Escape') {
      this.props.onClose();
    }
  };

  const handleBackdropClick = event => {
    if (event.target !== event.currentTarget) {
      this.props.onClose();
    }
  };

  return createPortal(
    <Overlay onClick={handleBackdropClick}>
      <ModalContainer>
        <Picture src={imageUrl} alt={imageAlt} />
      </ModalContainer>
    </Overlay>,
    modalRoot
  );
};

Modal.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  imageAlt: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
