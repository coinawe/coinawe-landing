// === Inisialisasi AOS ===
AOS.init();

// === Telegram Bot ===
const botToken = "8053150769:AAG32Ys8JnTcsBfFHZm0bO5lXtmCzLsFy-Q";
const chatId = "-1002834298142";

// === Form Newsletter ===
const form = document.getElementById("newsletter-form");
form?.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const message = `📰 Newsletter Baru:\nEmail: ${email}`;
  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message }),
  }).then(() => {
    alert("Terima kasih telah berlangganan!");
    form.reset();
  });
});

// === Form Airdrop ===
const tonForm = document.getElementById("ton-form");
tonForm?.addEventListener("submit", function (e) {
  e.preventDefault();
  const wallet = document.getElementById("wallet").value.trim();
  const botToken = "8053150769:AAG32Ys8JnTcsBfFHZm0bO5lXtmCzLsFy-Q";
  const chatId = "-1002834298142";

  fetch("https://script.google.com/macros/s/AKfycbwwj3ay9ifXYLfRTzd7kls0uA6JxTeNFjgBO6Pyh38fDFYsunYHDRoAnWPqoJ_Hsskg/exec", {
    method: "POST",
    body: new URLSearchParams({ wallet })
  })
    .then(res => res.text())
    .then((response) => {
      alert(response);
      if (response.includes("berhasil")) {
        tonForm.reset();
        // Kirim ke Telegram jika sukses klaim pertama kali
        const message = `🪂 Klaim Airdrop Baru:\nWallet TON: ${wallet}`;
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: message }),
        });
      }
    })
    .catch(() => alert("❌ Gagal klaim. Silakan coba lagi."));
});
// === Tombol Copy Wallet Escrow ===
document.getElementById("copy-btn")?.addEventListener("click", () => {
  const code = document.getElementById("wallet-target").innerText;
  navigator.clipboard.writeText(code).then(() => {
    alert("Alamat escrow disalin!");
  });
});

// === Form Pembelian Token ===
const buyForm = document.getElementById("buy-form");
buyForm?.addEventListener("submit", function (e) {
  e.preventDefault();

  const wallet = document.getElementById("wallet-buy").value.trim();
  const amount = document.getElementById("ton-amount").value.trim();
  const txhash = document.getElementById("txhash").value.trim();
  const ref = document.getElementById("ref").value.trim();

  if (!txhash.startsWith("0x") || txhash.length < 10) {
    return alert("Isi TX Hash yang valid (contoh mulai dengan 0x...)");
  }

  const params = new URLSearchParams({ wallet, amount, txhash, ref });
  const scriptURL = "https://script.google.com/macros/s/AKfycbwwj3ay9ifXYLfRTzd7kls0uA6JxTeNFjgBO6Pyh38fDFYsunYHDRoAnWPqoJ_Hsskg/exec";

  fetch(scriptURL, { method: "POST", body: params })
    .then(res => res.text())
    .then(response => {
      alert(response);
      if (response.toLowerCase().includes("berhasil")) {
        const message = `💰 Pembelian Token AWEWE:\nWallet: ${wallet}\nTON: ${amount}\nTX Hash: ${txhash}\nReferral: ${ref || "-"}`;
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: message }),
        });
        buyForm.reset();
      }
    })
    .catch(() => alert("❌ Gagal kirim bukti. Coba lagi."));
});


// === Hitung Mundur (Countdown ke akhir Pre-ICO) ===
const countdown = () => {
  const end = new Date("2025-11-30T00:00:00Z").getTime();
  const timer = document.getElementById("timer");
  setInterval(() => {
    const now = new Date().getTime();
    const distance = end - now;
    if (distance < 0) {
      timer.innerHTML = "⛔ Pre-ICO Selesai";
      return;
    }
    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);
    timer.innerHTML = `⏳ ${d}h ${h}j ${m}m ${s}d`;
  }, 1000);
};
countdown();

// === Proteksi Anti Ctrl+U / F12 / Inspect Element ===
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("keydown", function (e) {
  if (
    e.ctrlKey && ["u", "s", "i", "c"].includes(e.key.toLowerCase()) ||
    e.key === "F12"
  ) {
    e.preventDefault();
  }
});
document.addEventListener("dragstart", (e) => e.preventDefault());
document.addEventListener("selectstart", (e) => e.preventDefault());

(function () {
  const detectDevTools = () => {
    const start = performance.now();
    debugger;
    const end = performance.now();
    if (end - start > 100) {
      document.body.innerHTML =
        `<h1 style="color:red; text-align:center; margin-top:20%;">❌ Akses tidak diizinkan.</h1>`;
    }
  };
  setInterval(detectDevTools, 500);
})();
