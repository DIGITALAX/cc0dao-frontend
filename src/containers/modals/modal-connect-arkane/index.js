import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@components/modal';
import Notification from '@components/notification';

import { closeConnectArkaneModal, closeNotInstalledMetamask } from '@actions/modals.actions';
import userActions from '@actions/user.actions';
import { WALLET_ARKANE } from '@constants/global.constants';

import styles from './styles.module.scss';

const ModalConnectArkane = ({ className, title }) => {
  const dispatch = useDispatch();
  const isShowNotificationConnectMetamask = useSelector((state) =>
    state.modals.get('isShowNotificationConnectMetamask')
  );

  const handleClose = () => {
    dispatch(closeConnectArkaneModal());
    dispatch(closeNotInstalledMetamask());
  };

  const handleClick = (source) => {
    dispatch(userActions.tryToLogin(source));
  };

  return (
    <>
      {createPortal(
        <Modal onClose={() => handleClose()} title={title} className={styles.connectwallet}>
          <div className={styles.modalItem} onClick={() => handleClick(WALLET_ARKANE)}>
            <span className={styles.modalsTextForIcon}>Arkane Wallet</span>
            <img
              className={styles.modalIcon}
              src="https://raw.githubusercontent.com/ArkaneNetwork/content-management/master/logo/Arkane_only_A.svg"
              alt="arkane"
            />
          </div>
        </Modal>,
        document.body
      )}
    </>
  );
};

ModalConnectArkane.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
};

ModalConnectArkane.defaultProps = {
  className: '',
  title: 'Connect Wallet',
};

export default ModalConnectArkane;
