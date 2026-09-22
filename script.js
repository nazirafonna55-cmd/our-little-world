// ======================================================
// FIREBASE
// ======================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyCc3EtEy5vMvL89MVeyFVxHoYeKXa9gA48",
    authDomain: "our-little-world-f0619.firebaseapp.com",
    projectId: "our-little-world-f0619",
    storageBucket: "our-little-world-f0619.firebasestorage.app",
    messagingSenderId: "84789357470",
    appId: "1:84789357470:web:6a300c8ad05ecdde4a448f",
    measurementId: "G-M65WFWVXEK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ======================================================
// HELPER
// ======================================================

function escapeHTML(text) {
    if (text === null || text === undefined) return "";

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function getTodayKey() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function formatDate(date) {
    return new Date(date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}


// ======================================================
// PAGE NAVIGATION
// ======================================================

function openPage(pageName) {

    console.log("Membuka halaman:", pageName);

    const pages = document.querySelectorAll(".app-page");

    pages.forEach(page => {
        page.classList.remove("active");
    });


    const selectedPage =
        document.getElementById("page-" + pageName);


    if (selectedPage) {

        selectedPage.classList.add("active");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } else {

        console.error(
            "Halaman tidak ditemukan: page-" + pageName
        );

    }


    const menus =
        document.querySelectorAll(".menu");


    menus.forEach(menu => {

        menu.classList.remove("active");

        if (
            menu.getAttribute("data-page") === pageName
        ) {
            menu.classList.add("active");
        }

    });

}


// ======================================================
// SIDEBAR MENU
// ======================================================

function setupMenu() {

    const menus =
        document.querySelectorAll(".menu");


    menus.forEach(menu => {

        menu.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();


            const pageName =
                this.getAttribute("data-page");


            console.log(
                "Menu diklik:",
                pageName
            );


            if (pageName) {
                openPage(pageName);
            }

        });

    });

}


// ======================================================
// OUR TIME
// ======================================================

let startDate = new Date(2026, 4, 1);


function updateDaysTogether() {

    const today = new Date();


    const start = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
    );


    const current = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );


    const difference =
        current.getTime() - start.getTime();


    const days =
        Math.floor(
            difference / (1000 * 60 * 60 * 24)
        );


    const daysTogether =
        document.getElementById("daysTogether");


    if (daysTogether) {
        daysTogether.textContent = days;
    }


    const bigDaysTogether =
        document.getElementById("bigDaysTogether");


    if (bigDaysTogether) {
        bigDaysTogether.textContent = days;
    }


    const formattedDate =
        formatDate(startDate);


    const startDateText =
        document.getElementById("startDateText");


    if (startDateText) {
        startDateText.textContent =
            formattedDate;
    }


    const bigStartDate =
        document.getElementById("bigStartDate");


    if (bigStartDate) {
        bigStartDate.textContent =
            formattedDate;
    }

}


updateDaysTogether();

setInterval(
    updateDaysTogether,
    60 * 60 * 1000
);


// ======================================================
// LOVE TODAY HOME
// ======================================================

function updateLove() {

    const range =
        document.getElementById("loveRange");


    const number =
        document.getElementById("loveNumber");


    const message =
        document.getElementById("loveMessage");


    if (!range) return;


    const value =
        Number(range.value);


    if (number) {
        number.textContent = value;
    }


    if (!message) return;


    if (value <= 30) {

        message.textContent =
            "Hmmm kamu kenapa? 😭 Sini cerita sama aku.";

    }

    else if (value <= 60) {

        message.textContent =
            "Lumayan nih 😤💕 Tapi aku mau lebih tinggi.";

    }

    else if (value <= 90) {

        message.textContent =
            `${value}% — Lumayan tinggi! Tapi aku mau 100% 🥺`;

    }

    else {

        message.textContent =
            "100% LOVE! YEEEAY AKU DICINTAI 😭💗";

    }

}


// ======================================================
// LOVE TODAY PAGE
// ======================================================

