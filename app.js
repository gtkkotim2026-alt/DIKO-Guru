'use strict';
const CFG = window.APP_CONFIG || {};
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// ===== MOCK DATA (untuk uji coba, nanti diganti API) =====
const MOCK_USER = {
  nama: 'Siti Nurhaliza',
  nip: '198503152010012001',
  npsn: 'P1234567',
  sekolah: 'SDN 1 Contoh',
  jabatan: 'Guru Kelas',
  foto: ''
};

let laporanList = [
  {
    id: '1',
    terlapor_nama: 'Ahmad Fauzi',
    terlapor_nip: '197812102005011003',
    jenis_pelanggaran: 'Tidak masuk tanpa keterangan',
    tingkat: 'Sedang',
    tgl_kejadian: '2026-11-15',
    lokasi: 'Ruang Guru',
    kronologi: 'Tidak hadir selama 3 hari berturut-turut tanpa izin.',
    status: 'Menunggu',
    dibuat_pada: '2026-11-16'
  },
  {
    id: '2',
    terlapor_nama: 'Rina Wati',
    terlapor_nip: '198901202012012004',
    jenis_pelanggaran: 'Terlambat mengajar',
    tingkat: 'Ringan',
    tgl_kejadian: '2026-11-10',
    lokasi: 'Kelas 5A',
    kronologi: 'Sering terlambat masuk kelas lebih dari 15 menit.',
    status: 'Diproses',
    dibuat_pada: '2026-11-11'
  }
];

let currentUser = null;
let currentPage = 'home';

function esc(v) {
  return String(v == null ? '' : v).replace(/[&<>"']/g, c => ({
    '&': '&', '<': '<', '>': '>', '"': '"', "'": '&#39;'
  }[c]));
}

function render() {
  if (!currentUser) {
    renderLogin();
    return;
  }
  renderShell();
}

function renderLogin() {
  $('#app').innerHTML = `
    <div class="auth">
      <div class="auth-box">
        <h1>${esc(CFG.APP_NAME || 'DIKO Guru')}</h1>
        <div class="sub">${esc(CFG.APP_SUB || 'Portal Layanan Guru')}</div>
        <form id="loginForm">
          <label>NIP</label>
          <input id="nip" type="text" placeholder="Masukkan NIP" value="198503152010012001" required>
          <label>Password</label>
          <input id="pw" type="password" placeholder="Password" value="demo123" required>
          <button class="btn" type="submit">Masuk</button>
        </form>
        <div class="demo-note">Mode Demo — NIP & password bebas, data tidak tersimpan ke server.</div>
      </div>
    </div>`;
  $('#loginForm').onsubmit = (e) => {
    e.preventDefault();
    currentUser = { ...MOCK_USER, nip: $('#nip').value || MOCK_USER.nip };
    currentPage = 'home';
    render();
  };
}

function renderShell() {
  const pages = {
    home: renderHome,
    lapor: renderLapor,
    status: renderStatus,
    profil: renderProfil
  };
  const titles = { home: 'Beranda', lapor: 'Lapor Disiplin', status: 'Status Laporan', profil: 'Profil' };

  $('#app').innerHTML = `
    <div class="shell">
      <header>
        <div class="logo">${esc(CFG.APP_NAME || 'DIKO Guru')}</div>
        <div class="who">${esc(currentUser.nama)}</div>
        <button class="btn sm sec" id="logout">Keluar</button>
      </header>
      <nav>
        <button data-page="home" class="${currentPage==='home'?'on':''}">Beranda</button>
        <button data-page="lapor" class="${currentPage==='lapor'?'on':''}">Lapor Disiplin</button>
        <button data-page="status" class="${currentPage==='status'?'on':''}">Status Laporan</button>
        <button data-page="profil" class="${currentPage==='profil'?'on':''}">Profil</button>
      </nav>
      <main id="main"></main>
    </div>`;

  $$('nav button').forEach(btn => {
    btn.onclick = () => { currentPage = btn.dataset.page; render(); };
  });
  $('#logout').onclick = () => { currentUser = null; render(); };

  (pages[currentPage] || renderHome)();
}

function renderHome() {
  $('#main').innerHTML = `
    <div class="card">
      <div style="display:flex;align-items:center;gap:14px">
        <div class="avatar">${esc(currentUser.nama.charAt(0))}</div>
        <div>
          <h2 style="margin:0">${esc(currentUser.nama)}</h2>
          <div class="mu">NIP ${esc(currentUser.nip)}</div>
          <div style="font-weight:600;margin-top:2px">${esc(currentUser.sekolah)}</div>
        </div>
      </div>
    </div>
    <div class="menu-grid">
      <div class="menu-card" data-go="lapor">
        <div class="ico">📝</div>
        <b>Lapor Disiplin</b>
        <span>Laporkan pelanggaran</span>
      </div>
      <div class="menu-card" data-go="status">
        <div class="ico">📋</div>
        <b>Status Laporan</b>
        <span>${laporanList.length} laporan</span>
      </div>
      <div class="menu-card" data-go="profil">
        <div class="ico">👤</div>
        <b>Profil Saya</b>
        <span>Data kepegawaian</span>
      </div>
      <div class="menu-card" style="opacity:.6">
        <div class="ico">🔄</div>
        <b>Usul Mutasi</b>
        <span>Segera hadir</span>
      </div>
    </div>
    <div class="card" style="margin-top:16px">
      <h3 style="margin:0 0 10px">Laporan Terbaru</h3>
      ${laporanList.slice(0, 2).map(l => `
        <div class="list-item">
          <div>
            <b>${esc(l.terlapor_nama)}</b>
            <div class="mu">${esc(l.jenis_pelanggaran)} · ${esc(l.tgl_kejadian)}</div>
          </div>
          <span class="badge ${l.status==='Menunggu'?'wr':l.status==='Diproses'?'':'ok'}">${esc(l.status)}</span>
        </div>
      `).join('') || '<div class="empty">Belum ada laporan</div>'}
    </div>`;

  $$('.menu-card[data-go]').forEach(el => {
    el.onclick = () => { currentPage = el.dataset.go; render(); };
  });
}

