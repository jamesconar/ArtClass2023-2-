// Global Variables
let level = 1;
let exp = 0;

// DOM Elements
const expProgress = document.getElementById('exp-progress');
const levelValue = document.getElementById('level-value');
const expInfo = document.getElementById('exp-info');
const imageGallery = document.getElementById('image-gallery');
const clearDataButton = document.getElementById('clear-data-button');

// Event Listeners
document.getElementById('image-input').addEventListener('change', handleImageUpload);
clearDataButton.addEventListener('click', clearData);

// Load stored data on page load
document.addEventListener('DOMContentLoaded', loadStoredData);

// Update Experience and Level Functions
function updateExperience(points) {
  exp += points;

  if (exp < 0) {
    exp = 0;
  }

  const maxExp = level * 100;
  const progressPercentage = (exp / maxExp) * 100;

  if (exp >= maxExp) {
    levelUp();
  }

  expProgress.style.width = `${progressPercentage}%`;
  expInfo.textContent = `Exp: ${exp} / ${maxExp}`;

  // Store updated experience and level in local storage
  storeData();
}

function getRandomExpAmount() {
  const nextLevelExp = (level + 1) * 100;
  const maxExp = Math.floor(nextLevelExp * 0.1); // Set max exp as 10% of the exp needed to reach the next level
  return Math.floor(Math.random() * (maxExp + 1));
}

function levelUp() {
  level++;
  exp = 0;

  levelValue.textContent = level;

  // Store updated experience and level in local storage
  storeData();
}

// Image Handling Functions
function handleImageUpload(event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      const imageName = prompt('Enter the image name:');
      const imageDescription = prompt('Enter the image description:');
      const uploadDate = getCurrentDate();

      const expPoints = getRandomExpAmount();
      updateExperience(expPoints); // Increase experience by a random amount for each image uploaded

      const imageElement = createImageElement(reader.result, imageName, imageDescription, uploadDate, expPoints);
      imageGallery.insertBefore(imageElement, imageGallery.firstChild);

      // Save uploaded image data
      const imageData = {
        src: reader.result,
        name: imageName,
        description: imageDescription,
        uploadDate: uploadDate,
        expPoints: expPoints
      };

      saveImageData(imageData);
    });

    reader.readAsDataURL(file);
  }
}

function createImageElement(src, name, description, uploadDate, expPoints) {
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('image-container');
  imageContainer.dataset.exp = expPoints; // Set the exp points for the image

  const uploadedImage = document.createElement('img');
  uploadedImage.classList.add('uploaded-image');
  uploadedImage.src = src;

  const imageDetails = document.createElement('div');
  imageDetails.classList.add('image-details');

  const imageNameElement = document.createElement('p');
  imageNameElement.classList.add('image-name');
  imageNameElement.textContent = `Name: ${name}`;

  const imageDescriptionElement = document.createElement('p');
  imageDescriptionElement.classList.add('image-description');
  imageDescriptionElement.textContent = `Description: ${description}`;

  const uploadDateElement = document.createElement('p');
  uploadDateElement.classList.add('upload-date');
  uploadDateElement.textContent = `Uploaded: ${uploadDate}`;

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete this image?')) {
      const expPointsToRemove = parseInt(imageContainer.dataset.exp, 10);
      updateExperience(-expPointsToRemove); // Decrease experience by the points of the deleted image

      // Remove image from gallery
      imageContainer.remove();

      // Remove image data from storage
      deleteImageData(src);
    }
  });

  imageDetails.appendChild(imageNameElement);
  imageDetails.appendChild(imageDescriptionElement);
  imageDetails.appendChild(uploadDateElement);
  imageDetails.appendChild(deleteButton);

  imageContainer.appendChild(uploadedImage);
  imageContainer.appendChild(imageDetails);

  // Insert the image container at the beginning of the image gallery
  imageGallery.insertBefore(imageContainer, imageGallery.firstChild);

  return imageContainer;
}

function saveImageData(imageData) {
  let imagesData = [];
  const storedImagesData = localStorage.getItem('imageUploaderImages');

  if (storedImagesData) {
    imagesData = JSON.parse(storedImagesData);
  }

  imagesData.push(imageData);
  localStorage.setItem('imageUploaderImages', JSON.stringify(imagesData));
}

function deleteImageData(src) {
  const storedImagesData = localStorage.getItem('imageUploaderImages');

  if (storedImagesData) {
    const imagesData = JSON.parse(storedImagesData);

    const updatedImagesData = imagesData.filter((imageData) => imageData.src !== src);

    localStorage.setItem('imageUploaderImages', JSON.stringify(updatedImagesData));
  }
}

// Data Storage Functions
function storeData() {
  const data = {
    level,
    exp
  };

  localStorage.setItem('imageUploaderData', JSON.stringify(data));
}

function loadData() {
  const data = JSON.parse(localStorage.getItem('imageUploaderData'));
  if (data) {
    level = data.level || 1;
    exp = data.exp || 0;
  }
}

function loadStoredData() {
  loadData();
  levelValue.textContent = level;
  updateExperience(0); // Update the experience bar and text based on loaded data

  const imagesData = JSON.parse(localStorage.getItem('imageUploaderImages'));
  if (imagesData) {
    for (const imageData of imagesData) {
      const { src, name, description, uploadDate, expPoints } = imageData;
      const imageElement = createImageElement(src, name, description, uploadDate, expPoints);
      imageGallery.insertBefore(imageElement, imageGallery.firstChild);
    }
  }
}

// Clear Data Function
function clearData() {
  const password = prompt('Please enter the password to clear all data:');
  if (password === 'Blue35') {
    localStorage.removeItem('imageUploaderData');
    localStorage.removeItem('imageUploaderImages');
    location.reload(); // Reload the page to reset all data
  } else {
    alert('Incorrect password. Data was not cleared.');
  }
}

// Helper Function
function getCurrentDate() {
  const date = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

// Load stored data on page load
document.addEventListener('DOMContentLoaded', loadStoredData);