function updateBigLove() {

    const range =
        document.getElementById("bigLoveRange");


    const number =
        document.getElementById("bigLoveNumber");


    const message =
        document.getElementById("bigLoveMessage");


    if (!range) return;


    const value =
        Number(range.value);


    if (number) {
        number.textContent =
            value + "%";
    }


    if (!message) return;


    if (value <= 30) {

        message.textContent =
            `${value}% — Hmm, ada apa nih? 🥺 Cerita sama aku ya.`;

    }

    else if (value <= 60) {

        message.textContent =
            `${value}% — Lumayan nih 💕 Tapi masih bisa lebih tinggi.`;

    }

    else if (value <= 90) {

        message.textContent =
            `${value}% — Tinggi banget! Tapi aku masih mau 100% 🥺♡`;

    }

    else {

        message.textContent =
            "100% LOVE! YEEEAY AKU DICINTAI 😭💗";

    }

}


// ======================================================
// SAVE LOVE TODAY
// ======================================================

async function saveLoveToday() {

    const range =
        document.getElementById("bigLoveRange");


    const noteElement =
        document.getElementById("loveTodayNote");


    if (!range) {

        alert(
            "Slider Love tidak ditemukan 😭"
        );

        return;
    }


    const percentage =
        Number(range.value);


    const note =
        noteElement
            ? noteElement.value.trim()
            : "";


    const dateKey =
        getTodayKey();


    try {

        await setDoc(
            doc(db, "loveToday", dateKey),
            {
                date: dateKey,
                percentage: percentage,
                note: note,
                updatedAt: serverTimestamp()
            }
        );


        alert(
            `Love hari ini ${percentage}% berhasil disimpan! 💗`
        );


        if (noteElement) {
            noteElement.value = "";
        }


        loadLoveToday();


    }

    catch (error) {

        console.error(
            "Gagal menyimpan Love Today:",
            error
        );


        alert(
            "Gagal menyimpan Love Today 😭"
        );

    }

}


// ======================================================
// LOAD LOVE TODAY
// ======================================================

async function loadLoveToday() {

    const list =
        document.getElementById("loveTodayList");


    if (!list) return;


    try {

        const snapshot =
            await getDocs(
                collection(db, "loveToday")
            );


        if (snapshot.empty) {

            list.innerHTML =
                "<p>Belum ada catatan love. 💗</p>";

            return;
        }


        let records = [];


        snapshot.forEach(item => {

            records.push({
                id: item.id,
                ...item.data()
            });

        });


        records.sort(
            (a, b) =>
                String(b.date || "")
                    .localeCompare(
                        String(a.date || "")
                    )
        );


        list.innerHTML = "";


        records.forEach(record => {

            let dateText =
                record.date || "";


            if (record.date) {

                const parts =
                    record.date.split("-");


                if (parts.length === 3) {

                    const dateObject =
                        new Date(
                            Number(parts[0]),
                            Number(parts[1]) - 1,
                            Number(parts[2])
                        );


                    dateText =
                        formatDate(dateObject);

                }

            }


            const item =
                document.createElement("div");


            item.style.cssText = `
                padding:18px;
                margin-top:12px;
                border-radius:16px;
                background:rgba(255,255,255,0.06);
                border:1px solid rgba(255,255,255,0.1);
            `;


            item.innerHTML = `

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:10px;
                ">

                    <strong>
                        📅 ${escapeHTML(dateText)}
                    </strong>

                    <span style="
                        font-size:24px;
                        font-weight:bold;
                    ">
                        💗 ${record.percentage}%
                    </span>

                </div>


                <p style="margin-top:10px;">
                    ${
                        record.note
                            ? escapeHTML(record.note)
                            : "Tidak ada catatan."
                    }
                </p>


                <button
                    onclick="deleteLoveToday('${record.id}')"
                    style="
                        margin-top:10px;
                        padding:8px 14px;
                        border:none;
                        border-radius:10px;
                        cursor:pointer;
                    "
                >
                    🗑️ Hapus
                </button>

            `;


            list.appendChild(item);

        });

    }

    catch (error) {

        console.error(
            "Gagal memuat Love Today:",
            error
        );


        list.innerHTML =
            "<p>Gagal memuat riwayat Love Today 😭</p>";

    }

}


// ======================================================
// DELETE LOVE TODAY
// ======================================================

async function deleteLoveToday(id) {

    if (
        !confirm(
            "Hapus catatan Love Today ini?"
        )
    ) {
        return;
    }


    try {

        await deleteDoc(
            doc(db, "loveToday", id)
        );


        alert(
            "Catatan berhasil dihapus 💗"
        );


        loadLoveToday();

    }

    catch (error) {

        console.error(error);

        alert(
            "Gagal menghapus catatan 😭"
        );

    }

}


