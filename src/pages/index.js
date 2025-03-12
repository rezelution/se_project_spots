import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import "./index.css";
import spotsLogoBlack from "../Images/spots_logo_black.svg";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";

let userId;
let selectedCard;
let selectedCardId;

//this is creating the master baseurl and headers that will be used in to build "this" in the API class
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "affadb7a-4331-4fd2-8582-ffa1f1bc4b49",
    "Content-Type": "application/json",
  },
});

//selects the edit profile and modal
const profileEditButton = document.querySelector(".profile__edit-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar img");
const profileEditAvatar = document.querySelector(".profile__avatar-button");
const editProfileModal = document.querySelector("#edit-profile-modal");

//selects the form inputs, modals
const inputName = document.querySelector("#profile-name-input");
const inputDescription = document.querySelector("#profile-description-input");
const profileFormElement = editProfileModal.querySelector(".modal__form");
const profileForm = document.forms["profile-form"];
const profileAvatarModal = document.querySelector("#edit-avatar-modal");
const avatarForm = document.forms["avatar-form"];

//below selects the new post and modal
const newPostButton = document.querySelector(".profile__add-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostForm = document.forms["newPost-form"];
const newPostLinkInput = document.querySelector("#newPost-link-input");
const newPostCaptionInput = document.querySelector("#newPost-caption-input");

//selects the buttons
const cardSubmitButton = newPostModal.querySelector(".modal__submit-button");
const deletePostModal = document.querySelector("#delete-post-modal");
const closeButtons = document.querySelectorAll(".modal__close");

//below selects the preview larger image modal
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");

//selects all modals
const modals = document.querySelectorAll(".modal");

//this is identifying what the actual card is and below are the fields and how they will be populated
const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");

const deleteCardSubmit = deletePostModal.querySelector(".modal__delete-button");
const deleteCardCancel = deletePostModal.querySelector(".modal__cancel-button");

const spots_logo_black = document.getElementById("spots-logo-black");
spots_logo_black.src = spotsLogoBlack;

// Add close on outside click for each modal
modals.forEach((modal) => {
  closeModalOnOutsideClick(modal);
});

//This is universal close button handler
closeButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

//these are the universal functions for opening and closing the modals
function openModal(modal) {
  modal.classList.add("modal_opened");
  //below adds the listener when window is open
  document.addEventListener("keydown", closeModalOnEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  //below removes the listener when window is closed
  document.removeEventListener("keydown", closeModalOnEscape);
}

// Universal function to close the modal when clicking outside the modal content
function closeModalOnOutsideClick(modal) {
  modal.addEventListener("click", (evt) => {
    // Checks if the click was outside the modal content
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
}

// Function to close modal when Escape key is pressed
function closeModalOnEscape(evt) {
  if (evt.key === "Escape") {
    // Find the currently open modal
    const openModal = document.querySelector(".modal_opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  const isLiked = data.isLiked;
  if (isLiked) {
    cardLikeButton.classList.add("card__like-button_clicked");
  }

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardLikeButton.addEventListener("click", (evt) => {
    handleLike(evt, data._id);
  });

  //this deletes the card, the closest goes to the nearest parent ----- modified this
  cardDeleteButton.addEventListener("click", (evt) => {
    handleDeleteCard(cardElement, data);
  });

  //for image preview modal .card__image
  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalCaption.textContent = data.name;
    previewModalImageEl.src = data.link;
    previewModalCaption.alt = data.name;
  });

  return cardElement;
}

function renderCard(item, method = "append") {
  const cardElement = getCardElement(item);
  cardList[method](cardElement);
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const avatarInput = document.querySelector("#profile-picture-input"); // Get the input element
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  api
    .editAvatar({ avatar: avatarInput.value })
    .then((data) => {
      profileAvatar.src = data.avatar;
      profileAvatar.alt = data.name;
      closeModal(profileAvatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

//this is entering the information/link then adding the image to the front of array(temp)
function handleNewPostSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    link: newPostLinkInput.value,
    name: newPostCaptionInput.value,
  };
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  api
    .newCardPost(inputValues)
    .then((data) => {
      renderCard(data, "append");
      evt.target.reset();
      disableButton(cardSubmitButton, settings);
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleLike(evt, cardId) {
  const likeButton = evt.target;
  const isLiked = likeButton.classList.contains("card__like-button_clicked");

  api
    .handleLike({ cardId: cardId, isLiked: isLiked })
    .then((updatedCard) => {
      if (updatedCard.isLiked) {
        likeButton.classList.add("card__like-button_clicked");
      } else {
        likeButton.classList.remove("card__like-button_clicked");
      }
    })
    .catch(console.error);
}

//this is handling placing all the text into the fields and then it closes when you submit
function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  //the evt target "submitter" targets the submit button based on it being clicked
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editUserInfo({ name: inputName.value, about: inputDescription.value })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deletePostModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.target;
  setButtonText(submitBtn, true, "Delete", "Deleting...");
  api
    .deleteCard({ cardId: selectedCardId })
    .then(() => {
      selectedCard.remove();
      closeModal(deletePostModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Delete", "Deleting...");
    });
}

//this is listening for the click then pulling up the data that's in the input fields
profileEditButton.addEventListener("click", () => {
  inputName.value = profileName.textContent;
  inputDescription.value = profileDescription.textContent;
  resetValidation(editProfileModal, [inputName, inputDescription], settings);
  openModal(editProfileModal);
});

//these are just for opening and closing for the buttons
newPostButton.addEventListener("click", () => {
  openModal(newPostModal);
});

profileEditAvatar.addEventListener("click", () => {
  openModal(profileAvatarModal);
});

//these are the event listener for the above functions
profileForm.addEventListener("submit", handleProfileFormSubmit);
newPostForm.addEventListener("submit", handleNewPostSubmit);
avatarForm.addEventListener("submit", handleAvatarFormSubmit);

deleteCardSubmit.addEventListener("click", handleDeleteSubmit);
deleteCardCancel.addEventListener("click", () => closeModal(deletePostModal));

api
  .getAppInfo()
  .then(([cards, userData]) => {
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.src = userData.avatar;
    profileAvatar.alt = userData.name;
    userId = userData._id;
    cards.reverse().forEach((card) => {
      renderCard(card);
    });
  })
  .catch(console.error);

enableValidation(settings);
