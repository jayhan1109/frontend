const quizListDiv = document.querySelector(".quizListDiv");
const submitBtn = document.querySelector(".submitBtn");

let quizList;
let num = 1;
let answer = [];

window.addEventListener("load", () => {
  const xhttp = new XMLHttpRequest();
  xhttp.open(
    "GET",
    `https://webquizlab.herokuapp.com/questions`,
    true,
  );
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      quizList = JSON.parse(this.responseText);
      console.log(quizList);
      for (let q of quizList) {
        let quizDiv = questionForm(q.title, q.answer, q.options);
        answer.push(q.answer);
        quizListDiv.appendChild(quizDiv);
      }
    }
  };
});

const questionForm = (title = "", answer = 0, options = []) => {
  const quizDiv = document.createElement("div");
  quizDiv.classList.add("quiz");
  const quizTitle = document.createElement("p");
  quizTitle.innerHTML = `Question ${num}`;
  quizDiv.appendChild(quizTitle);
  quizDiv.appendChild(document.createElement("br"));

  // text area for question
  const textareaQuestion = document.createElement("textarea");
  textareaQuestion.rows = 5;
  textareaQuestion.cols = 50;
  textareaQuestion.required = true;
  textareaQuestion.innerHTML = title;
  textareaQuestion.setAttribute("disabled", "disabled");
  quizDiv.appendChild(textareaQuestion);
  quizDiv.appendChild(document.createElement("br"));

  // answer title
  const answerTitle = document.createElement("p");
  answerTitle.innerHTML = "Answer*";
  quizDiv.appendChild(answerTitle);

  // creates div block that holds mc options
  const mc = document.createElement("div");
  mc.className = "mc";
  quizDiv.appendChild(mc);

  // generates mc choice options
  for (let i = 0; i < 4; i++) {
    const container = document.createElement("div");
    const input = document.createElement("input");
    const textarea = document.createElement("textarea");
    container.appendChild(input);
    container.appendChild(textarea);

    // radio button
    input.type = "radio";
    input.name = `q${num}`;
    input.required = true;

    // mc options
    textarea.className = "choice";
    textarea.rows = 1;
    textarea.cols = 30;
    textarea.setAttribute("disabled", "disabled");
    textarea.innerHTML = options[i] || "";

    mc.appendChild(container);
  }

  num++;
  return quizDiv;
};


submitBtn.addEventListener("click", () => {
  let quizList = document.querySelectorAll(".quiz");
  let ans = [];
  for (let quiz of quizList) {

    for (let i = 0; i < quiz.childNodes[5].childNodes.length; i++) {
      if (quiz.childNodes[5].childNodes[i].childNodes[0].checked) {
        ans.push(i);
      }
    }
  }

  console.log(ans);
  console.log(answer);

  let grade = 0;
  for (let i = 0; i < ans.length; i++) {
    if (ans[i] === answer[i]) {
      grade++;
    }
  }

  alert(`Your score: ${grade}/${ans.length}`);
});