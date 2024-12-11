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
];

const profileEditButton = document.querySelector(".profile__edit-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

/*this is to select something and if we want something to happen when it get's clicked we need to set an event listener*/
/*every time we need to use an element we need to select it first*/

const editProfileModal = document.querySelector("#edit-profile-modal");
const closeButtonModal = editProfileModal.querySelector(".modal__close-button");
const inputName = document.querySelector("#profile-name-input");
const inputDescription = document.querySelector("#profile-description-input");
const profileFormElement = editProfileModal.querySelector(".modal__form");

/*if you give an ID to the element then all other searches will be easier*/

const newPostButton = document.querySelector(".profile__add-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseButton = newPostModal.querySelector(".modal__close-button");
const newPostForm = newPostButton.querySelector(".modal__form");
const newPostLinkInput = document.querySelector("#newPost-link-input");
const newPostCaptionInput = document.querySelector("#newPost-caption-input");

function openModal(modal) {
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

profileEditButton.addEventListener("click", () => {
  inputName.value = profileName.textContent;
  inputDescription.value = profileDescription.textContent;
  openModal(editProfileModal);
});

closeButtonModal.addEventListener("click", () => {
  closeModal(editProfileModal);
});

newPostButton.addEventListener("click", () => {
  openModal(newPostModal);
});

newPostCloseButton.addEventListener("click", () => {
  closeModal(newPostModal);
});

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = inputName.value;
  profileDescription.textContent = inputDescription.value;
  closeModal(editProfileModal);
}

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    link: newPostLinkInput.value,
    name: newPostCaptionInput.value,
  };
  const cardEl = getCardElement(inputValues);
  cardList.prepend(cardEl);
  closeModal(newPostModal);
}
/*this is grabbing the inputted data and saving it to the field*/

profileFormElement.addEventListener("submit", handleProfileFormSubmit);
newPostModal.addEventListener("submit", handleNewPostSubmit);

/*the code is for submit when i hit the save button*/

const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  return cardElement;
}

//the above is grabbing from the array and filling the data into the designated template areas

initialCards.forEach((card) => {
  const cardElement = getCardElement(card);
  cardList.append(cardElement);
});
//the for loop is taking each image in array and listing one by one.
//The append starts at the end, the prepend starts at the front
