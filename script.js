
const matchesContainer = document.getElementById("matches-container");
const tableContainer = document.getElementById("table-container");
const clubsContainer = document.getElementById("clubs-container");

const API_URL = "https://api.football-data.org/v4";

async function apiRequest(endpoint) {
  const response = await fetch(API_URL + endpoint, {
    headers: {
      "X-Auth-Token": "f39522e9848549fd988502f81df28f70"
    }
  });

  if (!response.ok) {
    throw new Error("API Error: " + response.status);
  }

  return response.json();
}

async function loadMatches() {
  try {
    matchesContainer.innerHTML = "جاري تحميل المباريات...";

    const data = await apiRequest("/competitions/PD/matches");

    if (!data.matches.length) {
      matchesContainer.innerHTML = "لا توجد مباريات متاحة حالياً";
      return;
    }

    matchesContainer.innerHTML = data.matches.map(match => `
      <div class="match-card">
        <h3>${match.homeTeam.name}</h3>
        <p>${match.status === "FINISHED"
          ? match.score.fullTime.home + " - " + match.score.fullTime.away
          : "ضد"}</p>
        <h3>${match.awayTeam.name}</h3>
        <small>${new Date(match.utcDate).toLocaleString("ar-EG")}</small>
        <p>${match.status}</p>
      </div>
    `).join("");

  } catch (error) {
    matchesContainer.innerHTML = "خطأ: " + error.message;
    console.error(error);
  }
}

async function loadTable() {
  try {
    const data = await apiRequest("/competitions/PD/standings");
    const teams = data.standings[0].table;

    tableContainer.innerHTML = `
      <table>
        <tr>
          <th>المركز</th>
          <th>النادي</th>
          <th>النقاط</th>
        </tr>
        ${teams.map(team => `
          <tr>
            <td>${team.position}</td>
            <td>${team.team.name}</td>
            <td>${team.points}</td>
          </tr>
        `).join("")}
      </table>
    `;
  } catch (error) {
    tableContainer.innerHTML = "تعذر تحميل جدول الترتيب";
    console.error(error);
  }
}

async function loadClubs() {
  try {
    const data = await apiRequest("/competitions/PD/teams");

    clubsContainer.innerHTML = data.teams.map(team => `
      <div class="club-card">
        <img src="${team.crest}" alt="${team.name}">
        <h3>${team.name}</h3>
      </div>
    `).join("");

  } catch (error) {
    clubsContainer.innerHTML = "تعذر تحميل الأندية";
    console.error(error);
  }
}

loadMatches();
loadTable();
loadClubs();