// ======================================================
// MOOD CHECK
// ======================================================

let selectedMood = null;


function selectMood(
    emoji,
    name,
    button
) {

    selectedMood = {
        emoji: emoji,
        name: name
    };


    document
        .querySelectorAll(".mood-button")
        .forEach(item => {
            item.classList.remove("selected");
        });


    if (button) {
        button.classList.add("selected");
    }

}


async function saveBigMood() {

    const textElement =
        document.getElementById("bigMoodText");


    const text =
        textElement
            ? textElement.value.trim()
            : "";


    if (!selectedMood) {

        alert(
            "Pilih mood kamu dulu yaa 💗"
        );

        return;
    }


    if (!text) {

        alert(
            "Ceritain sedikit perasaan kamu 🥺"
        );

        return;
    }


    try {

        await addDoc(
            collection(db, "moods"),
            {
                emoji: selectedMood.emoji,
                name: selectedMood.name,
                text: text,
                createdAt: serverTimestamp()
            }
        );


        alert(
            "Mood berhasil disimpan! 💗"
        );


        textElement.value = "";

        selectedMood = null;


        document
            .querySelectorAll(".mood-button")
            .forEach(item => {
                item.classList.remove("selected");
            });


        loadMoods();

    }

    catch (error) {

        console.error(error);

        alert(
            "Mood gagal disimpan 😭"
        );

    }

}


async function loadMoods() {

    const list =
        document.getElementById("moodList");


    if (!list) return;


    try {

        const snapshot =
            await getDocs(
                collection(db, "moods")
            );


        list.innerHTML = "";


        if (snapshot.empty) {

            list.innerHTML =
                "<p>Belum ada mood tersimpan.</p>";

            return;
        }


        snapshot.forEach(item => {

            const data =
                item.data();


            list.innerHTML += `

                <div style="
                    padding:15px;
                    margin-top:10px;
                    border-radius:15px;
                    background:rgba(255,255,255,.06);
                ">

                    <strong>
                        ${escapeHTML(data.emoji)}
                        ${escapeHTML(data.name)}
                    </strong>

                    <p>
                        ${escapeHTML(data.text)}
                    </p>

                    <button
                        onclick="deleteMood('${item.id}')"
                    >
                        🗑️ Hapus
                    </button>

                </div>

            `;

        });

    }

    catch (error) {

        console.error(error);

    }

}


async function deleteMood(id) {

    if (!confirm("Hapus mood ini?")) return;


    await deleteDoc(
        doc(db, "moods", id)
    );


    loadMoods();

}


// ======================================================
// OUR TIME
// ======================================================

async function addTimeStory() {

    const title =
        document
            .getElementById("timeTitle")
            .value
            .trim();


    const date =
        document
            .getElementById("timeDate")
            .value;


    const story =
        document
            .getElementById("timeStory")
            .value
            .trim();


    if (!title || !story) {

        alert(
            "Isi judul dan cerita dulu ya 💗"
        );

        return;
    }


    try {

        await addDoc(
            collection(db, "timeStories"),
            {
                title,
                date,
                story,
                createdAt: serverTimestamp()
            }
        );


        alert(
            "Cerita berhasil disimpan 💗"
        );


        document.getElementById("timeTitle").value = "";
        document.getElementById("timeDate").value = "";
        document.getElementById("timeStory").value = "";


        loadTimeStories();

    }

    catch (error) {

        console.error(error);

        alert(
            "Gagal menyimpan cerita 😭"
        );

    }

}


async function loadTimeStories() {

    const list =
        document.getElementById("timeList");


    if (!list) return;


    const snapshot =
        await getDocs(
            collection(db, "timeStories")
        );


    list.innerHTML = "";


    snapshot.forEach(item => {

        const data =
            item.data();


        list.innerHTML += `

            <div style="
                padding:15px;
                margin-top:10px;
            ">

                <h3>
                    ${escapeHTML(data.title)}
                </h3>

                <p>
                    ${escapeHTML(data.date || "")}
                </p>

                <p>
                    ${escapeHTML(data.story)}
                </p>

                <button
                    onclick="deleteTimeStory('${item.id}')"
                >
                    🗑️ Hapus
                </button>

            </div>

        `;

    });

}


