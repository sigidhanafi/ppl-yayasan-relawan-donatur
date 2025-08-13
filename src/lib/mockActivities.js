export const activities = [
  {
    id: '1',
    title: 'Kelas Literasi untuk Anak',
    category: 'Edukasi',
    date: new Date(Date.now() + 1 * 86400000).toISOString(), // besok
    location: 'Yogyakarta',
    slots: 24,
    coverUrl:
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1200',
    summary:
      'Program literasi dasar untuk anak usia 7–10 tahun di kampung binaan. Sesi mencakup pengenalan huruf, latihan membaca kalimat sederhana, dan permainan edukatif untuk meningkatkan kosakata. Relawan akan dibekali modul, lembar kerja, serta materi permainan per kelompok kecil agar anak-anak dapat belajar sambil bermain.',
    donation_collected: 325000,
    donation_target: 2000000,
    requirements: [
      'Usia minimal 18 tahun dan bersedia mengikuti briefing teknis 1 hari sebelum kegiatan.',
      'Mampu berkomunikasi dengan bahasa Indonesia yang jelas dan ramah anak.',
      'Sabar, empatik, serta nyaman bekerja dalam kelompok kecil (4–6 anak).',
      'Mampu mengikuti rencana sesi (lesson plan) dan melaporkan progres sederhana.',
      'Datang tepat waktu dan berkomitmen minimal 3 jam selama kegiatan.',
      'Diutamakan memiliki pengalaman mengajar atau mentoring anak (tidak wajib).',
    ],
    donation_instructions:
      'Transfer ke BCA 123456789 a.n Yayasan Cerdas Bangsa, lalu konfirmasi via WA +62 812-3456-7890.',
  },
  {
    id: '2',
    title: 'Bakti Sosial Pembagian Sembako',
    category: 'Sosial',
    date: new Date(Date.now() + 3 * 86400000).toISOString(),
    location: 'Sleman',
    slots: 50,
    coverUrl:
      'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1200',
    summary:
      'Distribusi paket sembako untuk warga prasejahtera di beberapa dusun. Kegiatan meliputi penyortiran paket, pengaturan rute, pembagian kupon, dan pendistribusian langsung ke rumah warga lanjut usia. Tim juga akan melakukan pendataan singkat untuk evaluasi dan penyaluran tahap berikutnya.',
    donation_collected: 1500000,
    donation_target: 3000000,
    requirements: [
      'Sehat jasmani, mampu mengangkat paket hingga ±10 kg dengan aman.',
      'Siap bekerja di lapangan dan berinteraksi sopan dengan warga.',
      'Memiliki kemampuan koordinasi dasar dan mengikuti arahan koordinator lapangan.',
      'Bersedia ditempatkan pada tugas penyortiran, pencatatan, atau distribusi.',
      'Memiliki kendaraan pribadi menjadi nilai tambah (BBM tidak ditanggung).',
      'Mematuhi standar keselamatan dan etika dokumentasi (izin foto).',
    ],
    donation_instructions:
      'Donasi via QRIS “Yayasan Peduli Sesama” atau transfer Mandiri 987654321 a.n Yayasan Peduli Sesama.',
  },
  {
    id: '3',
    title: 'Donor Darah Bulanan',
    category: 'Kesehatan',
    date: new Date(Date.now() - 2 * 86400000).toISOString(), // sudah lewat
    location: 'Bantul',
    slots: 0,
    coverUrl:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200',
    summary:
      'Aksi donor darah rutin bekerja sama dengan PMI untuk menjaga ketersediaan stok darah. Selain proses donor, tersedia edukasi singkat mengenai manfaat donor dan pemeriksaan kesehatan awal. Kegiatan terdokumentasi untuk laporan ke mitra fasilitas kesehatan setempat.',
    donation_collected: 500000,
    donation_target: 1500000,
    requirements: [
      'Relawan non-donor membantu administrasi, antrean, dan area istirahat.',
      'Donor wajib memenuhi syarat PMI (usia, BB minimal, kondisi kesehatan).',
      'Mampu menjaga ketertiban barisan dan kebersihan area kegiatan.',
      'Berkoordinasi dengan petugas medis dan mengikuti SOP keamanan.',
      'Tepat waktu sesuai jadwal shift yang ditentukan (2–4 jam).',
      'Bersedia tidak mengunggah foto peserta tanpa persetujuan.',
    ],
    donation_instructions:
      'Donasi melalui dompet digital ke rekening resmi PMI Bantul (lihat tautan di bio).',
  },
  {
    id: '4',
    title: 'Penanaman Pohon di Bantaran Sungai',
    category: 'Lingkungan',
    date: new Date(Date.now() + 5 * 86400000).toISOString(),
    location: 'Kulon Progo',
    slots: 40,
    coverUrl:
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200',
    summary:
      'Gerakan penghijauan di bantaran Sungai Progo untuk mencegah erosi dan banjir. Kegiatan mencakup penggalian lubang tanam, penanaman bibit, pemasangan ajir, serta penyiraman awal. Setiap kelompok akan memelihara bibit adopsi selama 3 bulan (monitoring berkala).',
    donation_collected: 800000,
    donation_target: 2500000,
    requirements: [
      'Fisik kuat dan siap bekerja di area terpapar sinar matahari.',
      'Membawa perlengkapan pribadi (topi, botol minum, sunblock).',
      'Mematuhi zona aman di tepi sungai dan arahan pemandu teknis.',
      'Bersedia bekerja dalam tim 4–6 orang dengan target tanam harian.',
      'Menjaga kebersihan area dan tidak merusak vegetasi sekitar.',
      'Diutamakan memiliki pengalaman kegiatan lapangan (tidak wajib).',
    ],
    donation_instructions:
      'Transfer BRI 1122334455 a.n Komunitas Hijau Lestari, keterangan: “Donasi Pohon”.',
  },
  {
    id: '5',
    title: 'Pelatihan Komputer Dasar untuk Pemuda',
    category: 'Edukasi',
    date: new Date(Date.now() + 7 * 86400000).toISOString(),
    location: 'Yogyakarta',
    slots: 15,
    coverUrl:
      'https://images.unsplash.com/photo-1581093588401-22f6366a77e3?q=80&w=1200',
    summary:
      'Pelatihan pengenalan komputer, Microsoft Office dasar, dan literasi digital. Peserta dilatih membuat surat, tabel sederhana, dan presentasi singkat. Modul juga mencakup etika berinternet dan keamanan akun agar peserta lebih siap menghadapi dunia kerja.',
    donation_collected: 200000,
    donation_target: 1000000,
    requirements: [
      'Mampu mengoperasikan komputer dasar (Office, browser).',
      'Komunikatif dan sabar menghadapi peserta dengan kemampuan beragam.',
      'Bersedia menyiapkan materi praktik dan contoh file latihan.',
      'Dapat mendampingi 3–5 peserta sekaligus dalam sesi praktik.',
      'Tepat waktu dan menjaga alat/perangkat yang dipinjamkan.',
      'Mau mengisi form evaluasi pasca pelatihan.',
    ],
    donation_instructions:
      'Donasi via GoPay/OVO atau BCA 5566778899 a.n Yayasan Digital Maju.',
  },
  {
    id: '6',
    title: 'Pembersihan Pantai Parangtritis',
    category: 'Lingkungan',
    date: new Date(Date.now() + 2 * 86400000).toISOString(),
    location: 'Bantul',
    slots: 60,
    coverUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
    summary:
      'Aksi bersih pantai fokus pada sampah plastik, jaring, dan mikroplastik. Relawan dibagi dalam zona dengan kantong terpisah untuk organik/non-organik. Data temuan akan dicatat untuk laporan kampanye pengurangan plastik sekali pakai.',
    donation_collected: 450000,
    donation_target: 1800000,
    requirements: [
      'Siap berjalan di pasir dan membawa kembali sampah ke titik kumpul.',
      'Menggunakan sarung tangan dan sepatu tertutup (disarankan).',
      'Memilah sampah sesuai kategori yang ditentukan panitia.',
      'Mematuhi instruksi keselamatan (gelombang, area berbatu).',
      'Tidak merusak habitat dan tidak meninggalkan jejak.',
      'Bersedia difoto untuk dokumentasi kampanye (dengan persetujuan).',
    ],
    donation_instructions:
      'Transfer BNI 0099887766 a.n Komunitas Laut Bersih, bukti via email panitia.',
  },
  {
    id: '7',
    title: 'Klinik Gratis untuk Lansia',
    category: 'Kesehatan',
    date: new Date(Date.now() + 4 * 86400000).toISOString(),
    location: 'Sleman',
    slots: 30,
    coverUrl:
      'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1200',
    summary:
      'Pemeriksaan kesehatan dasar untuk lansia: cek tekanan darah, gula darah, konsultasi ringan, dan edukasi gaya hidup. Relawan non-medis membantu registrasi, antrean, serta pendampingan mobilitas bagi peserta.',
    donation_collected: 950000,
    donation_target: 2000000,
    requirements: [
      'Diutamakan mahasiswa/tenaga kesehatan; non-medis tetap diperlukan.',
      'Ramah, sabar, dan mampu mendampingi lansia dengan aman.',
      'Memahami kerahasiaan data kesehatan dan etika komunikasi.',
      'Mampu bekerja dalam shift 3–4 jam sesuai jadwal panitia.',
      'Menggunakan APD sederhana (masker, hand sanitizer tersedia).',
      'Mematuhi SOP kedaruratan dan arahan tenaga medis.',
    ],
    donation_instructions:
      'Donasi via QRIS “Klinik Lansia Sleman” atau transfer BCA 4455667788.',
  },
  {
    id: '8',
    title: 'Workshop Kerajinan Daur Ulang',
    category: 'Edukasi',
    date: new Date(Date.now() + 6 * 86400000).toISOString(),
    location: 'Gunung Kidul',
    slots: 20,
    coverUrl:
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200',
    summary:
      'Pelatihan membuat produk kerajinan bernilai jual dari bahan plastik dan kertas bekas. Sesi mencakup desain sederhana, teknik perekatan, finishing, dan tips pemasaran online untuk UMKM pemula.',
    donation_collected: 1200000,
    donation_target: 2500000,
    requirements: [
      'Kreatif dan nyaman memandu demonstrasi langkah demi langkah.',
      'Membawa peralatan dasar (gunting, cutter, lem) bila memungkinkan.',
      'Menjaga keselamatan peserta saat penggunaan alat tajam/lem panas.',
      'Membantu dokumentasi foto hasil karya peserta.',
      'Mampu bekerja dalam kelompok kecil (3–5 peserta).',
      'Bersedia merapikan area kerja setelah sesi.',
    ],
    donation_instructions:
      'Transfer CIMB 7788990011 a.n Komunitas Kreasi Hijau, subjek: “Donasi Workshop”.',
  },
  {
    id: '9',
    title: 'Dapur Umum Bencana',
    category: 'Sosial',
    date: new Date(Date.now() + 1.5 * 86400000).toISOString(),
    location: 'Sleman',
    slots: 35,
    coverUrl:
      'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200',
    summary:
      'Menyiapkan makanan siap saji untuk penyintas di posko pengungsian. Relawan dibagi dalam tim persiapan bahan, memasak, pengemasan, dan distribusi. Kebersihan dapur serta keamanan pangan menjadi prioritas utama.',
    donation_collected: 2750000,
    donation_target: 5000000,
    requirements: [
      'Bersedia kerja shift dan mengikuti standar kebersihan dapur.',
      'Memakai APD: celemek, sarung tangan, masker (disediakan terbatas).',
      'Memahami pembagian tugas dan alur keluar-masuk area masak.',
      'Mampu mengemas dan menakar porsi dengan konsisten.',
      'Mematuhi protokol alergi/halal bila ada permintaan khusus.',
      'Siap ditempatkan di posko distribusi jika diperlukan.',
    ],
    donation_instructions:
      'Donasi bahan baku via e-grocery atau transfer BRI 2211334455 a.n Dapur Siaga.',
  },
  {
    id: '10',
    title: 'Kelas Bahasa Inggris Pemula',
    category: 'Edukasi',
    date: new Date(Date.now() + 9 * 86400000).toISOString(),
    location: 'Yogyakarta',
    slots: 18,
    coverUrl:
      'https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1200',
    summary:
      'Kelas conversational English untuk remaja 13–16 tahun. Fokus pada percakapan sehari-hari, pengucapan, dan kepercayaan diri berbicara. Setiap pertemuan ditutup dengan mini role-play.',
    donation_collected: 300000,
    donation_target: 1200000,
    requirements: [
      'Kemampuan English minimal basic–intermediate.',
      'Mampu membuat aktivitas interaktif (games/role-play).',
      'Sabar menghadapi peserta pemalu atau belum percaya diri.',
      'Mengikuti template materi dan laporan kehadiran.',
      'Datang tepat waktu dan konsisten komitmennya.',
      'Pengalaman mengajar menjadi nilai tambah.',
    ],
    donation_instructions:
      'Transfer BCA 9988776655 a.n Yayasan Bahasa Untuk Semua.',
  },
  {
    id: '11',
    title: 'Perpustakaan Keliling',
    category: 'Sosial',
    date: new Date(Date.now() + 12 * 86400000).toISOString(),
    location: 'Kulon Progo',
    slots: 22,
    coverUrl:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200',
    summary:
      'Membawa buku bacaan ke daerah terpencil menggunakan mobil perpustakaan. Kegiatan meliputi peminjaman buku, membaca bersama, dan dongeng singkat. Data peminjam dicatat untuk evaluasi koleksi.',
    donation_collected: 700000,
    donation_target: 2200000,
    requirements: [
      'Bisa menyetir (SIM A diutamakan) atau membantu administrasi peminjaman.',
      'Suka membaca dan mampu bercerita/dongeng dengan antusias.',
      'Menjaga kondisi buku dan menata rak portabel.',
      'Mampu beradaptasi di lokasi terpencil dengan fasilitas terbatas.',
      'Ramah terhadap anak-anak dan orang tua setempat.',
      'Bersedia menggantikan jadwal bila ada perubahan cuaca.',
    ],
    donation_instructions:
      'Donasi buku layak baca atau transfer Mandiri 2233445566 a.n Perpus Keliling Nusantara.',
  },
  {
    id: '12',
    title: 'Kelas Kewirausahaan Mikro',
    category: 'Edukasi',
    date: new Date(Date.now() + 10 * 86400000).toISOString(),
    location: 'Bantul',
    slots: 28,
    coverUrl:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200',
    summary:
      'Pelatihan kewirausahaan untuk UMKM pemula: pembukuan sederhana, pemasaran digital, dan foto produk. Peserta membuat rencana aksi 30 hari pasca pelatihan untuk dipantau mentor.',
    donation_collected: 1100000,
    donation_target: 3000000,
    requirements: [
      'Mampu presentasi materi secara runtut dan komunikatif.',
      'Pengalaman usaha kecil menjadi nilai tambah.',
      'Membawa contoh materi (template pembukuan/foto produk).',
      'Bersedia menjawab konsultasi singkat peserta setelah sesi.',
      'Mampu bekerja sama dengan mentor lain dalam satu kelas.',
      'Mematuhi alur evaluasi dan pengumpulan tugas peserta.',
    ],
    donation_instructions:
      'Transfer BSI 7711223344 a.n Inkubator UMKM Berdaya.',
  },
  {
    id: '13',
    title: 'Posko Psikososial Anak',
    category: 'Kesehatan',
    date: new Date(Date.now() + 2.5 * 86400000).toISOString(),
    location: 'Gunung Kidul',
    slots: 16,
    coverUrl:
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200',
    summary:
      'Pendampingan psikososial untuk anak-anak terdampak bencana. Aktivitas mencakup bermain terstruktur, menggambar, dan sesi ekspresi emosi yang aman dengan pendamping.',
    donation_collected: 600000,
    donation_target: 1800000,
    requirements: [
      'Latar belakang psikologi/pendidikan/PAUD diutamakan (tidak wajib).',
      'Empatik, sabar, dan peka terhadap tanda stres/trauma.',
      'Tidak melakukan intervensi klinis di luar kewenangan.',
      'Mampu bekerja berpasangan (co-facilitator) di tiap kelompok.',
      'Mengikuti SOP pelaporan kasus khusus kepada koordinator.',
      'Menjaga privasi dan kerahasiaan anak serta keluarga.',
    ],
    donation_instructions:
      'Donasi via QRIS “Posko Psikososial DIY” atau transfer BCA 1122557799.',
  },
  {
    id: '14',
    title: 'Bank Sampah Komunitas',
    category: 'Lingkungan',
    date: new Date(Date.now() + 8 * 86400000).toISOString(),
    location: 'Yogyakarta',
    slots: 26,
    coverUrl:
      'https://images.unsplash.com/photo-1520975922284-9dff4d4e8ed0?q=80&w=1200',
    summary:
      'Edukasi pemilahan sampah rumah tangga dan pengelolaan bank sampah skala RT. Relawan membantu penimbangan, pencatatan tabungan sampah, dan sosialisasi ke warga.',
    donation_collected: 250000,
    donation_target: 1000000,
    requirements: [
      'Tertarik isu lingkungan dan mampu menyampaikan sosialisasi singkat.',
      'Teliti dalam menimbang dan mencatat kategori sampah.',
      'Membantu pengemasan dan penyimpanan sementara yang rapi.',
      'Mengajak warga untuk konsisten memilah dari rumah.',
      'Tidak mengunggah data warga tanpa persetujuan.',
      'Siap bertugas di akhir pekan pagi hari.',
    ],
    donation_instructions:
      'Donasi via DANA/LinkAja ke nomor resmi panitia atau transfer BNI 3344556677.',
  },
  {
    id: '15',
    title: 'Kelas Coding Dasar untuk Pelajar',
    category: 'Edukasi',
    date: new Date(Date.now() + 14 * 86400000).toISOString(),
    location: 'Sleman',
    slots: 20,
    coverUrl:
      'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200',
    summary:
      'Pengenalan logika pemrograman dan pembuatan mini-game dengan JavaScript. Sesi mencakup variabel, kondisi, perulangan, dan event dasar dengan latihan praktik langsung.',
    donation_collected: 900000,
    donation_target: 3500000,
    requirements: [
      'Menguasai dasar HTML/CSS/JS; mampu menjelaskan konsep sederhana.',
      'Mempersiapkan contoh kode dan materi langkah-demi-langkah.',
      'Sabar mendampingi peserta yang baru pertama kali ngoding.',
      'Mampu troubleshooting error sederhana di komputer peserta.',
      'Datang lebih awal untuk setup perangkat & jaringan.',
      'Bersedia memberikan umpan balik tertulis kepada peserta.',
    ],
    donation_instructions:
      'Transfer ke Permata 5566001122 a.n Kelas Koding Nusantara.',
  },
];
