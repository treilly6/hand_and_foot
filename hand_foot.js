class Game {
  constructor() {
    this.teams = {}
    this.round = 1
  }
}

var GameData = {
  "game":new Game(),
  "scoreTable": {
    "2":20,
    "3":5,
    "4":5,
    "5":5,
    "6":5,
    "7":5,
    "8":10,
    "9":10,
    "10":10,
    "J":10,
    "Q":10,
    "K":10,
    "A":20,
    "Joker":50,
  },
  "bookScores" : {
    "pure": 500,
    "impure":300,
  },
}

$(document).ready(function(){
    console.log("GAME ELEMENT MADE");
    console.log(GameData.game);

    $('#bookCountModalBtn').on('click', function() {
      console.log("IN THE CLIKCS");
      console.log(this);
      let teams = document.querySelector("#bookTeamsList").children;


      for (let team of teams) {
        console.log(team.innerText);
        if (!isNaN(team.querySelector(".pure").value)) {
          GameData.game.teams[team.innerText] += (GameData.bookScores["pure"] * Number(team.querySelector(".pure").value));
        }

        if (!isNaN(team.querySelector(".impure").value)) {
          GameData.game.teams[team.innerText] += (GameData.bookScores["impure"] * Number(team.querySelector(".impure").value));
        }

        team.querySelector(".pure").value = "";
        team.querySelector(".impure").value = "";
      }

      console.log("YEET");
      console.log(GameData);

      document.querySelector("#bookCountModal").style.display = "";
      // function that updates the scores based on book values
      // function that clears the inputs for each team
      updateScores();
      updateRound();
    });

});



function gameController() {
  console.log("GONNA MAKE A NEW GAME")

  resetGame();

  // add teams function
  openTeamModal();

  // count scores

  //
}


function resetGame() {
  GameData.game = new Game();
  let modalList = document.querySelector("#modalTeamsList").children;
  let teamList = document.querySelector("#teamsList").children;
  for (var i = modalList.length - 1; i >= 0; i--) {
    modalList[i].remove();
  }
  for (var i = teamList.length - 1; i >= 0; i--) {
    teamList[i].remove();
  }

  document.querySelector(".teamNameTurn").innerHTML = "";
  document.querySelector("#roundCounter").innerHTML = "1";
  document.querySelector("#turnCount").innerHTML = "0";
  clearCardCount();
}


function openTeamModal() {
  addTeamModal = document.querySelector("#addTeamsModal");
  if (addTeamModal.style.display == "") {
    addTeamModal.style.display = "flex";
  }
}

function addTeam(button) {
  /*
  Controls adding teams functionality
  Once user clicks add team button, the team is added
  to the gameObj.teams (which is a dictionary) and a list element of team name is
  inserted into the team list html and modal team list html
  */
  let input = button.previousElementSibling;
  let teamName = input.value;
  input.value = "";

  let li = document.createElement("li");
  li.classList.add("liTeamName");

  li.innerHTML = "<span class='teamName'>" + teamName + "</span>";
  let liClone = li.cloneNode(true);
  let bookModalClone = li.cloneNode(true);

  liClone.setAttribute("onclick","selectTeam(this)");
  liClone.innerHTML += "<span class='teamScore'>0</span>";

  bookModalClone.classList.add("bookTeam");
  bookModalClone.innerHTML += "<input class='pure mx-auto' type='text'><input class='impure mx-auto' type='text'>";

  let addModalTeamList = document.querySelector("#modalTeamsList");
  let bookTeamList = document.querySelector("#bookTeamsList");
  let teamList = document.querySelector("#teamsList");

  addModalTeamList.appendChild(li);
  bookTeamList.appendChild(bookModalClone);
  teamList.appendChild(liClone);

  GameData.game.teams[teamName] = 0;
}

function closeModal(div) {
  modal = div.closest(".modal_container");
  modal.style.display = "";
}


function plusCount(span) {
  let card = span.closest(".cardCount").querySelector(".cardValue").innerHTML;
  let cardValue = GameData.scoreTable[card];
  let turnCountValue = document.querySelector("#turnCount");
  turnCountValue.innerHTML =  Number(turnCountValue.innerHTML) + cardValue;

  let count = span.previousElementSibling;
  count.innerHTML = Number(count.innerHTML) + 1;
}


function negCount(span) {
  let count = span.nextElementSibling;
  if (Number(count.innerHTML) == 0) {
    return
  }

  let card = span.closest(".cardCount").querySelector(".cardValue").innerHTML;
  let cardValue = GameData.scoreTable[card];
  let turnCountValue = document.querySelector("#turnCount");
  turnCountValue.innerHTML = Number(turnCountValue.innerHTML) - cardValue;

  count.innerHTML = Number(count.innerHTML) - 1;
}


function endCurrentTurn() {
  console.log("END TUNR FUNC");
  let turnCount = document.querySelector("#turnCount");
  let currentTeam = document.querySelector(".teamNameTurn");
  let teamName = currentTeam.innerHTML.slice(0,-7);

  teamsList = document.querySelector("#teamsList").children;
  for (let team of teamsList) {
    if (team.querySelector(".teamName").innerHTML == teamName) {
      let score = team.querySelector(".teamScore");
      score.innerHTML = Number(score.innerHTML) + Number(turnCount.innerHTML);
    }
  }

  GameData.game.teams[teamName] += Number(turnCount.innerHTML);

  turnCount.innerHTML = "0";

  clearCardCount();
  console.log("DONE");
}


function selectTeam(elem) {
  let teamsList = document.querySelector("#teamsList").children
  for (let team of teamsList) {
    if (team.classList.contains("selectedTeam")) {
      team.classList.remove("selectedTeam");
    }
  }
  elem.classList.add("selectedTeam");

  let team = elem.querySelector(".teamName").innerHTML;
  let teamNameTurn = document.querySelector(".teamNameTurn");
  teamNameTurn.innerHTML = team + "'s Turn"
}

function clearCardCount() {
  let cardCounts = document.querySelectorAll(".count");
  for (let count of cardCounts) {
    if (count.innerHTML != "0" ) {
      count.innerHTML = "0";
    }
  }
}

function endRound() {
  console.log("GONNA END THE ROUND");
  let bookModal = document.querySelector("#bookCountModal")
  bookModal.style.display = "flex";
}

function updateRound() {
  console.log("UPDATEING THE ROGUND");
  let currentRound = document.querySelector("#roundCounter");
  if (currentRound.innerHTML < 3) {
    currentRound.innerHTML = Number(currentRound.innerHTML) + 1;
    GameData.game.round += 1;
  } else {
    let max = -1;
    let winningTeam;
    for (const [team, score] of Object.entries(GameData.game.teams)) {
      if (score > max) {
        winningTeam = team;
        max = score;
      }
    }
    alert("GAME OVER, The winning team is  " + winningTeam + " with a score of " + max);
  }
}

function updateScores() {
  console.log("UPDATING THE SCORES");
  teamList = document.querySelector("#teamsList").children;
  console.log("HERE THE TEAM LST");
  for (let team of teamList) {
    console.log("for");
    teamName = team.querySelector(".teamName").innerHTML;
    console.log(teamName);
    team.querySelector(".teamScore").innerHTML = GameData.game.teams[teamName];
  }
}