async function deleteTimeStory(id) {

    if (!confirm("Hapus cerita ini?")) return;


    await deleteDoc(
        doc(db, "timeStories", id)
    );


    loadTimeStories();

}


// ======================================================
// MEMORIES
// ======================================================

async function addMemory() {

    const title =
        document
            .getElementById("memoryTitle")
            .value
            .trim();


    const date =
        document
            .getElementById("memoryDate")
            .value;


    const image =
        document
            .getElementById("memoryImage")
            .value
            .trim();


    const story =
        document
            .getElementById("memoryStory")
            .value
            .trim();


    if (!title || !story) {

        alert(
            "Isi judul dan cerita memory dulu 💗"
        );

        return;
    }


    try {

        await addDoc(
            collection(db, "memories"),
            {
                title,
                date,
                image,
                story,
                createdAt: serverTimestamp()
            }
        );


        alert(
            "Memory berhasil disimpan 📸💗"
        );


        document.getElementById("memoryTitle").value = "";
        document.getElementById("memoryDate").value = "";
        document.getElementById("memoryImage").value = "";
        document.getElementById("memoryStory").value = "";


        loadMemories();

    }

    catch (error) {

        console.error(error);

        alert(
            "Gagal menyimpan memory 😭"
        );

    }

}


async function loadMemories() {

    const list =
        document.getElementById("memoryList");


    if (!list) return;


    const snapshot =
        await getDocs(
            collection(db, "memories")
        );


    list.innerHTML = "";


    snapshot.forEach(item => {

        const data =
            item.data();


        list.innerHTML += `

            <div style="
                padding:15px;
                margin-top:10px;
            ">

                ${
                    data.image
                    ? `
                        <img
                            src="${escapeHTML(data.image)}"
                            style="
                                max-width:200px;
                                border-radius:15px;
                            "
                        >
                    `
                    : ""
                }


                <h3>
                    ${escapeHTML(data.title)}
                </h3>

                <p>
                    ${escapeHTML(data.date || "")}
                </p>

                <p>
                    ${escapeHTML(data.story)}
                </p>

                <button
                    onclick="deleteMemory('${item.id}')"
                >
                    🗑️ Hapus
                </button>

            </div>

        `;

    });

}


async function deleteMemory(id) {

    if (!confirm("Hapus memory ini?")) return;


    await deleteDoc(
        doc(db, "memories", id)
    );


    loadMemories();

}


// ======================================================
// PLAYLIST
// ======================================================

async function addPlaylist() {

    const title =
        document
            .getElementById("playlistTitle")
            .value
            .trim();


    const artist =
        document
            .getElementById("playlistArtist")
            .value
            .trim();


    const link =
        document
            .getElementById("playlistLink")
            .value
            .trim();


    if (!title) {

        alert(
            "Isi judul lagu dulu 🎵"
        );

        return;
    }


    try {

        await addDoc(
            collection(db, "playlists"),
            {
                title,
                artist,
                link,
                createdAt: serverTimestamp()
            }
        );


        alert(
            "Lagu berhasil ditambahkan 🎵💗"
        );


        document.getElementById("playlistTitle").value = "";
        document.getElementById("playlistArtist").value = "";
        document.getElementById("playlistLink").value = "";


        loadPlaylists();

    }

    catch (error) {

        console.error(error);

        alert(
            "Gagal menambahkan lagu 😭"
        );

    }

}


async function loadPlaylists() {

    const list =
        document.getElementById("playlistList");


    if (!list) return;


    const snapshot =
        await getDocs(
            collection(db, "playlists")
        );


    list.innerHTML = "";


    snapshot.forEach(item => {

        const data =
            item.data();


        list.innerHTML += `

            <div style="
                padding:15px;
                margin-top:10px;
            ">

                <h3>
                    🎵 ${escapeHTML(data.title)}
                </h3>

                <p>
                    ${escapeHTML(data.artist || "")}
                </p>

                ${
                    data.link
                    ? `
                        <a
                            href="${escapeHTML(data.link)}"
                            target="_blank"
                        >
                            ▶️ Buka Lagu
                        </a>
                    `
                    : ""
                }

                <br><br>

                <button
                    onclick="deletePlaylist('${item.id}')"
                >
                    🗑️ Hapus
                </button>

            </div>

        `;

    });

}


