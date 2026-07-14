const menuButton = document.querySelector(".menu-button");
const mobileNav = document.querySelector(".mobile-nav");
const tabButtons = document.querySelectorAll(".tab-button");
const panels = document.querySelectorAll(".dashboard-panel");
const assessmentRange = document.querySelector("#assessmentRange");
const seatRange = document.querySelector("#seatRange");
const consultingSelect = document.querySelector("#consultingSelect");
const priceTotal = document.querySelector("#priceTotal");
const priceDetail = document.querySelector("#priceDetail");
const demoForm = document.querySelector(".demo-form");
const hrmFile = document.querySelector("#hrmFile");
const fileStatus = document.querySelector("#fileStatus");
const projectNotes = document.querySelector("#projectNotes");
const loadDemoData = document.querySelector("#loadDemoData");
const rankEmployees = document.querySelector("#rankEmployees");
const matchResults = document.querySelector("#matchResults");
const simulateLab = document.querySelector("#simulateLab");
const labStatus = document.querySelector("#labStatus");
const eventStream = document.querySelector("#eventStream");
const skillOutput = document.querySelector("#skillOutput");
const passportSummary = document.querySelector("#passportSummary");
const detectedSummary = document.querySelector("#detectedSummary");

let employeeRows = [];

const demoEmployees = [
  {
    name: "Sara Rahman",
    role: "Mechanical Technician",
    skills: "fault isolation, precision repair, pressure tolerance, adaptive troubleshooting, shift handoff",
    notes: "Strong recovery after failed first attempt. Calm under interruption. Best in ambiguous sensor faults.",
  },
  {
    name: "Omar Ali",
    role: "Maintenance Lead",
    skills: "fast execution, tool sequencing, baseline diagnostics, production line speed",
    notes: "Very fast on familiar faults. Needs clearer procedure when the signal is ambiguous.",
  },
  {
    name: "Leena Haddad",
    role: "Assembly Specialist",
    skills: "precision consistency, procedural recall, documentation, quality checks",
    notes: "Excellent repeatability. Strong for regulated work, slower when constraints suddenly change.",
  },
  {
    name: "Yousef Nasser",
    role: "Field Technician",
    skills: "creative troubleshooting, constraint creativity, remote repair, stress adaptability",
    notes: "Strong in messy environments. Good pattern transfer across unfamiliar equipment.",
  },
];

menuButton.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tab = button.dataset.tab;

    tabButtons.forEach((item) => item.classList.toggle("active", item === button));
    panels.forEach((panel) => panel.classList.toggle("active", panel.id === tab));
  });
});

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function updatePrice() {
  const assessments = Number(assessmentRange.value);
  const seats = Number(seatRange.value);
  const consulting = Number(consultingSelect.value);
  const assessmentCost = assessments * 14;
  const seatCost = seats * 95;
  const platformBase = 1100;
  const total = platformBase + assessmentCost + seatCost + consulting;
  const consultingLabel = consultingSelect.options[consultingSelect.selectedIndex].text;

  priceTotal.textContent = formatCurrency(total);
  priceDetail.textContent = `${assessments.toLocaleString()} assessments, ${seats} seats, ${consultingLabel.toLowerCase()}`;
}

[assessmentRange, seatRange, consultingSelect].forEach((control) => {
  control.addEventListener("input", updatePrice);
});

demoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = demoForm.querySelector("button");
  button.textContent = "Pilot request captured";
  button.disabled = true;

  window.setTimeout(() => {
    button.textContent = "Request pilot";
    button.disabled = false;
  }, 2200);
});

function splitCsvLine(line) {
  const cells = [];
  let cell = "";
  let insideQuotes = false;

  for (const character of line) {
    if (character === "\"") {
      insideQuotes = !insideQuotes;
    } else if (character === "," && !insideQuotes) {
      cells.push(cell.trim());
      cell = "";
    } else {
      cell += character;
    }
  }

  cells.push(cell.trim());
  return cells;
}

function parseEmployeeText(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const headers = splitCsvLine(lines[0]).map((header) => header.toLowerCase());
  const findColumn = (...names) => headers.findIndex((header) => names.some((name) => header.includes(name)));
  const nameIndex = findColumn("name", "employee");
  const roleIndex = findColumn("role", "title", "job");
  const skillsIndex = findColumn("skill", "competenc");
  const notesIndex = findColumn("note", "comment", "project", "summary");

  return lines.slice(1).map((line, index) => {
    const cells = splitCsvLine(line);
    return {
      name: cells[nameIndex] || `Employee ${index + 1}`,
      role: cells[roleIndex] || "Employee",
      skills: cells[skillsIndex] || cells.join(" "),
      notes: cells[notesIndex] || cells.join(" "),
    };
  });
}

function scoreEmployee(employee, projectText) {
  const combinedEmployeeText = `${employee.skills} ${employee.notes}`.toLowerCase();
  const projectWords = extractKeywords(projectText);
  const uniqueWords = [...new Set(projectWords)];
  const matches = uniqueWords.filter((word) => combinedEmployeeText.includes(word));
  const strongSignals = ["fault", "pressure", "precision", "troubleshooting", "ambiguous", "handoff", "urgent", "sensor"];
  const signalBonus = strongSignals.filter((signal) => {
    return projectText.toLowerCase().includes(signal) && combinedEmployeeText.includes(signal);
  }).length;
  const score = Math.min(97, 62 + matches.length * 4 + signalBonus * 5);

  return {
    ...employee,
    score,
    matches,
    reason: matches.slice(0, 4).join(", ") || "general skill overlap",
  };
}

