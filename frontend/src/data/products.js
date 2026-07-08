export const pricelist = {
  tanpaPigura: [
    { name: "A4 Hitam Putih", amount: "Rp30.000" },
    { name: "A4 Warna", amount: "Rp40.000" },
    { name: "A5 Hitam Putih", amount: "Rp25.000" },
    { name: "A5 Warna", amount: "Rp30.000" },
    { name: "A3 Hitam Putih", amount: "Rp50.000" },
    { name: "A3 Warna", amount: "Rp60.000" }
  ],
  denganPigura: [
    { name: "A4 Hitam Putih", amount: "Rp50.000" },
    { name: "A4 Warna", amount: "Rp60.000" },
    { name: "A5 Hitam Putih", amount: "Rp40.000" },
    { name: "A5 Warna", amount: "Rp50.000" }
  ],
  tambahan: [
    { name: "Potret Solo (1 Wajah)", amount: "+Rp0", tag: "Potret Solo" },
    { name: "Pasangan (2 Wajah)", amount: "+Rp5.000", tag: "Pasangan" },
    { name: "Background (Latar Kustom)", amount: "+Rp10.000", tag: "Background" }
  ]
};

export const products = [
  {
    id: "sketsa-solo",
    name: "Potret Solo",
    category: "Opsi Tambahan",
    description: "Sketsa potret 1 wajah tunggal (Solo) tanpa biaya tambahan.",
    price: { "Biaya Tambahan": "+Rp0" },
    features: ["Fokus detail 1 wajah", "Tanpa biaya tambahan", "Gratis file digital"],
    duration: "3-5 Hari Kerja",
    image: "https://res.cloudinary.com/dpdzxeukl/image/upload/v1783505180/ilustrasi/x8kw4rvertca9irt0trd.jpg"
  },
  {
    id: "sketsa-pasangan",
    name: "Pasangan",
    category: "Opsi Tambahan",
    description: "Sketsa potret 2 wajah (Pasangan) dalam satu bidang gambar dengan tambahan biaya 5k.",
    price: { "Biaya Tambahan": "+Rp5.000" },
    features: ["Menggambar 2 wajah", "Biaya tambahan Rp5.000", "Cocok untuk kado couple"],
    duration: "3-5 Hari Kerja",
    image: "https://res.cloudinary.com/dpdzxeukl/image/upload/v1783505196/ilustrasi/juqgeldo9rln97ooltko.jpg"
  },
  {
    id: "sketsa-background",
    name: "Background",
    category: "Opsi Tambahan",
    description: "Sketsa wajah dengan latar belakang kustom dengan tambahan biaya 10k.",
    price: { "Biaya Tambahan": "+Rp10.000" },
    features: ["Latar belakang kustom", "Biaya tambahan Rp10.000", "Lebih hidup & tematik"],
    duration: "3-5 Hari Kerja",
    image: "https://res.cloudinary.com/dpdzxeukl/image/upload/v1783505209/ilustrasi/mghtr4xhtdlyfq0w9r6c.jpg"
  }
];
