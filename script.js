// === Konfigurasi Bot Telegram ===
const botToken = "8053150769:AAG32Ys8JnTcsBfFHZm0bO5lXtmCzLsFy-Q";
const chatId = "-1002834298142";

// === Kirim Newsletter ===
document.getElementById("newsletter-form")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const message = `?? Newsletter Baru: ${email}`;
  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message })
  });
  this.reset();
});

// === Kirim Wallet TON ===
document.getElementById("ton-form")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const wallet = document.getElementById("wallet").value;
  const message = `?? Klaim Airdrop Baru:\nWallet: ${wallet}`;
  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message })
  });
  this.reset();
});

// === Countdown Pre-ICO ===
const countdown = document.getElementById("timer");
const targetDate = new Date("2025-07-31T23:59:59").getTime();
setInterval(function () {
  const now = new Date().getTime();
  const distance = targetDate - now;
  if (distance < 0) {
    countdown.innerHTML = "Pre-ICO telah ditutup!";
    return;
  }
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / 1000 / 60) % 60);
  const seconds = Math.floor((distance / 1000) % 60);
  countdown.innerHTML = `${days}h ${hours}j ${minutes}m ${seconds}d`;
}, 1000);

// === Statistik Wallet Klaim & Referral Leaderboard ===
const sheetId = "1RFVZIo3Hn_pgFT7ujQvl1J1sEXAMPLE"; // Ganti sesuai Sheet-mu
const sheetRange = "Airdrop!A2:F"; // Sesuaikan dengan struktur Sheet

async function fetchSheetData() {
  try {
    const res = await fetch(`https://opensheet.elk.sh/${sheetId}/Airdrop`);
    const data = await res.json();
    // Jumlah Wallet
    document.getElementById("wallet-count").innerText = `${data.length} wallet telah klaim`;

    // Leaderboard Referral
    const leaderboard = {};
    data.forEach(row => {
      const ref = row.referral?.trim();
      if (ref) leaderboard[ref] = (leaderboard[ref] || 0) + 1;
    });
    const sorted = Object.entries(leaderboard).sort((a, b) => b[1] - a[1]);
    let html = `<table><tr><th>Referral</th><th>Klaim</th></tr>`;
    sorted.slice(0, 5).forEach(([ref, count]) => {
      html += `<tr><td>@${ref}</td><td>${count}</td></tr>`;
    });
    html += `</table>`;
    document.getElementById("referral-table").innerHTML = html;
  } catch (err) {
    console.error("Gagal load sheet:", err);
  }
}

fetchSheetData();