function extractKeywords(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3);
}

function greedyRankEmployees(employees, projectText, limit = 4) {
  const remainingNeeds = new Set(extractKeywords(projectText));
  const availableEmployees = employees.map((employee) => scoreEmployee(employee, projectText));
  const selectedEmployees = [];

  while (availableEmployees.length && selectedEmployees.length < limit) {
    let bestIndex = 0;
    let bestValue = -Infinity;

    availableEmployees.forEach((employee, index) => {
      const uncoveredMatches = employee.matches.filter((match) => remainingNeeds.has(match));
      const coverageValue = uncoveredMatches.length * 9;
      const qualityValue = employee.score;
      const value = qualityValue + coverageValue;

      if (value > bestValue) {
        bestValue = value;
        bestIndex = index;
      }
    });

    const [chosenEmployee] = availableEmployees.splice(bestIndex, 1);
    const contribution = chosenEmployee.matches.filter((match) => remainingNeeds.has(match));

    contribution.forEach((match) => remainingNeeds.delete(match));
    selectedEmployees.push({
      ...chosenEmployee,
      contribution,
      score: Math.min(98, chosenEmployee.score + contribution.length * 2),
      remainingNeedCount: remainingNeeds.size,
    });
  }

  return selectedEmployees;
}

function renderMatches() {
  const notes = projectNotes.value.trim();

  if (!employeeRows.length) {
    matchResults.innerHTML = '<div class="result-empty">Upload an HRM export or use demo data first.</div>';
    return;
  }

  if (!notes) {
    matchResults.innerHTML = '<div class="result-empty">Add project notes so Auctor can compare skills against the work.</div>';
    return;
  }

  const rankedEmployees = greedyRankEmployees(employeeRows, notes, 4);

  matchResults.innerHTML = rankedEmployees
    .map((employee, index) => {
      const contributionText = employee.contribution.length
        ? employee.contribution.slice(0, 4).join(", ")
        : employee.reason;

      return `
        <div class="employee-result">
          <div class="rank">${index + 1}</div>
          <div>
            <strong>${employee.name}</strong>
            <span>${employee.role} - greedy contribution: ${contributionText}</span>
            <small>${index === 0 ? "Selected first because this employee creates the highest immediate project fit." : "Selected next because this employee adds useful coverage after prior picks."}</small>
          </div>
          <b>${employee.score}%</b>
        </div>
      `;
    })
    .join("");
}

hrmFile.addEventListener("change", () => {
  const file = hrmFile.files[0];

  if (!file) {
    return;
  }

  if (file.name.toLowerCase().endsWith(".xlsx") || file.name.toLowerCase().endsWith(".xls")) {
    employeeRows = demoEmployees;
    fileStatus.textContent = `${file.name} selected. Backend Excel parsing would run here; demo data loaded for this static prototype.`;
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    employeeRows = parseEmployeeText(String(reader.result));
    fileStatus.textContent = `${file.name} loaded with ${employeeRows.length} employee rows.`;
  });
  reader.readAsText(file);
});

loadDemoData.addEventListener("click", () => {
  employeeRows = demoEmployees;
  projectNotes.value =
    "Urgent line fault isolation project. High pressure environment, precision required, ambiguous sensor failure, shift handoff, adaptive troubleshooting.";
  fileStatus.textContent = "Demo HRM employee data loaded.";
  renderMatches();
});

rankEmployees.addEventListener("click", renderMatches);

simulateLab.addEventListener("click", () => {
  const events = eventStream.querySelectorAll("span");
  const skillScores = [
    ["Resilience", 91],
    ["Spatial reasoning", 88],
    ["Adaptive logic", 86],
    ["Precision", 82],
  ];

  labStatus.textContent = "Analyzing CTL behavior...";
  detectedSummary.innerHTML = `
    <strong>Detected example</strong>
    <span>Tracking LEGO movement, pauses, build order, and recovery pattern.</span>
  `;
  events.forEach((event) => event.classList.remove("detected"));
  skillOutput.innerHTML = skillScores
    .map(([skill]) => `<div><span>${skill}</span><strong>...</strong></div>`)
    .join("");

  events.forEach((event, index) => {
    window.setTimeout(() => {
      event.classList.add("detected");

      if (index === events.length - 1) {
        labStatus.textContent = "Cognitive Passport generated";
        skillOutput.innerHTML = skillScores
          .map(([skill, score]) => `<div><span>${skill}</span><strong>${score}%</strong></div>`)
          .join("");
        passportSummary.innerHTML = `
          <strong>Sara Rahman</strong>
          <span>Best fit: ambiguous fault isolation</span>
          <small>Detected high recovery speed, strong spatial reasoning, and adaptive build strategy from the LEGO CTL session.</small>
        `;
        detectedSummary.innerHTML = `
          <strong>Detected in session</strong>
          <span>2.4s hesitation after failed build, 3 strategy changes, corrected sequence without guidance, high precision on final structure.</span>
        `;
      }
    }, 260 * (index + 1));
  });
});

updatePrice();
