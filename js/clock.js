function updateDateTime() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const formattedDate = now.toLocaleDateString('id-ID', options);
    
    document.getElementById('datetime').textContent = formattedDate;
}

// Memanggil fungsi pertama kali untuk menampilkan waktu saat halaman dimuat
updateDateTime();

// Mengupdate setiap detik
setInterval(updateDateTime, 1000);
