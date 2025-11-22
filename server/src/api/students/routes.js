const StudentHandler = require("./handler");
const Joi = require("joi");

const routes = [
  {
    method: "GET",
    path: "/student/profile",
    options: {
      auth: "jwt", // GEMBOK: Hanya user login yang bisa akses
      description: "Get logged in user profile",
      handler: StudentHandler.getProfile,
    },
  },
  {
    method: "GET",
    path: "/courses",
    options: {
      auth: false, // PUBLIK: Orang belum login boleh lihat katalog
      description: "List all public courses",
      handler: StudentHandler.getPublicCourses,
    },
  },
  {
    method: "GET",
    path: "/student/my-courses",
    options: {
      auth: "jwt", // GEMBOK: Harus login
      description: "Get courses enrolled by student",
      handler: StudentHandler.getMyCourses,
    },
  },
  {
    method: "POST",
    path: "/courses/{id}/enroll",
    options: {
      auth: "jwt",
      description: "Enroll user ke kelas",
      handler: StudentHandler.enroll,
    },
  },
  {
    method: "GET",
    path: "/learning/module/{id}",
    options: {
      auth: "jwt",
      description: "Baca materi (auto check enrollment)",
      handler: StudentHandler.getModule,
    },
  },
  {
    method: "GET",
    path: "/courses/{id}",
    options: {
      // PENTING: mode 'optional' & strategy 'jwt'
      // Artinya: Jika bawa token -> dilayani sebagai user.
      // Jika tidak bawa token -> dilayani sebagai guest (tidak error 401).
      auth: {
        strategy: "jwt",
        mode: "optional",
      },
      description: "Get Course Detail (Smart View)",
      handler: StudentHandler.getCourseDetail,
    },
  },
  {
    method: "POST",
    path: "/learning/module/{id}/complete",
    options: {
      auth: "jwt",
      description: "Tandai modul sebagai selesai & update progress",
      handler: StudentHandler.completeModule,
    },
  },

  {
    method: "POST",
    // Struktur URL yang jelas hierarkinya
    path: "/courses/{journeyId}/modules/{tutorialId}/submit",
    options: {
      auth: "jwt", // Wajib Login
      description: "Siswa mengirim tugas (Submission)",
      validate: {
        // 1. Validasi Parameter URL (ID harus angka)
        params: Joi.object({
          journeyId: Joi.number().integer().required(),
          tutorialId: Joi.number().integer().required(),
        }),
        // 2. Validasi Body (Link Project Wajib)
        payload: Joi.object({
          app_link: Joi.string().uri().required().messages({
            "string.uri": "Link harus berupa URL yang valid (http/https)",
          }),
          app_comment: Joi.string().allow("").optional(),
        }),
      },
      handler: StudentHandler.submitAssignment,
    },
  },
];

module.exports = routes;
