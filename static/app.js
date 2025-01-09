let attempts = 0;
let index = 0;
let timer;

function appStart() {
  const displayGameover = () => {
    const div = document.createElement("div");
    div.innerText = "게임이 종료되었습니다.";
    div.style = `
      display: flex; 
      justify-content: center; 
      align-items: center; 
      position: absolute; 
      top: 40vh; 
      left: 43vw; 
      background-color: white; 
      border: 1px solid black; 
      width: 200px; 
      height: 50px;
      z-index: 1000;
    `;
    document.body.appendChild(div);
  };

  const nextLine = () => {
    if (attempts === 6) {
      gameover();
      return;
    }
    attempts++;
    index = 0;
  };

  const gameover = () => {
    window.removeEventListener("keydown", handleKeydown);
    document
      .querySelectorAll(".keyboard-column")
      .forEach((key) =>
        key.removeEventListener("click", handleVirtualKeyClick)
      );
    displayGameover();
    clearInterval(timer);
  };

  const handleEnterKey = async () => {
    let 맞은_개수 = 0;
    const 응답 = await fetch("/answer");
    console.log("응답", 응답);
    const 정답_객체 = 응답.json();
    console.log("정답 객체", 정답_객체);
    const 정답 = 정답_객체.answer;
    console.log("정답", 정답);

    if (index !== 5) return;
    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-block[data-index='${attempts}${i}']`
      );
      if (block) {
        const 입력한_글자 = block.innerText;
        const 정답_글자 = 정답[i];
        if (입력한_글자 === 정답_글자) {
          맞은_개수 += 1;
          block.style.background = "#6AAA64";
        } else if (정답.includes(입력한_글자))
          block.style.background = "#C9B458";
        else block.style.background = "#787C7E";
        block.style.color = "white";
        console.log("입력한 글자:", 입력한_글자, "정답_글자:", 정답_글자);
      }
    }
    if (맞은_개수 === 5) gameover();
    else nextLine();
  };

  const handleKeydown = (event) => {
    const key = event.key.toUpperCase();
    handleKeyPress(key);
  };

  const handleVirtualKeyClick = (event) => {
    const key = event.target.getAttribute("data-key");
    handleKeyPress(key);
  };

  const handleKeyPress = (key) => {
    if (key === "ENTER") {
      handleEnterKey();
      return;
    }

    if (key === "BACK" || key === "BACKSPACE") {
      if (index > 0) {
        index--;
        const thisBlock = document.querySelector(
          `.board-block[data-index='${attempts}${index}']`
        );
        if (thisBlock) {
          thisBlock.innerText = "";
        }
      }
      return;
    }

    if (/^[A-Z]$/.test(key) && index < 5) {
      const thisBlock = document.querySelector(
        `.board-block[data-index='${attempts}${index}']`
      );
      if (thisBlock && !thisBlock.innerText) {
        thisBlock.innerText = key;
        index++;
      }
    }
  };

  const startTimer = () => {
    const 시작_시간 = new Date();
    function setTime() {
      const 현재_시간 = new Date();
      const 흐른_시간 = new Date(현재_시간 - 시작_시간);
      const 분 = 흐른_시간.getMinutes().toString().padStart(2, "0");
      const 초 = 흐른_시간.getSeconds().toString().padStart(2, "0");
      const timeDiv = document.querySelector("#timer");
      timeDiv.innerText = `${분}:${초}`;
    }
    timer = setInterval(setTime, 1000);
  };

  startTimer();

  window.addEventListener("keydown", handleKeydown);
  document
    .querySelectorAll(".keyboard-column")
    .forEach((key) => key.addEventListener("click", handleVirtualKeyClick));
}

appStart();
