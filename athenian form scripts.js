<script>
/* ---------- BACK‑END URL (public Web‑App /exec) ---------- */
const BASE_URL =
  "https://script.google.com/macros/s/AKfycbxUdsRHKhHcYzHKngCq-c7l9ISbYPIuPEawzjwqKdISkvR2_JN9A6UVxWOnKfbssAndSA/exec";

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- DOM shortcuts ---------- */
  const form        = document.getElementById("submissionForm");
  const courseSel   = document.getElementById("course");
  const codeInp     = document.getElementById("courseCode");
  const spinner     = document.getElementById("spinner");
  const thankYou    = document.getElementById("thankYou");
  const firstName   = document.getElementById("firstName");
  const lastName    = document.getElementById("lastName");
  const emailInput  = document.getElementById("email");
  const phoneInput  = document.getElementById("phone");
  const cityInput   = document.getElementById("city");
  const fileInput   = document.getElementById("fileUpload");
  const submitBtn   = form.querySelector('button[type="submit"],input[type="submit"]');
  const today       = new Date();

  /* ---------- helper: show / clear inline errors ---------- */
  function showErr(id, msg) {
    const span = document.getElementById(id + "Err");
    if (!span) return;
    span.textContent = msg;
    span.style.display = "inline";
    document.getElementById(id).classList.add("invalid");
  }
  function clearErr(id) {
    const span = document.getElementById(id + "Err");
    if (!span) return;
    span.textContent = "";
    span.style.display = "none";
    document.getElementById(id).classList.remove("invalid");
  }

  /* ========== GLOBAL callback for JSONP ========== */
  window.populateCourses = list => {
    const show = list
      .filter(c => new Date(c["Form Close Date"]) >= today)
      .sort((a,b) => new Date(a["Form Close Date"])-new Date(b["Form Close Date"]))
      .slice(0,2);

    courseSel.innerHTML = '<option value="">Select a Course</option>';
    show.forEach(c => {
      const opt = document.createElement("option");
      opt.text  = c["Book Title"];
      opt.value = c["Book Title"];
      opt.dataset.courseCode = c["Course Number"];
      courseSel.appendChild(opt);
    });
  };

  /* inject JSONP script AFTER callback defined */
  const jsonp = document.createElement("script");
  jsonp.src = BASE_URL + "?callback=populateCourses&nocache=" + Date.now();
  document.body.appendChild(jsonp);

  courseSel.addEventListener("change", () => {
    const sel = courseSel.selectedOptions[0];
    codeInp.value = sel ? sel.dataset.courseCode : "";
  });

  /* ========== submit handler ========== */
  form.addEventListener("submit", ev => {
    ev.preventDefault();
    spinner.style.display = "block";

    /* clear previous errors */
    ["firstName","lastName","city","email","phone","course","fileUpload"]
      .forEach(clearErr);

    let firstInvalid = null;

    /* required text inputs */
    if (!firstName.value.trim()){ showErr("firstName","Required."); firstInvalid ||= firstName; }
    if (!lastName.value.trim()){  showErr("lastName","Required.");  firstInvalid ||= lastName; }
    if (!cityInput.value.trim()){ showErr("city","Required.");      firstInvalid ||= cityInput; }

    /* email must contain @ */
    const emailVal = emailInput.value.trim();
    if (!emailVal){ showErr("email","Required."); firstInvalid ||= emailInput; }
    else if (!/@/.test(emailVal)){ showErr("email",'Must include “@”.'); firstInvalid ||= emailInput; }

    /* phone optional but 10 digits if entered */
    const digits = phoneInput.value.replace(/\D/g,"");
    if (digits && digits.length !== 10){
      showErr("phone","Must be 10 digits."); firstInvalid ||= phoneInput;
    }

    /* course required */
    if (!courseSel.value){
      showErr("course","Select a course."); firstInvalid ||= courseSel;
    }

    /* file required */
    const file = fileInput.files[0];
    if (!file){
      showErr("fileUpload","Please attach a file.");
      firstInvalid ||= fileInput;
    }

    if (firstInvalid){
      spinner.style.display = "none";
      firstInvalid.focus();
      return;
    }

    /* ---------- lock the button to avoid duplicate clicks ---------- */
    submitBtn.disabled = true;
    submitBtn.style.opacity = 0.6;

    /* ---------- build payload ---------- */
    const data = {
      spreadsheetId : form.spreadsheetId.value,
      firstName : firstName.value,
      lastName  : lastName.value,
      email     : emailInput.value,
      city      : cityInput.value,
      phone     : phoneInput.value,
      course    : courseSel.value,
      courseCode: codeInp.value,
      fileName  : "",
      fileData  : ""
    };

    /* read file & submit */
    const reader = new FileReader();
    reader.onload = e => {
      data.fileData = e.target.result.split(",")[1];
      const ext = file.name.split('.').pop();
      data.fileName = `${data.courseCode} - ${data.lastName}, ${data.firstName}.${ext}`;
      send(data);
    };
    reader.readAsDataURL(file);
  });

  /* ---------- ajax submit ---------- */
  function send(payload){
    fetch(BASE_URL,{
      method:"POST",
      mode:"no-cors",
      body:JSON.stringify(payload)
    })
    .then(() => {
      spinner.style.display = "none";
      form.style.display    = "none";
      thankYou.style.display= "block";
    })
    .catch(() => {
      spinner.style.display = "none";
      /* allow retry on failure */
      submitBtn.disabled = false;
      submitBtn.style.opacity = 1;
      alert("Network error; please try again.");
    });
  }
});
</script>
