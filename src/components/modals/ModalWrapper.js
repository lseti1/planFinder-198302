import React from 'react';
import './ModalWrapper.css';

const ModalWrapper = ({ onClose, children}) => {

    const handleBackgroundClicks = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }

    return (
        <div className='modalBackground' onClick={handleBackgroundClicks}>
            <div className='modalBox'>
                <button className='modalExitButton' onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    )
}

export default ModalWrapper;