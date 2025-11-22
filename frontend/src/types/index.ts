export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "admin";
  image_path?: string;
}

export interface Course {
  id: number;
  name: string;
  summary: string;
  description?: string;
  image_path?: string;
  point: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  status?: "draft" | "published";
  // Field khusus dashboard siswa
  progress?: number;
  last_activity?: string;
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

export interface CourseDetail {
  id: number;
  name: string;
  description: string;
  image_path?: string;
  point: number;
  difficulty: string;
  instructor?: { name: string };

  // State dari Backend
  is_enrolled: boolean;
  progress: number;
  cta_state: "enroll" | "continue";
  last_accessed_tutorial_id: number | null;

  // Silabus
  developer_journey_tutorials: {
    user_status: string;
    id: number;
    title: string;
    type: string;
    is_locked: boolean;
    is_completed: boolean;
  }[];
}

export interface Module {
  id: number;
  developer_journey_id: number;
  title: string;
  type: "article" | "video" | "quiz" | "submission";
  content?: string; // HTML content atau URL Video
  position: number;
  status: "draft" | "published";
  current_status?: "viewed" | "in_progress" | "submitted" | "finished";
  submission_status?: "submitted" | "passed" | "failed" | null;
  submission_note?: string | null;
  next_tutorial_id?: number | null;
}

export interface CompletionResponse {
  tutorial_id: number;
  is_completed: boolean;
  course_progress: number;
  course_status: string;
  next_tutorial_id: number | null;
}