async function deletePlaylist(id) {

    if (!confirm("Hapus lagu ini?")) return;


    await deleteDoc(
        doc(db, "playlists", id)
    );


    loadPlaylists();

}


// ======================================================
// LOVE NOTES
// ======================================================

async function addLoveNote() {

    const title =
        document
            .getElementById("noteTitle")
            .value
            .trim();


    const text =
        document
            .getElementById("noteText")
            .value
            .trim();


    if (!title || !text) {

        alert(
            "Isi judul dan isi pesan dulu 💌"
        );

        return;
    }


    try {

        await addDoc(
            collection(db, "loveNotes"),
            {
                title,
                text,
                createdAt: serverTimestamp()
            }
        );


        alert(
            "Love Note berhasil disimpan 💌💗"
        );


        document.getElementById("noteTitle").value = "";
        document.getElementById("noteText").value = "";


        loadLoveNotes();

    }

    catch (error) {

        console.error(error);

        alert(
            "Gagal menyimpan Love Note 😭"
        );

    }

}


async function loadLoveNotes() {

    const list =
        document.getElementById("loveNotesList");


    if (!list) return;


    const snapshot =
        await getDocs(
            collection(db, "loveNotes")
        );


    list.innerHTML = "";


    snapshot.forEach(item => {

        const data =
            item.data();


        list.innerHTML += `

            <div style="
                padding:15px;
                margin-top:10px;
            ">

                <h3>
                    💌 ${escapeHTML(data.title)}
                </h3>

                <p>
                    ${escapeHTML(data.text)}
                </p>

                <button
                    onclick="deleteLoveNote('${item.id}')"
                >
                    🗑️ Hapus
                </button>

            </div>

        `;

    });

}


async function deleteLoveNote(id) {

    if (!confirm("Hapus Love Note ini?")) return;


    await deleteDoc(
        doc(db, "loveNotes", id)
    );


    loadLoveNotes();

}


// ======================================================
// SOMEDAY LIST
// ======================================================

async function addSomeday() {

    const text =
        document
            .getElementById("todoText")
            .value
            .trim();


    if (!text) {

        alert(
            "Isi rencana dulu ⭐"
        );

        return;
    }


    try {

        await addDoc(
            collection(db, "someday"),
            {
                text,
                completed: false,
                createdAt: serverTimestamp()
            }
        );


        document.getElementById("todoText").value = "";


        loadSomeday();

    }

    catch (error) {

        console.error(error);

        alert(
            "Gagal menyimpan rencana 😭"
        );

    }

}


async function loadSomeday() {

    const list =
        document.getElementById("somedayList");


    if (!list) return;


    const snapshot =
        await getDocs(
            collection(db, "someday")
        );


    list.innerHTML = "";


    snapshot.forEach(item => {

        const data =
            item.data();


        list.innerHTML += `

            <div style="
                padding:12px;
                margin-top:10px;
            ">

                <label>

                    <input
                        type="checkbox"
                        ${
                            data.completed
                                ? "checked"
                                : ""
                        }

                        onchange="
                            toggleSomeday(
                                '${item.id}',
                                this.checked
                            )
                        "
                    >

                    ${escapeHTML(data.text)}

                </label>


                <button
                    onclick="deleteSomeday('${item.id}')"
                >
                    🗑️
                </button>

            </div>

        `;

    });

}


async function toggleSomeday(
    id,
    checked
) {

    await updateDoc(
        doc(db, "someday", id),
        {
            completed: checked
        }
    );

}


async function deleteSomeday(id) {

    await deleteDoc(
        doc(db, "someday", id)
    );


    loadSomeday();

}


// ======================================================
// OUR CHATS
// ======================================================

async function addChat() {

    const name =
        document
            .getElementById("chatName")
            .value
            .trim();


    const message =
        document
            .getElementById("chatMessage")
            .value
            .trim();


    const time =
        document
            .getElementById("chatTime")
            .value;


    if (!name || !message) {

        alert(
            "Isi nama dan pesan dulu 💬"
        );

        return;
    }


    try {

        await addDoc(
            collection(db, "chats"),
            {
                name,
                message,
                time,
                createdAt: serverTimestamp()
            }
        );


        document.getElementById("chatName").value = "";
        document.getElementById("chatMessage").value = "";
        document.getElementById("chatTime").value = "";


        loadChats();

    }

    catch (error) {

        console.error(error);

        alert(
            "Gagal menyimpan chat 😭"
        );

    }

}


