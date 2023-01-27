import React from 'react';

const modalStyle = {
  position: 'fixed',
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
  backgroundColor: 'rgba(0,0,0,.2)',
  color: 'orange',
  fontSize: '40px',
};

const Modal = () => {
  console.log('modal component');

  return (
    <div style={{ modalStyle }}>
      <h1>This is a modal</h1>
      <textarea></textarea>
    </div>
  );
};

export default Modal;
