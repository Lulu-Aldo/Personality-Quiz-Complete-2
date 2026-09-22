document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (menuToggle && navLinks) menuToggle.addEventListener("click", () => navLinks.classList.toggle("open"));

  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(a => { if (a.getAttribute("href") === currentPage) a.classList.add("active"); });

  const quizForm = document.getElementById("quizForm");
  if (quizForm) {
    const slides = [...document.querySelectorAll(".quiz-step")];
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const submitBtn = document.getElementById("submitBtn");
    const errorBox = document.getElementById("quizError");
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");
    const progressPercent = document.getElementById("progressPercent");
    const userName = document.getElementById("userName");
    let step = 0;

    function updateQuizUI() {
      slides.forEach((card, index) => card.classList.toggle("active", index === step));
      const questionNumber = Math.max(0, step);
      const percent = Math.round((questionNumber / 6) * 100);
      progressBar.style.width = percent + "%";
      progressText.textContent = step === 0 ? "البيانات الأساسية" : `السؤال ${step} من 6`;
      progressPercent.textContent = percent + "%";
      prevBtn.disabled = step === 0;
      nextBtn.classList.toggle("hidden", step === slides.length - 1);
      submitBtn.classList.toggle("hidden", step !== slides.length - 1);
      errorBox.textContent = "";
      window.scrollTo({top:0,behavior:"smooth"});
    }

    function validCurrentStep() {
      if (step === 0) {
        if (!userName.value.trim()) { errorBox.textContent = "اكتبي اسمك أولًا لبدء الاختبار."; userName.focus(); return false; }
        return true;
      }
      const checked = quizForm.querySelector(`input[name="q${step}"]:checked`);
      if (!checked) { errorBox.textContent = "اختاري إجابة قبل الانتقال للسؤال التالي."; return false; }
      return true;
    }

    nextBtn.addEventListener("click", () => {
      if (!validCurrentStep()) return;
      if (step === 0) localStorage.setItem("quizUserName", userName.value.trim());
      step++; updateQuizUI();
    });
    prevBtn.addEventListener("click", () => { if(step>0){step--;updateQuizUI();} });
    quizForm.addEventListener("change", () => errorBox.textContent = "");
    userName.addEventListener("input", () => errorBox.textContent = "");

    quizForm.addEventListener("submit", e => {
      e.preventDefault(); if (!validCurrentStep()) return;
      const scores = {calm:0,leader:0,adventure:0,social:0};
      const formData = new FormData(quizForm);
      for (const answer of formData.values()) if (Object.prototype.hasOwnProperty.call(scores,answer)) scores[answer]++;
      const max = Math.max(...Object.values(scores));
      const priority = ["calm","leader","adventure","social"];
      const personality = priority.find(key => scores[key] === max);
      localStorage.setItem("quizUserName", userName.value.trim());
      localStorage.setItem("personality", personality);
      localStorage.setItem("personalityScores", JSON.stringify(scores));
      location.href = "result.html";
    });
    updateQuizUI();
  }

  const resultTitle = document.getElementById("resultTitle");
  if (resultTitle) {
    const personality = localStorage.getItem("personality");
    const userName = localStorage.getItem("quizUserName") || "";
    const data = {
      calm:{image:"images/calm-result.PNG",title:"الشخصية الهادئة",description:"تميلين إلى الهدوء والاستقرار والتفكير قبل اتخاذ القرارات. تلاحظين التفاصيل وتفضلين الوضوح والمساحات المريحة.",traits:["متزنة","صبورة","ملاحِظة","تفكر قبل القرار"]},
      leader:{image:"images/leader-result.PNG",title:"الشخصية القيادية",description:"تميلين إلى المبادرة وتحمل المسؤولية، وتستمتعين بتحويل الأفكار إلى خطوات واضحة والوصول إلى النتائج.",traits:["مبادرة","واثقة","عملية","تحب الإنجاز"]},
      adventure:{image:"images/adventure-result.PNG",title:"الشخصية المغامرة",description:"تحبين التجارب الجديدة والتغيير، ولديك فضول لاكتشاف أفكار وأماكن مختلفة وكسر الروتين.",traits:["فضولية","مرنة","جريئة","تحب التجديد"]},
      social:{image:"images/social-result.PNG",title:"الشخصية الاجتماعية",description:"تحبين التواصل والأجواء الدافئة، وتستمتعين بمشاركة اللحظات مع الآخرين والعمل بروح الفريق.",traits:["ودودة","متعاونة","مرِحة","تحب التواصل"]}
    };
    const greeting = document.getElementById("resultGreeting");
    const description = document.getElementById("resultDescription");
    const image = document.getElementById("resultImage");
    const traits = document.getElementById("traits");
    if (personality && data[personality]) {
      const r=data[personality]; greeting.textContent = userName ? `${userName}، نتيجتك الأقرب هي` : "نتيجتك الأقرب هي";
      image.src=r.image; image.alt=r.title; resultTitle.textContent=r.title; description.textContent=r.description;
      traits.innerHTML=r.traits.map(t=>`<span>${t}</span>`).join("");
    } else {
      greeting.textContent="لم يتم تسجيل نتيجة بعد"; image.style.display="none"; traits.innerHTML="<span>ابدئي الاختبار أولًا</span>";
    }
  }
});
