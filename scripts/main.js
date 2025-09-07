// console.log("Connected");

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
                <button onclick="loadWordsForSelLesson(${lesson.level_no})"
                class="vocab-lesson-btn btn btn-soft btn-primary">
                <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}</button>
                `;
    buttonWrapper.appendChild(buttonDiv);
  });
};

const loadWordsForSelLesson = (selLevel) => {
  document.getElementById("vocab-cards-missing").hidden = true;

  const url = "https://openapi.programming-hero.com/api/level/" + selLevel;
  console.log(url);

  fetch(url)
    .then((resp) => resp.json())
    .then((data) => displayWordsForSelLesson(data.data))
    .catch((err) => console.log("Error:", err));
};

const displayWordsForSelLesson = (words) => {
  // console.log (words);
  const cardWrapper = document.getElementById("vocab-cards-wrapper");
  cardWrapper.innerHTML = "";

  words.forEach((word) => {
    console.log(word);
    const cardDiv = document.createElement("div");
    // cardDiv.innerHTML = `
    //       <article class="bg-white p-14 rounded-xl h-full">
    //         <h3 class="mb-3 font-bold text-3xl">${word.word}</h3>
    //         <h4 class="mb-8 font-medium text-lg">Meaning / Pronounciation</h4>
    //         <h3 class="mb-16 font-bangla font-semibold text-3xl">${word.meaning} / ${word.pronunciation}</h3>
    //         <div class="flex justify-between gap-4">
    //           <button class="bg-[#1a91ff1a] hover:bg-[#1a91ff66] btn"><i class="fa-solid fa-circle-info"></i></button>
    //           <button class="bg-[#1a91ff1a] hover:bg-[#1a91ff66] btn"><i class="fa-solid fa-volume-high"></i></button>
    //         </div>
    //       </article>`;
    cardDiv.innerHTML = `
          <article class="bg-white p-14 rounded-xl h-full">
            <div class="flex flex-col justify-between">
              <div>
                <h3 class="mb-3 font-bold text-3xl">${word.word}</h3>
                <h4 class="mb-8 font-medium text-lg">Meaning / Pronounciation</h4>
                <h3 class="mb-16 font-bangla font-semibold text-3xl">${word.meaning} / ${word.pronunciation}</h3>
              </div>
              <div class="flex justify-between gap-4">
                <button class="bg-[#1a91ff1a] hover:bg-[#1a91ff66] btn"><i class="fa-solid fa-circle-info"></i></button>
                <button class="bg-[#1a91ff1a] hover:bg-[#1a91ff66] btn"><i class="fa-solid fa-volume-high"></i></button>
              </div>
            </div>
          </article>
    `;
    cardWrapper.appendChild(cardDiv);
  });
};

loadLessonButtons();
