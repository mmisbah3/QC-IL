document.addEventListener("DOMContentLoaded", function () {

  window.showForm = function (form) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const buttons = document.querySelectorAll('.form-toggle button');

    if (form === 'login') {
      loginForm.classList.remove('hidden');
      signupForm.classList.add('hidden');
      buttons[0].classList.add('active');
      buttons[1].classList.remove('active');
    } else {
      loginForm.classList.add('hidden');
      signupForm.classList.remove('hidden');
      buttons[0].classList.remove('active');
      buttons[1].classList.add('active');
    }
  };

  window.togglePassword = function (id, icon) {
    const input = document.getElementById(id);
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
  };

  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-sun');
    icon.classList.toggle('fa-moon');
  });

});const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
// Tunggu hingga seluruh halaman HTML dimuat
document.addEventListener('DOMContentLoaded', function () {

  // --- START: Konfigurasi Firebase ---
  // TODO: Ganti dengan konfigurasi proyek Firebase Anda sendiri
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  // --- END: Konfigurasi Firebase ---

  // Inisialisasi Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const googleProvider = new firebase.auth.GoogleAuthProvider();

  // --- Elemen-elemen DOM ---
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const showLoginBtn = document.getElementById('showLoginBtn');
  const showSignupBtn = document.getElementById('showSignupBtn');
  const themeToggleBtn = document.getElementById('themeToggle');
  const googleLoginBtn = document.getElementById('googleLoginBtn');
  const googleSignupBtn = document.getElementById('googleSignupBtn');
  const togglePasswordIcons = document.querySelectorAll('.toggle-password');

  // --- Logika untuk Beralih Form (Login/Sign Up) ---
  function showForm(formName) {
    if (formName === 'login') {
      loginForm.classList.remove('hidden');
      signupForm.classList.add('hidden');
      showLoginBtn.classList.add('active');
      showSignupBtn.classList.remove('active');
    } else {
      loginForm.classList.add('hidden');
      signupForm.classList.remove('hidden');
      showLoginBtn.classList.remove('active');
      showSignupBtn.classList.add('active');
    }
  }

  showLoginBtn.addEventListener('click', () => showForm('login'));
  showSignupBtn.addEventListener('click', () => showForm('signup'));

  // --- Logika untuk Menampilkan/Menyembunyikan Password ---
  function togglePassword(event) {
    const icon = event.target;
    const input = icon.previousElementSibling;
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    // Ganti ikon mata
    icon.classList.toggle('fa-eye-slash');
  }

  togglePasswordIcons.forEach(icon => {
    icon.addEventListener('click', togglePassword);
  });

  // --- Logika untuk Mengganti Tema (Dark/Light) ---
  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDarkMode = document.body.classList.contains('dark-theme');
    themeToggleBtn.innerHTML = isDarkMode ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
  });

  // --- Fungsi-fungsi Autentikasi Firebase ---

  // Daftar dengan Email dan Password
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const name = document.getElementById('signupName').value;

    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Berhasil mendaftar
        const user = userCredential.user;
        // Update profil pengguna dengan nama
        return user.updateProfile({
          displayName: name
        }).then(() => {
          alert('Pendaftaran berhasil! Selamat datang, ' + name);
          // Anda bisa mengarahkan pengguna ke halaman lain di sini
          window.location.href = 'index.html';
        });
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.error("Error pendaftaran:", error);
        alert('Gagal mendaftar: ' + errorMessage);
      });
  });

  // Login dengan Email dan Password
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Berhasil login
        const user = userCredential.user;
        alert('Login berhasil! Selamat datang kembali, ' + (user.displayName || user.email));
        // Arahkan ke halaman utama setelah login berhasil
        window.location.href = 'index.html';
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.error("Error login:", error);
        alert('Gagal login: ' + errorMessage);
      });
  });

  // Login dengan Google
  const signInWithGoogle = () => {
    auth.signInWithPopup(googleProvider)
      .then((result) => {
        const user = result.user;
        alert('Berhasil masuk dengan Google! Selamat datang, ' + user.displayName);
        // Arahkan ke halaman utama
        window.location.href = 'index.html';
      }).catch((error) => {
        const errorMessage = error.message;
        console.error("Error Google sign-in:", error);
        alert('Gagal masuk dengan Google: ' + errorMessage);
      });
  };

  googleLoginBtn.addEventListener('click', signInWithGoogle);
  googleSignupBtn.addEventListener('click', signInWithGoogle);

  // --- Memantau Status Autentikasi ---
  // Fungsi ini akan berjalan setiap kali status login pengguna berubah.
  auth.onAuthStateChanged((user) => {
    if (user) {
      // Pengguna sudah login.
      console.log('Pengguna sudah login:', user);
      // Jika pengguna sudah login dan berada di halaman login,
      // Anda bisa langsung mengarahkannya ke halaman utama.
      // if (window.location.pathname.includes('loginpage.html')) {
      //   window.location.href = 'index.html';
      // }
    } else {
      // Pengguna sudah logout.
      console.log('Pengguna sudah logout.');
    }
  });

});
