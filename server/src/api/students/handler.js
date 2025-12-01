// Import Service yang sudah dipecah
const ProfileService = require("../../services/student/ProfileService");
const CourseService = require("../../services/course/CourseService");
const LearningService = require("../../services/learning/LearningService");

const StudentHandler = {
  // === PROFILE GROUP ===
  async getProfile(request, h) {
    const userId = request.auth.credentials.id;
    const profile = await ProfileService.getProfile(userId);
    return h.response({ status: "success", data: profile });
  },

  async getMyCourses(request, h) {
    const userId = request.auth.credentials.id;
    const courses = await ProfileService.getMyCourses(userId);
    return h.response({ status: "success", data: courses });
  },

  async getMySubmissions(request, h) {
    const userId = request.auth.credentials.id;
    const submissions = await ProfileService.getMySubmissions(userId);
    return h.response({ status: "success", data: submissions });
  },

  // === COURSE GROUP ===
  async getPublicCourses(request, h) {
    const courses = await CourseService.getPublicCourses();
    return h.response({ status: "success", data: courses });
  },

  async getCourseDetail(request, h) {
    const journeyId = parseInt(request.params.id);
    const userId = request.auth.isAuthenticated
      ? request.auth.credentials.id
      : null;
    const userRole = request.auth.credentials
      ? request.auth.credentials.role
      : "student";
    const result = await CourseService.getCourseDetail(
      journeyId,
      userId,
      userRole
    );
    return h.response({ status: "success", data: result });
  },

  // === LEARNING GROUP ===
  async enroll(request, h) {
    const userId = request.auth.credentials.id;
    const journeyId = parseInt(request.params.id);
    const result = await LearningService.enrollCourse(userId, journeyId);
    return h
      .response({
        status: "success",
        message: "Berhasil mendaftar",
        data: result,
      })
      .code(201);
  },

  async getModule(request, h) {
    const userId = request.auth.credentials.id;
    const tutorialId = parseInt(request.params.id);
    const content = await LearningService.getModuleContent(tutorialId, userId);
    return h.response({ status: "success", data: content });
  },

  async completeModule(request, h) {
    const userId = request.auth.credentials.id;
    const tutorialId = parseInt(request.params.id); // ID Modul dari URL

    const result = await LearningService.completeModule(userId, tutorialId);

    return h.response({
      status: "success",
      message: "Modul selesai",
      data: result,
    });
  },

  async submitAssignment(request, h) {
    const userId = request.auth.credentials.id;

    // Ambil ID dari URL (Params)
    const journeyId = parseInt(request.params.journeyId);
    const tutorialId = parseInt(request.params.tutorialId);

    // Panggil Service (LearningService)
    // Payload berisi: app_link, app_comment
    const result = await LearningService.submitAssignment(
      userId,
      journeyId,
      tutorialId,
      request.payload
    );

    return h
      .response({
        status: "success",
        message: "Tugas berhasil dikirim",
        data: result,
      })
      .code(201);
  },

  async updateProfile(request, h) {
    const userId = request.auth.credentials.id;
    const profileData = request.payload;
    const updatedProfile = await ProfileService.updateProfile(
      userId,
      profileData
    );
    return h.response({ status: "success", data: updatedProfile }).code(200);
  },

  async changePassword(request, h) {
    // 1. Ambil ID user dari token JWT
    const userId = request.auth.credentials.id;

    // 2. Ambil data dari body request
    const { currentPassword, newPassword } = request.payload;

    // 3. Panggil Service
    await ProfileService.changePassword(userId, currentPassword, newPassword);

    // 4. Return response sukses
    const response = h.response({
      status: 'success',
      message: 'Password berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

};

module.exports = StudentHandler;
