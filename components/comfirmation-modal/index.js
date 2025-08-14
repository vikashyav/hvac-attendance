"use client"
import { createContext, useState, useContext } from "react";

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const showModal = ({ title, message, onConfirm }) => {
    setModal({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  };

  const hideModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const confirm = (e) => {
    if (modal.onConfirm) modal.onConfirm(e);
    hideModal();
  };

  return (
    <ModalContext.Provider value={{ showModal }}>
      {children}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{modal.title}</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{modal.message}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={hideModal}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirm}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};
