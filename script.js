
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
  }

  const quizForm = document.getElementById("quizForm");
  if (quizForm) {
    const cards = [...document.querySelectorAll(".question-card")];
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const submitBtn = document.getElementById("submitBtn");
    const errorBox = document.getElementById("quizError");
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");
    const progressPercent = document.getElementById("progressPercent");
    let step = 0;

    function updateQuizUI() {
      cards.forEach((card, index) => card.classList.toggle("active", index === step));
      const percent = Math.round(((step + 1) / cards.length) * 100);
      progressBar.style.width = percent + "%";
      progressText.textContent = `السؤال ${step + 1} من ${cards.length}`;
      progressPercent.textContent = percent + "%";
      prevBtn.disabled = step === 0;
      nextBtn.classList.toggle("hidden", step === cards.length - 1);
      submitBtn.classList.toggle("hidden", step !== cards.length - 1);
      errorBox.textContent = "";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function currentAnswered() {
      const name = `q${step + 1}`;
      return !!quizForm.querySelector(`input[name="${name}"]:checked`);
    }

    nextBtn.addEventListener("click", () => {
      if (!currentAnswered()) {
        errorBox.textContent = "اختاري إجابة قبل الانتقال للسؤال التالي.";
        return;
      }
      step++;
      updateQuizUI();
    });

    prevBtn.addEventListener("click", () => {
      if (step > 0) step--;
      updateQuizUI();
    });

    cards.forEach(card => {
      card.querySelectorAll("input[type='radio']").forEach(input => {
        input.addEventListener("change", () => {
          errorBox.textContent = "";
        });
      });
    });

    quizForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!currentAnswered()) {
        errorBox.textContent = "اختاري إجابة قبل عرض النتيجة.";
        return;
      }

      const scores = { calm: 0, leader: 0, adventure: 0, social: 0 };
      const formData = new FormData(quizForm);
      for (const answer of formData.values()) {
        if (scores.hasOwnProperty(answer)) scores[answer]++;
      }

      const max = Math.max(...Object.values(scores));
      const winners = Object.keys(scores).filter(key => scores[key] === max);
      const personality = winners[Math.floor(Math.random() * winners.length)];

      localStorage.setItem("personality", personality);
      localStorage.setItem("personalityScores", JSON.stringify(scores));
      window.location.href = "result.html";
    });

    updateQuizUI();
  }

  const resultTitle = document.getElementById("resultTitle");
  if (resultTitle) {
    const personality = localStorage.getItem("personality");

    const data = {
      calm: {
        image: "images/calm-result.PNG",
        title: "الشخصية الهادئة",
        description: "أنت شخص يميل إلى الهدوء والاستقرار والتفكير قبل اتخاذ القرارات. تلاحظ التفاصيل وتحب المساحات المريحة والواضحة.",
        traits: ["متزنة", "صبورة", "ملاحِظة", "تفكر قبل القرار"]
      },
      leader: {
        image: "images/leader-result.PNG",
        title: "الشخصية القيادية",
        description: "أنت شخص مبادر وواثق، تحب الإنجاز وتحمل المسؤولية وتستمتع بتحويل الأفكار إلى خطوات واضحة.",
        traits: ["مبادرة", "واثقة", "عملية", "تحب الإنجاز"]
      },
      adventure: {
        image: "images/adventure-result.PNG",
        title: "الشخصية المغامرة",
        description: "تحب التجارب الجديدة والتغيير، ولديك فضول لاكتشاف أماكن وأفكار مختلفة، وتستمتع بكسر الروتين.",
        traits: ["فضولية", "مرنة", "جريئة", "تحب التجديد"]
      },
      social: {
        image: "images/social-result.PNG",
        title: "الشخصية الاجتماعية",
        description: "أنت شخص يحب التواصل والأجواء الدافئة، تستمتع بمشاركة اللحظات مع الآخرين وتضيف طاقة جميلة للمكان.",
        traits: ["ودودة", "متعاونة", "مرِحة", "تحب التواصل"]
      }
    };

    const resultDescription = document.getElementById("resultDescription");
    const resultIcon = document.getElementById("resultImage");
    const traits = document.getElementById("traits");

    if (personality && data[personality]) {
      resultIcon.src = data[personality].image;
      resultTitle.textContent = data[personality].title;
      resultDescription.textContent = data[personality].description;
      traits.innerHTML = data[personality].traits.map(t => `<span>${t}</span>`).join("");
    } else {
      traits.innerHTML = `<span>ابدئي الاختبار أولًا ✨</span>`;
    }
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = document.getElementById("contactMessage");
      msg.textContent = "تم إرسال رسالتك بنجاح — شكرًا لتواصلك معنا 💕";
      contactForm.reset();
    });
  }
});
