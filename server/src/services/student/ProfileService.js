const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Boom = require("@hapi/boom");

class ProfileService {
  // Ambil Profil User
  async getProfile(userId) {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        user_role: true,
        image_path: true,
      },
    });
    if (!user) throw Boom.notFound("User tidak ditemukan");
    return user;
  }

  // Dashboard: Kelas Saya (Menggunakan tabel enrollments)
  async getMyCourses(userId) {
    const enrollments = await prisma.enrollments.findMany({
      where: { user_id: userId },
      include: {
        journey: {
          select: {
            id: true,
            name: true,
            image_path: true,
            point: true,
            difficulty: true,
          },
        },
      },
      orderBy: { last_accessed_at: "desc" },
    });

    return enrollments.map((e) => ({
      id: e.journey.id,
      name: e.journey.name,
      image: e.journey.image_path,
      point: e.journey.point,
      difficulty: e.journey.difficulty,
      status: e.status,
      progress: e.current_progress,
      enrolled_at: e.enrolled_at,
      last_activity: e.last_accessed_at,
    }));
  }

  // History Submission Saya
  async getMySubmissions(userId) {
    return await prisma.developer_journey_submissions.findMany({
      where: { submitter_id: userId },
      include: {
        journey: { select: { name: true } },
        quiz: { select: { title: true } },
      },
      orderBy: { created_at: "desc" },
    });
  }
}

module.exports = new ProfileService();
