const imgContainer = document.querySelectorAll(".img");
const img_Container = document.querySelectorAll(".img-container");
const loaderSpinnerElement = document.querySelector(".loader");
const hidden = document.querySelector(".hidden");
const btn = document.querySelector(".btn");
const btnDog = document.querySelector(".btn-dog");
const btnRadio = document.querySelector(".btn-radio");
const btnCat = document.querySelector(".btn-cat");
const displayOne = document.getElementById("displayOne");

const dogApi = "https://dog.ceo/api/breed/hound/images";
const radioApi = "http://api.sr.se/api/v2/channels/?format=json";
const catApi = "https://api.thecatapi.com/v1/images/search?limit=10";

function displayOneAtTime() {
  displayOne.style.display = "flex";
  img_Container[0].style.display = "none";
}
function displayRandom() {
  displayOne.style.display = "none";
  img_Container[0].style.display = "flex";
}

function showLoaderSpinner() {
  hidden.style.visibility = "hidden";
  loaderSpinnerElement.style.visibility = "visible";
}

function removeLoader() {
  hidden.style.visibility = "visible";
  loaderSpinnerElement.style.visibility = "hidden";
}

async function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img.src);
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = src;
  });
}

async function promiseAllThis() {
  showLoaderSpinner();

  try {
    const [dogImages, radioImages, catImages] = await Promise.all([
      getImageUrl(dogApi),
      getRadioUrl(radioApi),
      getCatUrl(catApi),
    ]);

    const randomnr1 = Math.floor(Math.random() * 8) + 1;
    const randomNr = Math.floor(Math.random() * 8) + 1;

    imgContainer[0].src = await loadImage(dogImages[randomNr]);
    imgContainer[1].src = await loadImage(radioImages[randomnr1]);
    imgContainer[2].src = await loadImage(catImages[randomNr]);
    imgContainer[3].src = await loadImage(dogImages[randomnr1]);
    imgContainer[4].src = await loadImage(radioImages[randomNr]);
    imgContainer[5].src = await loadImage(catImages[randomnr1]);

    removeLoader();
  } catch (error) {
    console.error(error);
  }
}

btn.addEventListener("click", () => {
  imgContainer.forEach((imgElement) => {
    imgElement.src = "";
  });
  displayRandom();
  promiseAllThis();
});

// Fetchar hundbilder
async function getImageUrl(requestUrl) {
  try {
    const res = await fetch(requestUrl);
    if (!res.ok) {
      throw new Error("Misslyckad fetch");
    }
    const data = await res.json();
    const limitedImages = data.message.slice(1, 10);
    return limitedImages;
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Fetchar radiobilder
async function getRadioUrl(requestUrl) {
  try {
    const res = await fetch(requestUrl);
    if (!res.ok) {
      throw new Error("Misslyckad fetch");
    }
    const data = await res.json();
    const radioImages = data.channels.map((channel) => channel.image);
    return radioImages;
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function getCatUrl(requestUrl) {
  try {
    const res = await fetch(requestUrl);
    if (!res.ok) {
      throw new Error("Misslyckad fetch");
    }
    const data = await res.json();
    const catImages = data.map((cats) => cats.url);
    return catImages;
  } catch (err) {
    console.error(err);
    return [];
  }
}

btnDog.addEventListener("click", () => {
  fetchData(dogApi)
    .then((dogData) => {
      let dogImgs = dogData.message.map((dog) => ({
        img: dog,
      }));
      displayOneAtTime();
      displayData(dogImgs);
      return dogImgs;
    })
    .catch((error) => {
      console.error(error);
    });
});

btnRadio.addEventListener("click", () => {
  fetchData(radioApi)
    .then((radioData) => {
      let radioImgs = radioData.channels.map((radio) => ({
        img: radio.image,
      }));
      displayOneAtTime();
      displayData(radioImgs);
      return radioImgs;
    })
    .catch((error) => {
      console.error(error);
    });
});

btnCat.addEventListener("click", () => {
  fetchData(catApi)
    .then((catData) => {
      let catImg = catData.map((cat) => ({
        img: cat.url,
      }));

      displayOneAtTime();
      displayData(catImg);
      return catImg;
    })
    .catch((error) => {
      console.error(error);
    });
});

function fetchData(url) {
  showLoaderSpinner();
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          reject(new Error(response.status));
          return;
        }

        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function displayData(data) {
  displayOne.innerHTML = (
    await Promise.all(
      data.slice(0, 6).map(async ({ img }) => {
        return `<div class="img-card">
              <img class="img" src="${await loadImage(
                img
              )}" alt="" loading="lazy" />
            </div>`;
      })
    )
  ).join("");

  removeLoader();
}