function renderLapor() {
  $('#main').innerHTML = `
    <div class="card">
      <h2>Lapor Tindakan Disiplin</h2>
      <div class="mu" style="margin-bottom:16px">Laporkan pelanggaran disiplin yang dilakukan oleh guru.</div>
      <form id="formLapor">
        <div class="form-row">
          <label>Nama Guru yang Dilaporkan *</label>
          <input name="terlapor_nama" required placeholder="Nama lengkap">
        </div>
        <div class="form-row">
          <label>NIP (opsional)</label>
          <input name="terlapor_nip" placeholder="NIP jika diketahui">
        </div>
        <div class="form-row">
          <label>Jenis Pelanggaran *</label>
          <select name="jenis_pelanggaran" required>
            <option value="">Pilih jenis</option>
            <option>Tidak masuk tanpa keterangan</option>
            <option>Terlambat mengajar</option>
            <option>Meninggalkan tugas</option>
            <option>Pelanggaran kode etik</option>
            <option>Lainnya</option>
          </select>
        </div>
        <div class="form-row">
          <label>Tingkat *</label>
          <select name="tingkat" required>
            <option value="">Pilih tingkat</option>
            <option>Ringan</option>
            <option>Sedang</option>
            <option>Berat</option>
          </select>
        </div>
        <div class="form-row">
          <label>Tanggal Kejadian *</label>
          <input type="date" name="tgl_kejadian" required>
        </div>
        <div class="form-row">
          <label>Lokasi Kejadian</label>
          <input name="lokasi" placeholder="Contoh: Ruang kelas, kantor, dll">
        </div>
        <div class="form-row">
          <label>Kronologi / Uraian *</label>
          <textarea name="kronologi" required placeholder="Jelaskan kejadian secara singkat dan jelas"></textarea>
        </div>
        <button class="btn" type="submit">Kirim Laporan</button>
      </form>
    </div>`;

  $('#formLapor').onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);
    data.id = Date.now().toString();
    data.status = 'Menunggu';
    data.dibuat_pada = new Date().toISOString().slice(0, 10);
    laporanList.unshift(data);
    currentPage = 'status';
    render();
    setTimeout(() => {
      const main = $('#main');
      if (main) main.insertAdjacentHTML('afterbegin', '<div class="success">Laporan berhasil dikirim. Status: Menunggu.</div>');
    }, 50);
  };
}

function renderStatus() {
  $('#main').innerHTML = `
    <div class="card">
      <h2>Status Laporan Saya</h2>
      <div class="mu" style="margin-bottom:12px">${laporanList.length} laporan</div>
      ${laporanList.length ? laporanList.map(l => `
        <div class="list-item">
          <div style="flex:1">
            <b>${esc(l.terlapor_nama)}</b>
            <div class="mu">${esc(l.jenis_pelanggaran)}</div>
            <div class="mu">${esc(l.tgl_kejadian)} · ${esc(l.tingkat)}</div>
          </div>
          <span class="badge ${l.status==='Menunggu'?'wr':l.status==='Diproses'?'':'ok'}">${esc(l.status)}</span>
        </div>
      `).join('') : '<div class="empty">Belum ada laporan. Silakan buat laporan baru.</div>'}
    </div>`;
}

function renderProfil() {
  $('#main').innerHTML = `
    <div class="card" style="text-align:center">
      <div class="avatar" style="width:72px;height:72px;margin:0 auto 12px;font-size:28px">${esc(currentUser.nama.charAt(0))}</div>
      <h2>${esc(currentUser.nama)}</h2>
      <div class="mu">NIP ${esc(currentUser.nip)}</div>
    </div>
    <div class="card">
      <div class="list-item"><div><div class="mu">Sekolah</div><b>${esc(currentUser.sekolah)}</b></div></div>
      <div class="list-item"><div><div class="mu">Jabatan</div><b>${esc(currentUser.jabatan)}</b></div></div>
      <div class="list-item"><div><div class="mu">NPSN</div><b>${esc(currentUser.npsn)}</b></div></div>
    </div>
    <div class="card">
      <button class="btn sec" id="btnGanti">Ganti Password</button>
    </div>`;
  $('#btnGanti').onclick = () => alert('Fitur ganti password akan dihubungkan ke backend DIKO nanti.');
}

render();
