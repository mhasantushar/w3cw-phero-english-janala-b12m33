// console.log("Connected");

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const unselectAllLessonButton = () => {
  const lessonBtns = document.getElementsByClassName("btn-lesson");
  for (const btn of lessonBtns) {
    btn.classList.remove("sel-lesson-btn");
  }
};

const markSelectedLessonButton = (selLevel) => {
  unselectAllLessonButton();
  const selButtonId = "btn-lessonid-" + selLevel;
  document.getElementById(selButtonId).classList.add("sel-lesson-btn");
};

const showSpinner = (status) => {
  if (status === true) {
    document.getElementById("spinner-loading").classList.remove("hidden");
    document.getElementById("vocub-cards-display").classList.add("hidden");
  } else {
    document.getElementById("spinner-loading").classList.add("hidden");
    document.getElementById("vocub-cards-display").classList.remove("hidden");
  }
};

const searchVocab = (sWord, allWords) => {
  // console.log (sWord);
  // console.log (allWords);

  const fWords = allWords.filter((iWord) =>
    iWord.word.toLowerCase().includes(sWord)
  );
  // console.log (fWords);
  displayWordsForSelLesson(fWords);
};

const loadLessonButtons = () => {
  const url = "https://openapi.programming-hero.com/api/levels/all";

  fetch(url)
    .then((resp) => resp.json())
    .then((data) => listLessonButtons(data.data))
    .catch((err) => console.log("Error:", err));
};

const listLessonButtons = (lessons) => {
  const buttonWrapper = document.getElementById("vocab-lesson-btns-wrapper");
  // console.log (lessonButtonWrapper);
  buttonWrapper.innerHTML = "";

  lessons.forEach((lesson) => {
    // console.log(lesson);
    const buttonDiv = document.createElement("div");
    buttonDiv.innerHTML = `
                <button id="btn-lessonid-${lesson.level_no}" 
                onclick="loadWordsForSelLesson(${lesson.level_no})"
                class="vocab-lesson-btn btn btn-soft btn-primary btn-lesson">
                <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}</button>
                `;
    buttonWrapper.appendChild(buttonDiv);
  });
};

const loadWordsForSelLesson = (selLevel) => {
  showSpinner(true);
  const url = "https://openapi.programming-hero.com/api/level/" + selLevel;
  // console.log(url);

  fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
      markSelectedLessonButton(selLevel);
      displayWordsForSelLesson(data.data);
      showSpinner(false);
    })
    .catch((err) => console.log("Error:", err));
};

const displayWordsForSelLesson = (words) => {
  // console.log (words);
  const cardWrapper = document.getElementById("vocab-cards-wrapper");
  cardWrapper.innerHTML = "";
  if (words.length === 0) {
    // alert ("No data found");
    cardWrapper.innerHTML = `
          <div id="vocab-msg-nodata" class="col-span-full py-20">
            <img class="mx-auto" src="./assets/alert-error.png" alt="Error!">
            <p class="text-sm">
              <span class="font-bangla">এই</span> Lesson <span class="font-bangla">এ এখনো কোন</span> Vocabulary <span class="font-bangla">যুক্ত করা হয়নি।</span></p>
            <p class="mt-4 font-medium text-4xl">
              <span class="font-bangla">নেক্সট</span> Lesson <span class="font-bangla">এ যান</span></p>
          </div>
    `;
    showSpinner(false);
    return;
  }
  words.forEach((word) => {
    // console.log(word);
    const cardDiv = document.createElement("div");
    cardDiv.innerHTML = `
          <article class="bg-white p-8 rounded-xl h-full">
            <div class="flex flex-col justify-between">
              <div>
                <h3 class="mb-3 font-bold text-3xl">${word.word}</h3>
                <h4 class="mb-8 font-medium text-lg">Meaning / Pronounciation</h4>
                <h3 class="mb-16 font-bangla font-semibold text-3xl">
                ${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / 
                ${
                  word.pronunciation
                    ? word.pronunciation
                    : "উচ্চারন পাওয়া যায়নি"
                }</h3>
              </div>
              <div class="flex justify-between gap-4">
                <button onclick="loadWordDetails(${word.id})" 
                class="bg-[#1a91ff1a] hover:bg-[#1a91ff66] btn"><i class="fa-solid fa-circle-info"></i></button>
                <button onclick="pronounceWord('${word.word}')" 
                class="bg-[#1a91ff1a] hover:bg-[#1a91ff66] btn"><i class="fa-solid fa-volume-high"></i></button>
              </div>
            </div>
          </article>
    `;
    cardWrapper.appendChild(cardDiv);
  });
  showSpinner(false);
};

const loadWordDetails = async (wordId) => {
  const url = "https://openapi.programming-hero.com/api/word/" + wordId;
  // fetch(url)
  //   .then((resp) => resp.json())
  //   .then((data) => popWordDetails(data.data))
  //   .catch((err) => console.log("Error:", err));
  const resp = await fetch(url);
  const dtls = await resp.json();
  popWordDetails(dtls.data);
};

const popWordDetails = (wordinfo) => {
  // console.log(wordinfo);
  const wordDtlsBox = document.getElementById("word-dtls-box");

  wordDtlsBox.innerHTML = `
          <article class="p-6 border-[#EDF7FF] border-2 rounded-xl">
            <h2 class="mb-10 font-semibold text-4xl"><span>${
              wordinfo.word
            }</span>
              (<i class="fa-solid fa-microphone-lines"></i>:
              <span class="font-bangla">${wordinfo.pronunciation}</span> )
            </h2>

            <h3 class="mb-4 font-semibold text-2xl">Meaning</h3>
            <h4 class="mb-10 font-bangla font-medium text-2xl">${
              wordinfo.meaning
            }</h4>

            <h3 class="mb-4 font-semibold text-2xl">Example</h3>
            <h4 class="mb-10 text-2xl">${wordinfo.sentence}</h4>

            <h3 class="mb-4 font-bangla text-2xl">সমার্থক শব্দ গুলো</h3>
            <div class="flex flex-wrap justify-left gap-2">
              ${getWordSynonymElems(wordinfo.synonyms)}
            </div>
          </article>
  `;
  document.getElementById("wordModalDialog").showModal();
};

const getWordSynonymElems = (arrSynos) => {
  // <button class="btn btn-soft btn-primary">Keen</button>
  const htmlStr = arrSynos.map(
    (elem) => `<button class="btn">${elem}</button>`
  );
  return htmlStr.join(" ");
};

loadLessonButtons();

document.getElementById("btn-search-vocab").addEventListener("click", () => {
  showSpinner(true);
  unselectAllLessonButton();

  const fldSearch = document.getElementById("fld-search-vocab");
  const strSearch = fldSearch.value.trim().toLowerCase();
  // console.log(strSearch);

  const url = "https://openapi.programming-hero.com/api/words/all";
  fetch(url)
    .then((resp) => resp.json())
    .then((data) => searchVocab(strSearch, data.data))
    .catch((err) => console.log("Error:", err));
});