$(document).ready(function() {
    const notepad = $('#notepad-container');
    const notepadHeader = $('#notepad-header');
    const notepadContent = $('#notepad-content');
    const toggleButton = $('#notepad-toggle');

    // --- START: Firebase Integration ---
    const noteRef = firebase.database().ref('notes/packing_page_note');
    let saveTimeout;

    // Fungsi untuk menyimpan catatan ke Firebase dengan jeda (debouncing)
    function saveNoteToFirebase() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            const content = notepadContent.html();
            noteRef.set(content)
                .catch((error) => {
                    console.error("Gagal menyimpan catatan:", error);
                    alert("Gagal menyimpan catatan ke server.");
                });
        }, 1500); // Jeda 1.5 detik setelah berhenti mengetik
    }

    // Muat catatan dari Firebase saat halaman dibuka dan sinkronkan
    noteRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data && notepadContent.html() !== data) {
            notepadContent.html(data);
        }
    }, (errorObject) => {
        console.error("Gagal membaca data dari server: ", errorObject);
    });
    // --- END: Firebase Integration ---

    // Muat ukuran yang tersimpan dari localStorage
    if (localStorage.getItem('notepadWidth') && localStorage.getItem('notepadHeight')) {
        notepad.css({
            width: localStorage.getItem('notepadWidth'),
            height: localStorage.getItem('notepadHeight')
        });
    }

    // Cek status minimized dari localStorage
    if (localStorage.getItem('notepadMinimized') === 'true') {
        notepad.addClass('minimized');
        toggleButton.text('+');
    } else {
        // Posisikan notepad berdasarkan localStorage jika ada (dan tidak minimized)
        if (localStorage.getItem('notepadTop') && localStorage.getItem('notepadLeft')) {
            notepad.css({
                top: localStorage.getItem('notepadTop'),
                left: localStorage.getItem('notepadLeft'),
                bottom: 'auto',
                right: 'auto'
            });
        }
    }

    // Simpan catatan ke localStorage saat ada input
    notepadContent.on('input', saveNoteToFirebase);

    // Toggle (minimize/maximize) notepad
    notepadHeader.on('click', function(e) {
        // Hanya toggle jika container di-minimize atau klik pada tombol
        if (!notepad.hasClass('minimized') && e.target.id !== 'notepad-toggle') {
            return;
        }
        e.stopPropagation(); // Mencegah drag dimulai
        notepad.toggleClass('minimized');

        if (notepad.hasClass('minimized')) {
            toggleButton.text('+');
            localStorage.setItem('notepadMinimized', 'true');
            notepad.resizable('disable');
        } else {
            toggleButton.text('-');
            localStorage.setItem('notepadMinimized', 'false');
            notepad.resizable('enable');
            // Kembalikan ke posisi semula
            if (localStorage.getItem('notepadTop') && localStorage.getItem('notepadLeft')) {
                notepad.css({
                    top: localStorage.getItem('notepadTop'),
                    left: localStorage.getItem('notepadLeft'),
                    bottom: 'auto',
                    right: 'auto'
                });
            }
        }
    });

    // Membuat notepad bisa digeser (draggable)
    let isDragging = false;
    let offset = { x: 0, y: 0 };

    notepadHeader.on('mousedown', function(e) {
        if (notepad.hasClass('minimized')) return; // Mencegah drag saat di-minimize
        isDragging = true;
        offset.x = e.clientX - notepad.offset().left;
        offset.y = e.clientY - notepad.offset().top;
    });

    $(document).on('mousemove', function(e) {
        if (!isDragging) return;

        let newX = e.clientX - offset.x;
        let newY = e.clientY - offset.y;

        notepad.css({
            left: newX + 'px',
            top: newY + 'px',
            bottom: 'auto', // menimpa posisi fixed bottom
            right: 'auto' // menimpa posisi fixed right
        });
    });

    $(document).on('mouseup', function() {
        if (isDragging) {
            // Simpan posisi terakhir saat drag selesai
            isDragging = false;
            localStorage.setItem('notepadTop', notepad.css('top'));
            localStorage.setItem('notepadLeft', notepad.css('left'));
        }
    });

    // Membuat notepad bisa diubah ukurannya (resizable)
    notepad.resizable({
        handles: "n, e, s, w, ne, se, sw, nw",
        minHeight: 150,
        minWidth: 200,
        stop: function(event, ui) {
            // Simpan ukuran baru ke localStorage
            localStorage.setItem('notepadWidth', ui.size.width + 'px');
            localStorage.setItem('notepadHeight', ui.size.height + 'px');
        }
    });

    if (notepad.hasClass('minimized')) {
        notepad.resizable('disable');
    }
});