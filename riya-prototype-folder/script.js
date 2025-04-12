let annotations = [];
const video = document.getElementById("video");
const startTimeLabel = document.getElementById("start-time");
const endTimeLabel = document.getElementById("end-time");
const segmentsTable = document.getElementById("segments-table-body");
const downloadLink = document.getElementById("download-link");

let slider;
let currentRange = [0, 10]; // default values in seconds

video.addEventListener("loadedmetadata", () => {
  const duration = video.duration;

  slider = document.getElementById("range-slider");
  noUiSlider.create(slider, {
    start: [0, Math.min(10, duration)],
    connect: true,
    range: {
      min: 0,
      max: duration
    },
    step: 0.1,
    tooltips: [true, true],
    format: {
      to: (val) => parseFloat(val).toFixed(2),
      from: (val) => parseFloat(val)
    }
  });

  slider.noUiSlider.on("update", (values) => {
    currentRange = values.map(parseFloat);
    updateTimeLabels(currentRange);
  });

  updateTimeLabels(currentRange);
});

function updateTimeLabels([start, end]) {
  startTimeLabel.textContent = formatTime(start);
  endTimeLabel.textContent = formatTime(end);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function addSegment() {
  const [start, end] = currentRange;
  const action = document.getElementById("action-command").value.trim();
  const reasoning = document.getElementById("reasoning").value.trim();

  if (!action || !reasoning || end <= start) {
    alert("Please provide valid annotation data.");
    return;
  }

  const segment = {
    start_time: parseFloat(start),
    end_time: parseFloat(end),
    action_command: action,
    reasoning: reasoning
  };

  annotations.push(segment);
  renderSegments();
  clearInputs();
}

function renderSegments() {
  segmentsTable.innerHTML = "";
  annotations.forEach(seg => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${formatTime(seg.start_time)}</td>
      <td>${formatTime(seg.end_time)}</td>
      <td>
        <strong>${seg.action_command}</strong><br/>
        <small>${seg.reasoning}</small>
      </td>
    `;
    segmentsTable.appendChild(row);
  });
}

function clearInputs() {
  document.getElementById("action-command").value = "";
  document.getElementById("reasoning").value = "";
}

function saveAnnotations() {
  alert("Annotations saved locally. Use Export to download.");
}

function exportAnnotations() {
  const json = JSON.stringify(annotations, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  downloadLink.href = url;
  downloadLink.download = "annotations.json";
  downloadLink.style.display = "inline";
  downloadLink.textContent = "Download annotations.json";
}


document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("video");
    const startLabel = document.getElementById("start-time");
    const endLabel = document.getElementById("end-time");
  
    const slider = document.getElementById("range-slider");
  
    video.addEventListener("loadedmetadata", () => {
      const duration = video.duration;
  
      noUiSlider.create(slider, {
        start: [0, Math.min(10, duration)],
        connect: true,
        range: {
          min: 0,
          max: duration
        },
        step: 0.1,
        tooltips: true,
        format: {
          to: (val) => parseFloat(val).toFixed(2),
          from: (val) => parseFloat(val)
        }
      });
  
      slider.noUiSlider.on("update", (values) => {
        const [start, end] = values.map(parseFloat);
        startLabel.textContent = formatTime(start);
        endLabel.textContent = formatTime(end);
      });
    });
  });
  
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }
  