async function loadChats() {

    const list =
        document.getElementById("chatList");


    if (!list) return;


    const snapshot =
        await getDocs(
            collection(db, "chats")
        );


    list.innerHTML = "";


    snapshot.forEach(item => {

        const data =
            item.data();


        list.innerHTML += `

            <div style="
                padding:15px;
                margin-top:10px;
            ">

                <strong>
                    💬 ${escapeHTML(data.name)}
                </strong>

                <p>
                    ${escapeHTML(data.message)}
                </p>

                <small>
                    ${escapeHTML(data.time || "")}
                </small>

                <br><br>

                <button
                    onclick="deleteChat('${item.id}')"
                >
                    🗑️ Hapus
                </button>

            </div>

        `;

    });

}


async function deleteChat(id) {

    if (!confirm("Hapus chat ini?")) return;


    await deleteDoc(
        doc(db, "chats", id)
    );


    loadChats();

}


// ======================================================
// SETTINGS
// ======================================================

async function saveSettings() {

    const name1 =
        document
            .getElementById("settingName1")
            .value
            .trim();


    const name2 =
        document
            .getElementById("settingName2")
            .value
            .trim();


    const start =
        document
            .getElementById("settingStartDate")
            .value;


    try {

        await setDoc(
            doc(db, "settings", "main"),
            {
                name1,
                name2,
                startDate: start
            }
        );


        alert(
            "Pengaturan berhasil disimpan ⚙️💗"
        );

    }

    catch (error) {

        console.error(error);

        alert(
            "Gagal menyimpan pengaturan 😭"
        );

    }

}


// ======================================================
// JALANKAN SETELAH HTML SELESAI
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupMenu();

        updateLove();

        updateBigLove();

        loadLoveToday();

        loadMoods();

        loadTimeStories();

        loadMemories();

        loadPlaylists();

        loadLoveNotes();

        loadSomeday();

        loadChats();

    }
);


// ======================================================
// EVENT SLIDER
// ======================================================

document.addEventListener(
    "input",
    event => {

        if (
            event.target.id ===
            "loveRange"
        ) {
            updateLove();
        }


        if (
            event.target.id ===
            "bigLoveRange"
        ) {
            updateBigLove();
        }

    }
);


// ======================================================
// GLOBAL FUNCTIONS
// ======================================================

window.openPage =
    openPage;

window.saveLoveToday =
    saveLoveToday;

window.deleteLoveToday =
    deleteLoveToday;

window.selectMood =
    selectMood;

window.saveBigMood =
    saveBigMood;

window.deleteMood =
    deleteMood;


// ======================================================
// OUR TIME
// ======================================================

window.addTimeStory =
    addTimeStory;

window.saveTimeStory =
    addTimeStory;

window.deleteTimeStory =
    deleteTimeStory;


// ======================================================
// MEMORIES
// ======================================================

window.addMemory =
    addMemory;

window.saveMemory =
    addMemory;

window.deleteMemory =
    deleteMemory;


// ======================================================
// PLAYLIST
// ======================================================

window.addPlaylist =
    addPlaylist;

window.savePlaylist =
    addPlaylist;

window.deletePlaylist =
    deletePlaylist;


// ======================================================
// LOVE NOTES
// ======================================================

window.addLoveNote =
    addLoveNote;

window.saveLoveNote =
    addLoveNote;

window.deleteLoveNote =
    deleteLoveNote;


// ======================================================
// SOMEDAY
// ======================================================

window.addSomeday =
    addSomeday;

window.saveSomeday =
    addSomeday;

window.toggleSomeday =
    toggleSomeday;

window.deleteSomeday =
    deleteSomeday;


// ======================================================
// OUR CHATS
// ======================================================

window.addChat =
    addChat;

window.saveChat =
    addChat;

window.deleteChat =
    deleteChat;


// ======================================================
// SETTINGS
// ======================================================

window.saveSettings =
    saveSettings;


console.log(
    "💗 Our Little World berhasil dijalankan!"
);

console.log(
    "🔥 Firebase:",
    firebaseConfig.projectId
);
