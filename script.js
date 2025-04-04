const today = new Date();

function updateCalendar() {
  const log = JSON.parse(localStorage.getItem("goldClickerLog")) || [];
  const container = document.getElementById("calendar");
  container.innerHTML = "";
  const table = document.createElement("table");
  container.appendChild(table);

  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let header = document.createElement("tr");
  ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"].forEach(day => {
    let th = document.createElement("th");
    th.textContent = day;
    header.appendChild(th);
  });
  table.appendChild(header);

  let row = document.createElement("tr");
  let date = new Date(year, month, 1);
  let dayOfWeek = (date.getDay() + 6) % 7;
  for (let i = 0; i < dayOfWeek; i++) {
    row.appendChild(document.createElement("td"));
  }

  for (let d = 1; d <= daysInMonth; d++) {
    let currentDate = new Date(year, month, d);
    let day = currentDate.getDay();
    let cell = document.createElement("td");
    let dateStr = currentDate.toISOString().split("T")[0];
    cell.textContent = d;

    if (log.includes(dateStr)) {
      cell.classList.add("done");
    } else if (currentDate < today) {
      cell.classList.add("missed");
    }

    cell.onclick = () => toggleDay(dateStr);
    row.appendChild(cell);

    if (row.children.length === 7) {
      table.appendChild(row);
      row = document.createElement("tr");
    }
  }

  if (row.children.length > 0) {
    table.appendChild(row);
  }

  renderGraph(log, year, month);
}

function toggleDay(dateStr) {
  let log = JSON.parse(localStorage.getItem("goldClickerLog")) || [];
  const index = log.indexOf(dateStr);
  if (index === -1) {
    log.push(dateStr);
  } else {
    log.splice(index, 1);
  }
  localStorage.setItem("goldClickerLog", JSON.stringify(log));
  updateCalendar();
}

function renderGraph(log, year, month) {
  const canvasContainer = document.getElementById("performanceGraph");
  canvasContainer.innerHTML = "<canvas id='graphCanvas' width='600' height='200'></canvas>";
  const ctx = document.getElementById('graphCanvas').getContext('2d');
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const labels = [];
  const data = [];

  for (let i = 1; i <= daysInMonth; i++) {
    let date = new Date(year, month, i);
    if (date.getDay() === 6 || date.getDay() === 0) continue;
    let dateStr = date.toISOString().split("T")[0];
    labels.push(i.toString());
    data.push(log.includes(dateStr) ? 1 : 0);
  }

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Splnené dni',
        data: data,
        backgroundColor: data.map(v => v ? '#4caf50' : '#e53935')
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 1,
          ticks: { stepSize: 1 }
        }
      }
    }
  });
}

window.onload = updateCalendar;
