/* 3D Statue — site interactions */
(function(){
  "use strict";

  /* ---- mobile nav + dropdown ---- */
  var burger = document.querySelector(".burger"),
      nav = document.querySelector(".nav");
  if (burger && nav) {
    burger.addEventListener("click", function(){ nav.classList.toggle("open"); });
  }
  document.querySelectorAll(".drop > button").forEach(function(btn){
    btn.addEventListener("click", function(e){
      e.stopPropagation();
      var d = btn.parentElement, was = d.classList.contains("open");
      document.querySelectorAll(".drop.open").forEach(function(x){ x.classList.remove("open"); });
      if (!was) d.classList.add("open");
    });
  });
  document.addEventListener("click", function(){
    document.querySelectorAll(".drop.open").forEach(function(x){ x.classList.remove("open"); });
  });

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".faq-item").forEach(function(item){
    var q = item.querySelector(".faq-q"), a = item.querySelector(".faq-a");
    q.addEventListener("click", function(){
      var open = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function(o){
        o.classList.remove("open"); o.querySelector(".faq-a").style.maxHeight = null;
      });
      if (!open) { item.classList.add("open"); a.style.maxHeight = a.scrollHeight + "px"; }
    });
  });

  /* ---- reveal on scroll ---- */
  var io = ("IntersectionObserver" in window) ? new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, {threshold:.12}) : null;
  document.querySelectorAll(".rv").forEach(function(el){ io ? io.observe(el) : el.classList.add("in"); });

  /* ---- enquiry form ----
     Set WHATSAPP_NUMBER to the studio's WhatsApp number (e.g. "919876543210")
     once known. Until then the form opens a WhatsApp share sheet with the
     enquiry pre-filled so the visitor can send it to the studio chat. */
  var WHATSAPP_NUMBER = "";
  var form = document.getElementById("enquiry-form");
  if (form) {
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var name = form.querySelector("[name=name]").value.trim(),
          phone = form.querySelector("[name=phone]").value.trim(),
          type = form.querySelector("[name=type]").value,
          msg = form.querySelector("[name=message]").value.trim();
      if (!name || !phone) { alert("Please add your name and phone number."); return; }
      var text = "New 3D Statue enquiry\nName: " + name + "\nPhone: " + phone +
                 "\nInterested in: " + type + (msg ? "\nDetails: " + msg : "");
      var url = WHATSAPP_NUMBER
        ? "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text)
        : "https://wa.me/?text=" + encodeURIComponent(text);
      window.open(url, "_blank", "noopener");
      form.style.display = "none";
      var ok = document.getElementById("form-ok");
      if (ok) ok.style.display = "block";
      ok.scrollIntoView({behavior:"smooth", block:"center"});
    });
  }

  /* ---- footer year ---- */
  document.querySelectorAll("[data-year]").forEach(function(el){ el.textContent = new Date().getFullYear(); });
})();
