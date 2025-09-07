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
  const url = "https://openapi.programming-hero.com/api/level/"+selLevel;
  // console.log (url);

  document.getElementById("vocab-cards-missing").hidden = true;
}

loadLessonButtons();
