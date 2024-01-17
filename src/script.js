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
  loaderSpinnerElement.style.visibility = "visible";
}
function removeLoader() {
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

    const imagePromises = [
      loadImage(dogImages[randomNr]),
      loadImage(radioImages[randomnr1]),
      loadImage(catImages[randomNr]),
      loadImage(dogImages[randomnr1]),
      loadImage(radioImages[randomNr]),
      loadImage(catImages[randomnr1]),
    ];
    const loadedImages = await Promise.all(imagePromises);
    imgContainer.forEach((imgsEl, index) => {
      imgsEl.src = loadedImages[index];
    });

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
async function getImageUrl(apiUrl) {
  try {
    const res = await fetch(apiUrl);
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
async function getRadioUrl(apiUrl) {
  try {
    const res = await fetch(apiUrl);
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

async function getCatUrl(apiUrl) {
  try {
    const res = await fetch(apiUrl);
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

// Hanterar "klick"-händelsen för de olika apierna och tar ut rätt data
btnDog.addEventListener("click", async () => {
  await fetchThis(dogApi, (dogData) => {
    return dogData.message.map((dog) => ({ img: dog }));
  });
});

btnRadio.addEventListener("click", async () => {
  await fetchThis(radioApi, (radioData) => {
    return radioData.channels.map((radio) => ({ img: radio.image }));
  });
});

btnCat.addEventListener("click", async () => {
  await fetchThis(catApi, (catData) => {
    return catData.map((cat) => ({ img: cat.url }));
  });
});

async function fetchThis(apiUrl, apiData) {
  try {
    showLoaderSpinner();
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(response.status);
    }

    const data = await response.json();
    const transformedData = apiData(data);

    displayOneAtTime();
    await displayData(transformedData);

    return transformedData;
  } catch (error) {
    console.error(error);
  } finally {
    removeLoader();
  }
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
