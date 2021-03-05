const quizListDiv = document.querySelector(".quizListDiv");
const createBtn = document.querySelector(".createBtn");
const submitBtn = document.querySelector(".submitBtn");

let quizList;
let num = 1;

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
    input.checked = i === answer;

    // mc options
    textarea.className = "choice";
    textarea.rows = 1;
    textarea.cols = 30;
    textarea.innerHTML = options[i] || "";

    mc.appendChild(container);
  }

  const edit = document.createElement("button");
  edit.classList.add(`editBtn-${num - 1}`);
  edit.classList.add(`editBtn`);
  edit.innerHTML = "Edit";
  edit.addEventListener("click", (e) => {
    e.preventDefault();
    const btnClass = edit.className;
    let pos = btnClass.split(" ")[0].split("-")[1];

    let quiz = document.querySelectorAll(".quiz")[pos];
    console.log(quiz);

    let data = {
      id:quizList[pos].id,
      title: "",
      answer: null,
      options: []
    };

    data.title = quiz.childNodes[2].value;
    for (let i = 0; i < quiz.childNodes[5].childNodes.length; i++) {
      if (quiz.childNodes[5].childNodes[i].childNodes[1].textContent === ""
        && quiz.childNodes[5].childNodes[i].childNodes[1].value === "") {
        continue;
      } else {
        data.options.push(quiz.childNodes[5].childNodes[i].childNodes[1].value || quiz.childNodes[5].childNodes[i].childNodes[1].textContent);
      }
      if (quiz.childNodes[5].childNodes[i].childNodes[0].checked) {
        data.answer = i;
      }
    }

    const xhttp = new XMLHttpRequest();
    xhttp.open(
      "PUT",
      `https://webquizlab.herokuapp.com/questions`,
      true,
    );
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const data = JSON.parse(this.responseText);
        console.log(data);
      }
    };
  });

  quizDiv.appendChild(edit);

  num++;
  return quizDiv;
};

createBtn.addEventListener("click", () => {
  const quizDiv = questionForm();

  quizListDiv.appendChild(quizDiv);
});

submitBtn.addEventListener("click", () => {
  let quizArr = [];

  let quizList = document.querySelectorAll(".quiz");
  for (let quiz of quizList) {
    let data = {
      title: "",
      answer: null,
      options: []
    };

    data.title = quiz.childNodes[2].value;
    console.log(data.title);
    for (let i = 0; i < quiz.childNodes[5].childNodes.length; i++) {
      console.log(quiz.childNodes[5].childNodes);
      if (quiz.childNodes[5].childNodes[i].childNodes[1].textContent === ""
        && quiz.childNodes[5].childNodes[i].childNodes[1].value === "") {
        continue;
      } else {
        data.options.push(quiz.childNodes[5].childNodes[i].childNodes[1].textContent || quiz.childNodes[5].childNodes[i].childNodes[1].value);
      }
      if (quiz.childNodes[5].childNodes[i].childNodes[0].checked) {
        data.answer = i;
      }
    }

    if (data.options.length < 2) {
      alert("You need to add at least 2 options");
      return;
    }

    quizArr.push(data);

  }

  const xhttp = new XMLHttpRequest();
  xhttp.open(
    "POST",
    `https://webquizlab.herokuapp.com/questions`,
    true,
  );
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(quizArr));
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const data = JSON.parse(this.responseText);
      console.log(data);
    }
  };
});