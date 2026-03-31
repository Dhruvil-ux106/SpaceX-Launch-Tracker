const launchesDiv = document.getElementById("launches");
const loader = document.getElementById("loader");

let allLaunches = [];

// 🚀 Fetch SpaceX Data
async function fetchLaunches() {
  loader.style.display = "block";

  try {
    const res = await fetch("https://api.spacexdata.com/v4/launches");
    const data = await res.json();

    loader.style.display = "none";

    allLaunches = data;
    displayLaunches(data);

  } catch (err) {
    console.log(err);
  }
}

// 🎬 Display Launches
function displayLaunches(launches) {
  launchesDiv.innerHTML = "";

  launches.map(launch => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${launch.name}</h3>
      <p>${new Date(launch.date_utc).toDateString()}</p>
      <p class="${launch.success ? 'success' : 'fail'}">
        ${launch.success ? "Success ✅" : "Failed ❌"}
      </p>
    `;

    launchesDiv.appendChild(div);
  });
}

// 🔍 Search (basic for now)
document.getElementById("searchInput").addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  const filtered = allLaunches.filter(l =>
    l.name.toLowerCase().includes(value)
  );

  displayLaunches(filtered);
});

// 🚀 Initial Load
fetchLaunches();