/**
 * File data/destinations.js
 * Berisi data statis destinasi wisata untuk keperluan Tugas 1.
 * Data ini diekspor agar bisa digunakan oleh fungsi-fungsi di lib/api.js.
 */

export const destinations = [
  {
    id: 1,
    slug: "wae-rebo-ntt",
    name: "Desa Wae Rebo",
    region: "Nusa Tenggara Timur",
    image: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=1200",
    shortDescription: "Kampung adat legendaris di atas awan dengan rumah kerucut Mbaru Niang.",
    fullStory: "Terletak di ketinggian 1.200 meter di atas permukaan laut, Desa Wae Rebo adalah permata tersembunyi di Flores. Desa ini dikenal dengan tujuh rumah adat berbentuk kerucut yang disebut Mbaru Niang, yang telah dipertahankan selama bergenerasi-generasi. Kehidupan di sini sangat harmonis dengan alam, di mana penduduknya masih memegang teguh adat istiadat leluhur dalam bertani dan bermasyarakat.\n\nPerjalanan menuju Wae Rebo bukanlah hal yang mudah, membutuhkan trekking selama beberapa jam melalui hutan pegunungan yang asri. Namun, kelelahan itu akan terbayar lurus saat melihat kabut pagi menyelimuti rumah-rumah kerucut ini. Pengunjung tidak hanya melihat pemandangan, tapi juga diajak merasakan ritme hidup masyarakat Manggarai yang tenang.\n\nWarisan budaya Wae Rebo telah mendapatkan pengakuan dari UNESCO sebagai warisan budaya dunia. Di sini, kopi adalah minuman wajib dan lambang keramahan. Setiap tamu yang datang akan disambut melalui upacara adat Waelu sebagai bentuk penghormatan dan permohonan perlindungan kepada leluhur.",
    culturalNotes: [
      "Rumah Mbaru Niang memiliki 5 tingkat dengan fungsi berbeda.",
      "Upacara Penti adalah perayaan syukur atas hasil panen.",
      "Setiap rumah dihuni oleh beberapa keluarga besar secara komunal."
    ],
    howToGetThere: "Terbang ke Labuan Bajo, lalu berkendara sekitar 4-6 jam ke Desa Denge, dilanjutkan dengan trekking 2-3 jam menuju lokasi.",
    coordinates: { lat: -8.7719, lng: 120.2872 }
  },
  {
    id: 2,
    slug: "sumba-pasola",
    name: "Sumba Internal (Tradisi Pasola)",
    region: "Nusa Tenggara Timur",
    image: "https://images.unsplash.com/photo-1590518712391-764953c8981d?q=80&w=1200",
    shortDescription: "Saksi bisu keberanian ksatria berkuda Sumba dalam ritual kepercayaan Marapu.",
    fullStory: "Sumba bukan sekadar pantai pasir putih yang indah. Di pedalamannya, tradisi megalitik masih sangat kental terasa. Pasola adalah puncak dari segala upacara adat di Sumba Barat dan Sumba Barat Daya. Ini adalah permainan ketangkasan melempar lembing kayu dari atas kuda yang sedang dipacu kencang antara dua kelompok 'ksatria'.\n\nPasola bukan sekadar tontonan, melainkan bagian dari ritual kepercayaan Marapu untuk memohon kesuburan tanah dan hasil panen yang melimpah. Darah yang jatuh ke tanah saat Pasola dianggap sebagai pengorbanan yang menyuburkan bumi. Upacara ini biasanya diawali dengan kedatangan Nyale (cacing laut warna-warni) di pinggir pantai.\n\nSelain Pasola, Sumba dikenal dengan rumah-rumah beratap tinggi (Menara) dan kain tenun ikatnya yang memiliki motif filosofis mendalam. Setiap motif menceritakan sejarah keluarga, status sosial, hingga hubungan manusia dengan alam gaib.",
    culturalNotes: [
      "Pasola diadakan antara bulan Februari hingga Maret.",
      "Kepercayaan Marapu adalah inti dari setiap sendi kehidupan masyarakat Sumba.",
      "Kain Tenun Ikat Sumba bisa memakan waktu pengerjaan hingga bertahun-tahun."
    ],
    howToGetThere: "Terbang ke Bandara Tambolaka (Sumba Barat Daya), lalu sewa kendaraan menuju wilayah Kodi atau Wanokaka sesuai jadwal upacara.",
    coordinates: { lat: -9.6586, lng: 119.4122 }
  },
  {
    id: 3,
    slug: "tana-toraja-rambu-solo",
    name: "Tana Toraja",
    region: "Sulawesi Selatan",
    image: "https://images.unsplash.com/photo-1521124430419-9488d601050e?q=80&w=1200",
    shortDescription: "Perayaan kehidupan melalui upacara kematian yang paling megah di dunia.",
    fullStory: "Bagi masyarakat Toraja, kematian bukanlah akhir dari segalanya, melainkan sebuah perpindahan menuju alam baka yang disebut Puya. Hal ini mendasari Rambu Solo, upacara pemakaman yang sangat kompleks dan bisa berlangsung berhari-hari. Keluarga yang ditinggalkan akan menjamu ribuan tamu dan menyembelih kerbau sebagai bekal perjalanan arwah.\n\nLanskap Tana Toraja dihiasi dengan deretan Tongkonan, rumah adat dengan atap melengkung menyerupai tanduk kerbau atau perahu. Selain arsitekturnya, Toraja terkenal dengan pekuburan tebing di Lemo atau Londa, di mana patung-patung kayu (Tau-tau) diletakkan sebagai representasi dari mereka yang telah wafat.\n\nKopi Toraja yang mendunia juga lahir dari tanah pegunungan yang subur ini. Perpaduan antara mistisisme, keindahan alam perbukitan, dan keramahtamahan penduduknya menjadikan Toraja sebagai destinasi budaya yang tak tertandingi di Indonesia.",
    culturalNotes: [
      "Mayat yang belum diupacarakan dianggap sebagai orang sakit (Makula').",
      "Jumlah kerbau yang disembelih menunjukkan status sosial keluarga.",
      "Tongkonan harus selalu menghadap ke arah utara."
    ],
    howToGetThere: "Terbang ke Makassar, lalu lanjutkan perjalanan darat sekitar 8-10 jam, atau terbang langsung ke Bandara Toraja di Buntu Kunik.",
    coordinates: { lat: -2.9823, lng: 119.8967 }
  },
  {
    id: 4,
    slug: "baduy-dalam-banten",
    name: "Suku Baduy Dalam",
    region: "Banten",
    image: "https://images.unsplash.com/photo-1627663240375-7153f3e18a8d?q=80&w=1200",
    shortDescription: "Penjaga tradisi Sunda kuno yang hidup dalam kesederhanaan tanpa teknologi.",
    fullStory: "Hanya beberapa jam dari hiruk-pikuk Jakarta, terdapat sebuah masyarakat yang menolak dunia modern demi menjaga amanah leluhur. Suku Baduy Dalam, atau Urang Kanekes, hidup di kaki pegunungan Kendeng dengan aturan adat yang sangat ketat: tidak ada alas kaki, tidak ada kendaraan, dan sama sekali tidak ada perangkat elektronik.\n\nMereka adalah penjaga ekosistem hutan yang luar biasa. Prinsip hidup mereka, 'Gunung teu meunang dilebur, lebak teu meunang dirusak' (Gunung tidak boleh dihancurkan, lembah tidak boleh dirusak), terbukti dengan asrinya lingkungan tempat tinggal mereka. Pengunjung yang masuk ke wilayah Baduy Dalam harus mematuhi aturan untuk tidak memotret dan menjaga kebersihan sungai.\n\nKehidupan di sini sangat tenang, diatur oleh ritme alam dan kalender adat. Mereka bercocok tanam padi gogo di ladang (huma) dan menenun kain secara tradisional. Berinteraksi dengan warga Baduy memberikan perspektif baru tentang arti kecukupan dan kebahagiaan sejati.",
    culturalNotes: [
      "Pakaian putih adalah ciri khas warga Baduy Dalam.",
      "Warga Baduy Dalam berjalan kaki puluhan kilometer menuju kota tanpa alas kaki.",
      "Terdapat 3 kampung utama di Baduy Dalam: Cibeo, Cikertawana, dan Cikeusik."
    ],
    howToGetThere: "Naik KRL ke Stasiun Rangkasbitung, lanjut Elf ke Ciboleger, lalu trekking 4-5 jam menuju perkampungan Baduy Dalam.",
    coordinates: { lat: -6.6133, lng: 106.2239 }
  },
  {
    id: 5,
    slug: "pulau-banda-maluku",
    name: "Pulau Banda Neira",
    region: "Maluku",
    image: "https://images.unsplash.com/photo-1626548301131-419f80907d0d?q=80&w=1200",
    shortDescription: "Kepulauan rempah yang mengubah jalannya sejarah kolonialisme dunia.",
    fullStory: "Banda Neira dulunya adalah satu-satunya tempat di dunia di mana pohon pala tumbuh. Karena rempah kecil ini, bangsa-bangsa Eropa saling berperang untuk memperebutkan kekuasaan di sini. Kini, Banda Neira adalah sebuah kota tua yang tenang dengan sisa-sisa kemegahan kolonial Belanda dan benteng-benteng yang masih berdiri kokoh.\n\nBawah laut Banda adalah salah satu yang terkaya di dunia, dengan terumbu karang yang sehat dan jarak pandang yang sangat jernih. Gunung Api Banda yang menjulang di seberang kota menambah dramatis pemandangan matahari terbenam. Budaya di sini merupakan perpaduan antara pengaruh Arab, Eropa, dan lokal Maluku.\n\nSetiap sudut Banda memiliki cerita. Mulai dari pengasingan para tokoh bangsa seperti Hatta dan Sjahrir, hingga tradisi Belang (lomba perahu naga) yang melambangkan semangat juang masyarakat laut. Banda adalah tempat di mana sejarah, budaya, dan keindahan alam menyatu dengan sempurna.",
    culturalNotes: [
      "Benteng Belgica adalah benteng pertahanan yang sangat baik kondisinya.",
      "Pulau Run di Banda pernah ditukar dengan Pulau Manhattan di New York.",
      "Istana Mini adalah miniatur Istana Bogor peninggalan Gubernur Jenderal Belanda."
    ],
    howToGetThere: "Terbang ke Ambon, dilanjutkan dengan pesawat perintis atau kapal cepat (Susi Air atau Pelni) menuju Banda Neira.",
    coordinates: { lat: -4.5244, lng: 129.9036 }
  },
  {
    id: 6,
    slug: "lembah-baliem-papua",
    name: "Lembah Baliem",
    region: "Papua",
    image: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=1200",
    shortDescription: "Keajaiban di jantung Pegunungan Tengah Papua, rumah bagi suku Dani.",
    fullStory: "Lembah Baliem ditemukan oleh dunia luar secara tidak sengaja pada tahun 1938. Tersembunyi di balik barisan pegunungan Jayawijaya, lembah ini dihuni oleh suku Dani yang telah menetap di sini selama ribuan tahun. Pemandangan lembah ini sangat megah, dengan hamparan rumput hijau dan pegunungan yang menjulang tinggi.\n\nFestival Budaya Lembah Baliem adalah acara tahunan yang sangat terkenal, di mana berbagai suku (Dani, Lani, dan Yali) berkumpul untuk menunjukkan simulasi perang antarsuku. Ini bukan perang sesungguhnya, melainkan bentuk pelestarian budaya dan persahabatan. Suara teriakan perang dan tabuhan alat musik tradisional menggema di seluruh lembah.\n\nRumah tradisional suku Dani yang disebut Honai, memiliki bentuk bulat dengan atap jerami yang sangat efisien dalam menjaga kehangatan di malam hari yang dingin. Di sini, pengunjung bisa melihat mumi-mumi leluhur yang diawetkan dengan cara pengasapan tradisional, yang dihormati sebagai penjaga kedaulatan tanah.",
    culturalNotes: [
      "Upacara bakar batu adalah cara memasak tradisional paling sakral.",
      "Koteka adalah pakaian tradisional pria yang memiliki makna fungsional dan simbolis.",
      "Mumi di Desa Jiwika telah berusia ratusan tahun."
    ],
    howToGetThere: "Terbang ke Jayapura (Bandara Sentani), lalu lanjut penerbangan domestik ke Wamena. Eksplorasi dilakukan dengan berkendara atau trekking dari Wamena.",
    coordinates: { lat: -4.0167, lng: 138.9167 }
  },
  {
    id: 7,
    slug: "suku-mentawai-sumbar",
    name: "Suku Mentawai",
    region: "Sumatera Barat",
    image: "https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=1200",
    shortDescription: "Para perajah tubuh tertua di dunia dan penjaga harmoni hutan hujan.",
    fullStory: "Kepulauan Mentawai tidak hanya tentang ombak kelas dunia bagi para peselancar. Di pedalaman Pulau Siberut, hidup suku Mentawai yang dikenal sebagai 'orang hutan'. Mereka adalah salah satu suku tertua di Indonesia yang masih menjalankan tradisi Arat Sabulungan, sebuah kepercayaan yang mengedepankan keseimbangan antara manusia, roh, dan alam.\n\nSikerei (dukun adat) adalah tokoh sentral dalam masyarakat Mentawai. Tubuh mereka dipenuhi dengan tato (Titi) yang dianggap sebagai identitas dan keindahan. Tato Mentawai diakui sebagai salah satu seni rajah tubuh tertua di dunia, dengan proses pengerjaan menggunakan duri pohon dan pewarna alami dari arang.\n\nRumah adat mereka, Uma, adalah bangunan kayu besar yang menjadi pusat kegiatan sosial dan ritual. Di sini, tengkorak hewan buruan dipajang sebagai bentuk penghormatan kepada roh hewan tersebut. Hidup bersama suku Mentawai berarti masuk ke dalam dunia di mana setiap benda memiliki jiwa.",
    culturalNotes: [
      "Tato Mentawai memiliki motif yang melambangkan keseimbangan alam.",
      "Sikerei memimpin upacara penyembuhan dan pembersihan rumah.",
      "Sagu adalah makanan pokok utama bagi masyarakat Mentawai."
    ],
    howToGetThere: "Terbang ke Padang, lalu naik kapal cepat Mentawai Fast dari pelabuhan Muaro menuju Muara Siberut, dilanjutkan dengan perahu kayu (pompong) ke hulu sungai.",
    coordinates: { lat: -1.3853, lng: 98.9248 }
  },
  {
    id: 8,
    slug: "kampung-naga-jabar",
    name: "Kampung Naga",
    region: "Jawa Barat",
    image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1200",
    shortDescription: "Benteng terakhir budaya Sunda yang menolak pengaruh modernitas di lembah subur.",
    fullStory: "Kampung Naga adalah sebuah desa adat yang terletak di lembah Sungai Ciwulan, Tasikmalaya. Berbeda dengan masyarakat di sekitarnya, penduduk Kampung Naga tetap memegang teguh adat istiadat leluhur mereka dan menolak listrik serta penggunaan peralatan elektronik. Desa ini terlihat sangat asri dengan rumah-rumah panggung yang seragam menghadap ke arah yang sama.\n\nStruktur bangunan rumah di Kampung Naga sangat unik, terbuat dari kayu, bambu, dan atap ijuk atau alang-alang. Tidak boleh ada cat atau perhiasan berlebihan. Hal ini mencerminkan filosofi hidup 'sahaja' atau sederhana. Mereka hidup dengan bertani padi dan membuat kerajinan bambu.\n\nHutan di sekeliling kampung dijaga sangat ketat melalui aturan 'Hutan Larangan' dan 'Hutan Tutupan' yang tidak boleh dimasuki sembarangan. Keseimbangan ekosistem ini membuat Kampung Naga selalu berlimpah air bersih dan terhindar dari bencana alam. Berkunjung ke sini adalah perjalanan kembali ke akar budaya Sunda yang murni.",
    culturalNotes: [
      "Semua rumah harus memiliki desain dan arah yang sama.",
      "Upacara Hajat Sasih dilakukan secara rutin sebagai bentuk penghormatan leluhur.",
      "Jumlah rumah di Kampung Naga relatif tetap sejak dahulu kala."
    ],
    howToGetThere: "Berkendara dari Bandung ke arah Tasikmalaya via Garut. Lokasi berada di pinggir jalan raya Salawu, dilanjutkan dengan menuruni ratusan anak tangga ke lembah.",
    coordinates: { lat: -7.3621, lng: 107.9942 }
  }
];
