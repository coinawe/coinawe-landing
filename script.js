// Ganti dengan URL Web App kamu
const API_URL = "https://old-unit-f8e2.collerbayu.workers.dev/";

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({ behavior: "smooth" });
  });
});

// Parallax background animasi (jika ada)
window.addEventListener("scroll", () => {
  const bg = document.querySelector(".airdrop-background");
  if (bg) {
    bg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }
});

// Scroll animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-show");
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".animate").forEach(el => observer.observe(el));

// Validasi TON wallet address
const isValidTonAddress = (addr) => {
  return /^([UEQ][a-zA-Z0-9_-]{47,60})$/.test(addr);
};

// Form klaim airdrop
const form = document.getElementById("ton-form");
const walletInput = document.getElementById("wallet");
const walletCount = document.getElementById("wallet-count");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const wallet = walletInput.value.trim();

  if (!isValidTonAddress(wallet)) {
    alert("❌ Masukkan alamat wallet TON yang valid.");
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet })
    });

    const data = await res.json();

    if (data.status === "success") {
      alert(data.message);
      walletInput.value = "";
      loadWalletCount(); // refresh count
    } else {
      alert(data.message || "⚠️ Terjadi kesalahan.");
    }
  } catch (err) {
    console.error(err);
    alert("❌ Gagal terhubung ke server.");
  }
});

// Ambil jumlah klaim wallet
async function loadWalletCount() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    walletCount.textContent = `💸 Sudah ${data.count} wallet berpartisipasi dalam airdrop.`;
  } catch (err) {
    walletCount.textContent = "Gagal memuat data wallet.";
  }
}

loadWalletCount(); // Inisialisasi saat halaman dibuka