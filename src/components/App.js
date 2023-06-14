import React, { useState, useEffect } from 'react';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import ImagePopup from './ImagePopup.js';
import api from '../utils/Api.js';
import CurrentUserContext from '../contexts/CurrentUserContext.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await api.getUserInfo();
        setCurrentUser(userInfo);
      } catch (error) {
        console.log('Ошибка при получении данных пользователя:', error);
      }
    };

    fetchUserInfo();
  }, []);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({});
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    if (isLiked) {
      api
        .removeLike(card._id)
        .then((updatedCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? updatedCard : c))
          );
        })
        .catch((error) => {
          console.log('Ошибка при удалении лайка:', error);
        });
    } else {
      api
        .addLike(card._id)
        .then((updatedCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? updatedCard : c))
          );
        })
        .catch((error) => {
          console.log('Ошибка при добавлении лайка:', error);
        });
    }
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((error) => {
        console.log('Ошибка при удалении карточки:', error);
      });
  }

  const handleUpdateUser = (userData) => {
    api
      .updateUserInfo(userData)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        closeAllPopups();
      })
      .catch((error) => {
        console.log('Ошибка при обновлении профиля пользователя:', error);
      });
  };

  const handleUpdateAvatar = (avatarData) => {
    api
      .changeAvatar(avatarData.avatar)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        closeAllPopups();
      })
      .catch((error) => {
        console.log('Ошибка при обновлении аватара пользователя:', error);
      });
  };

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const initialCards = await api.getInitialCards();
        setCards(initialCards);
      } catch (error) {
        console.log('Ошибка при получении данных:', error);
      }
    };

    fetchCards();
  }, []);

  const handleAddPlaceSubmit = (cardData) => {
    api
      .addNewCard(cardData)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((error) => {
        console.log('Ошибка при добавлении карточки:', error);
      });
  };

  return (
    <div className="App">
      <Header />
      <CurrentUserContext.Provider value={currentUser}>
        <Main
          onEditProfile={() => setIsEditProfilePopupOpen(true)}
          onAddPlace={handleAddPlaceClick}
          onEditAvatar={handleEditAvatarClick}
          onCardClick={handleCardClick}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
          currentUser={currentUser}
          setCards={setCards}
          cards={cards}
        />
        <Footer />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={() => setIsEditProfilePopupOpen(false)}
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <div className="popup popup_type_card-delete">
          <div className="popup__container">
            <h2 className="popup__title-card-delete">Вы уверены?</h2>
            <form className="form">
              <button
                type="submit"
                className="popup__submit popup__save-button popup__delete-button"
              >
                Да
              </button>
            </form>
            <button
              type="button"
              className="popup__close-button popup__button-close"
            >
              <img
                src=""
                className="popup__close-button-img"
                alt="Иконка белого креста"
              />
            </button>
          </div>
        </div>
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
