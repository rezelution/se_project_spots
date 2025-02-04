const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  // {
  //   name: "Golden Gate Bridge",
  //   link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  // },
];

/*every time we need to use an element we need to select it first*/
//below selects the edit profile and modal
const profileEditButton = document.querySelector(".profile__edit-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editProfileModal = document.querySelector("#edit-profile-modal");
const inputName = document.querySelector("#profile-name-input");
const inputDescription = document.querySelector("#profile-description-input");
const profileFormElement = editProfileModal.querySelector(".modal__form");
const profileForm = document.forms["profile-form"];

//below selects the new post and modal
const newPostButton = document.querySelector(".profile__add-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostForm = document.forms["newPost-form"];

const cardSubmitButton = newPostModal.querySelector(".modal__submit-button");

const newPostLinkInput = document.querySelector("#newPost-link-input");
const newPostCaptionInput = document.querySelector("#newPost-caption-input");

//below selects the preview larger image modal
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");

//selects all close buttons on modals
const closeButtons = document.querySelectorAll(".modal__close");

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

// Universal function to close the modal when clicking outside the modal content
function closeModalOnOutsideClick(modal) {
  modal.addEventListener("click", (evt) => {
    // Checks if the click was outside the modal content
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
}

// Add close on outside click for each modal
const modals = document.querySelectorAll(".modal");
modals.forEach((modal) => {
  closeModalOnOutsideClick(modal);
});

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

//This is universal close button handler
closeButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

//this is handling placing all the text into the fields and then it closes when you submit
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = inputName.value;
  profileDescription.textContent = inputDescription.value;
  closeModal(editProfileModal);
}

//this is entering the information/link then adding the image to the front of array(temp)
function handleNewPostSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    link: newPostLinkInput.value,
    name: newPostCaptionInput.value,
  };
  renderCard(inputValues, "prepend"); // Prepend the new card
  evt.target.reset();
  disableButton(cardSubmitButton, settings);
  closeModal(newPostModal);
}

//these are the event listener for the above functions
profileForm.addEventListener("submit", handleProfileFormSubmit);
newPostForm.addEventListener("submit", handleNewPostSubmit);

//this is identifying what the actual card is and below are the fields and how they will be populated
const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__like-button_clicked");
  });

  //this deletes the card, the closest goes to the nearest parent
  cardDeleteButton.addEventListener("click", () => {
    cardElement.remove();
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

initialCards.forEach((card) => {
  renderCard(card);
});
