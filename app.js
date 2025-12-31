// ==================== بيانات البداية ====================
let patients = JSON.parse(localStorage.getItem("patients") || "[]");
let employees = JSON.parse(localStorage.getItem("employees") || "[]");

// ==================== تسجيل الدخول ====================
function login() {
  const code = document.getElementById("mainCode").value.trim();

  // إخفاء شاشة الدخول
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("employeePanel").classList.add("hidden");
  document.getElementById("patientPanel").classList.add("hidden");

  if (code === "Lab2025") {
    // دخول الموظف
    document.getElementById("employeePanel").classList.remove("hidden");
    loadPatients();
  } else {
    // دخول المريض
    showPatientResults(code);
    document.getElementById("patientPanel").classList.remove("hidden");
  }
}

// ==================== إضافة مريض ====================
function addPatient() {
  const name = document.getElementById("newPatientName").value.trim();
  const age = document.getElementById("newPatientAge").value.trim();
  const code = document.getElementById("newPatientCode").value.trim();
  if (!name || !age || !code) return alert("اكمل بيانات المريض");

  patients.push({ name, age, code, results: [] });
  localStorage.setItem("patients", JSON.stringify(patients));
  alert("تم إضافة المريض");
  loadPatients();
}

// ==================== إضافة موظف ====================
function addEmployee() {
  const name = document.getElementById("empName").value.trim();
  const code = document.getElementById("empCode").value.trim();
  if (!name || !code) return alert("اكمل بيانات الموظف");

  employees.push({ name, code });
  localStorage.setItem("employees", JSON.stringify(employees));
  alert("تم إضافة الموظف");
}

// ==================== تحميل المرضى في قائمة المريض ====================
function loadPatients() {
  const select = document.getElementById("patientSelect");
  select.innerHTML = "";
  patients.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.code;
    opt.textContent = p.name + " - " + p.code;
    select.appendChild(opt);
  });
}

// ==================== عرض نتائج المريض ====================
function showPatientResults(code) {
  const patient = patients.find(p => p.code === code);
  const box = document.getElementById("patientResults");
  box.innerHTML = "";

  if (!patient) return alert("كود المريض غير موجود");

  patient.results.forEach(r => {
    box.innerHTML += `<h4>${r.test}</h4>`;
    for (let k in r.values) {
      if (r.values[k])
        box.innerHTML += `<div>${k}: ${r.values[k]}</div>`;
    }
    box.innerHTML += "<hr>";
  });
}

// ==================== إرسال WhatsApp ====================
function sendWhatsApp() {
  const resultText = encodeURIComponent(document.getElementById("patientResults").innerText);
  if (!resultText) return alert("لا توجد نتائج للإرسال");
  window.open(`https://wa.me/?text=${resultText}`, "_blank");
}

// ==================== CBC ====================
function saveCBC() {
  const code = document.getElementById("patientSelect").value;
  const patient = patients.find(p => p.code === code);
  if (!patient) return;

  const cbcResult = {
    test: "CBC",
    date: new Date().toLocaleDateString(),
    values: {
      Hb: hb.value, RBC: rbc.value, HCT: hct.value, MCV: mcv.value,
      MCH: mch.value, MCHC: mchc.value, RDW: rdw.value, WBC: wbc.value,
      Neutrophils: neut.value, Lymphocytes: lymph.value, Monocytes: mono.value,
      Eosinophils: eos.value, Basophils: baso.value, Platelets: plt.value, MPV: mpv.value
    }
  };

  patient.results.push(cbcResult);
  localStorage.setItem("patients", JSON.stringify(patients));
  alert("تم حفظ CBC");
}

// ==================== الكيمياء الحيوية ====================
const bioTests = {
  sugar: ["FBS","RBS","PPBS","HbA1c","OGTT"],
  liver: ["ALT","AST","ALP","GGT","Total Bilirubin","Direct Bilirubin","Indirect Bilirubin","Albumin","Total Protein","A/G Ratio"],
  kidney: ["Urea","Creatinine","Uric Acid","BUN","Creatinine Clearance"],
  lipid: ["Total Cholesterol","Triglycerides","HDL","LDL","VLDL","Cholesterol/HDL Ratio"],
  electrolytes: ["Sodium","Potassium","Chloride","Calcium","Ionized Calcium","Phosphorus","Magnesium","Iron","Ferritin","TIBC"],
  thyroid: ["TSH","Total T3","Total T4","Free T3","Free T4","Anti TPO","Anti TG"],
  hormones: ["Insulin","C-Peptide","Cortisol","FSH","LH","Prolactin","Testosterone","Estrogen","Progesterone"],
  cardiac: ["CK","CK-MB","Troponin I","Troponin T","LDH","Myoglobin"],
  tumor: ["AFP","CEA","CA-125","CA 19-9","PSA Total","PSA Free"],
  vitamins: ["Vitamin D","Vitamin B12","Folic Acid"]
};

function loadBioTests() {
  const category = document.getElementById("bioCategory").value;
  const testSelect = document.getElementById("bioTest");
  testSelect.innerHTML = "";
  if (!bioTests[category]) return;
  bioTests[category].forEach(t => {
    const opt = document.createElement("option");
    opt.value = t; opt.textContent = t;
    testSelect.appendChild(opt);
  });
}

function saveBio() {
  const code = document.getElementById("patientSelect").value;
  const patient = patients.find(p => p.code === code);
  if (!patient) return;
  const bioResult = {
    test: document.getElementById("bioTest").value,
    date: new Date().toLocaleDateString(),
    values: { Result: document.getElementById("bioResult").value }
  };
  patient.results.push(bioResult);
  localStorage.setItem("patients", JSON.stringify(patients));
  alert("تم حفظ التحليل الكيميائي");
}

// ==================== Urine ====================
function saveUrine() {
  const code = document.getElementById("patientSelect").value;
  const patient = patients.find(p => p.code === code);
  if (!patient) return;

  const urine = {
    test: "Urine Complete",
    date: new Date().toLocaleDateString(),
    values: {
      Color: urColor.value, Appearance: urAppearance.value, SG: urSG.value, pH: urPH.value,
      Protein: urProtein.value, Glucose: urGlucose.value, Ketone: urKetone.value, Blood: urBlood.value,
      Pus: urPus.value, RBCs: urRBC.value, Epithelial: urEpi.value,
      Amorphous: urAmorphous.value, Crystals: urCrystals.value, Casts: urCasts.value, Bacteria: urBacteria.value,
      Culture: urCulture.value, Organism: urOrganism.value
    }
  };

  patient.results.push(urine);
  localStorage.setItem("patients", JSON.stringify(patients));
  alert("تم حفظ Urine");
}

// ==================== Stool ====================
function saveStool() {
  const code = document.getElementById("patientSelect").value;
  const patient = patients.find(p => p.code === code);
  if (!patient) return;

  const stool = {
    test: "Stool Complete",
    date: new Date().toLocaleDateString(),
    values: {
      Color: stColor.value, Consistency: stCons.value, Mucus: stMucus.value, Blood: stBlood.value,
      Pus: stPus.value, RBCs: stRBC.value, Ova: stOva.value, Parasite: stParasite.value,
      Cyst: stCyst.value, HPylori: stHpy.value, Culture: stCulture.value, Organism: stOrganism.value
    }
  };

  patient.results.push(stool);
  localStorage.setItem("patients", JSON.stringify(patients));
  alert("تم حفظ Stool");
}