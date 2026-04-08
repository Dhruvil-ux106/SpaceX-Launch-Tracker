const launchesDiv = document.getElementById("launches");
const loader = document.getElementById("loader");

let allLaunches = [];

// 🚀 Fetch Data
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

    let status = "Upcoming 🚀";
    let statusClass = "";

    if (launch.success === true) {
      status = "Success ✅";
      statusClass = "success";
    } else if (launch.success === false) {
      status = "Failed ❌";
      statusClass = "fail";
    }

    div.innerHTML = `
      <h3>${launch.name}</h3>
      <p>${new Date(launch.date_utc).toDateString()}</p>
      <p class="${statusClass}">${status}</p>
      <button class="fav">❤️</button>
    `;

    // ⭐ Favorites
    div.querySelector(".fav").addEventListener("click", () => {
      let favs = JSON.parse(localStorage.getItem("favs")) || [];
      favs.push(launch);
      localStorage.setItem("favs", JSON.stringify(favs));
      alert("Added to favorites!");
    });

    launchesDiv.appendChild(div);
  });
}

// 🔍 SEARCH (HOF: filter)
document.getElementById("searchInput").addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  const filtered = allLaunches.filter(l =>
    l.name.toLowerCase().includes(value)
  );

  displayLaunches(filtered);
});

// 🔽 FILTER (HOF: filter)
document.getElementById("filter").addEventListener("change", (e) => {
  const value = e.target.value;

  let filtered = allLaunches.filter(l => {
    if (value === "upcoming") return l.success === null;
    if (value === "success") return l.success === true;
    if (value === "failed") return l.success === false;
    return true;
  });

  displayLaunches(filtered);
});

// 🔼 SORT (HOF: sort)
document.getElementById("sort").addEventListener("change", (e) => {
  let sorted = [...allLaunches];

  sorted.sort((a, b) => {
    if (e.target.value === "dateAsc") return new Date(a.date_utc) - new Date(b.date_utc);
    if (e.target.value === "dateDesc") return new Date(b.date_utc) - new Date(a.date_utc);
    if (e.target.value === "az") return a.name.localeCompare(b.name);
    if (e.target.value === "za") return b.name.localeCompare(a.name);
  });

  displayLaunches(sorted);
});

// ⭐ VIEW FAVORITES
document.getElementById("viewFavs").addEventListener("click", () => {
  let favs = JSON.parse(localStorage.getItem("favs")) || [];
  displayLaunches(favs);
});

// 🌙 DARK MODE
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// 🚀 Initial Load
fetchLaunches();