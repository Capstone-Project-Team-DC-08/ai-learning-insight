require("dotenv").config(); // Membaca file .env
const Hapi = require("@hapi/hapi");
const Jwt = require("hapi-auth-jwt2");

// Import Routes yang sudah kita buat
const authRoutes = require("./api/auth/routes");
const studentRoutes = require("./api/students/routes");
const adminRoutes = require("./api/admin/routes");

const init = async () => {
  // 1. Inisialisasi Server
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || "localhost",
    routes: {
      cors: {
        origin: [ "http://localhost:3000"],
        credentials: true,
        headers: ["Content-Type", "Authorization"],
        additionalHeaders: ["Authorization"],
      },
    },
  });
  //"https://pacupintar.netlify.app"

  // 2. Registrasi Plugin Autentikasi (JWT)
  await server.register(Jwt);

  // 3. Definisi Strategi Autentikasi
  // Ini adalah "Satpam" yang mengecek apakah user membawa token yang valid
  server.auth.strategy("jwt", "jwt", {
    key: process.env.JWT_SECRET, // Kunci rahasia dari .env
    validate: async (decoded, request, h) => {
      // 'decoded' adalah isi token yang sudah dibuka (id & role)
      // Jika token valid, return true.
      // Nanti kita bisa tambah logika cek user aktif/tidak di sini.
      return { isValid: true };
    },
    verifyOptions: { algorithms: ["HS256"] },
  });

  // Set default auth strategy (opsional, tapi bagus untuk keamanan default)
  // server.auth.default('jwt');
  // Catatan: Kita tidak set default dulu agar route Register/Login bisa diakses tanpa token.

  // 4. Daftarkan Routes
  server.route([...authRoutes, ...studentRoutes, ...adminRoutes]);

  // 5. Jalankan Server
  await server.start();
  console.log("🚀 Server berjalan pada %s", server.info.uri);
};

// Menangani error jika server gagal start
process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
