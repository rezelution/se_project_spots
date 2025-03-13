export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    btn.textContent = loadingText;
  } else {
    btn.textContent = defaultText;
  }
}

// define a universal function that accepts a request function, event and a default loading text
export function handleSubmit(request, evt, loadingText = "Saving...") {
  // You need to prevent the default action in any submit handler
  evt.preventDefault();

  // the button is always available inside `event` as `submitter`
  const submitButton = evt.submitter;
  // fix the initial button text
  const initialText = submitButton.textContent;
  // change the button text before requesting
  setButtonText(submitButton, true, initialText, loadingText);
  // call the request function to be able to use the promise chain
  request()
    .then(() => {
      // any form should be reset after a successful response
      // evt.target is the form in any submit handler
      evt.target.reset();
    })
    // we need to catch possible errors
    // console.error is used to handle errors if you don’t have any other ways for that
    .catch(console.error)

    // and in finally we need to stop loading
    .finally(() => {
      setButtonText(submitButton, false, initialText, loadingText);
    });
}
