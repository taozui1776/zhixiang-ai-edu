import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { TeacherAuthProvider } from "@/context/TeacherAuthContext";
import RequireAuth from "@/components/RequireAuth";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";
import HomePage from "@/pages/HomePage/HomePage";
import LoginPage from "@/pages/LoginPage/LoginPage";
import CourseLibraryPage from "@/pages/CourseLibraryPage/CourseLibraryPage";
import CourseDetailPage from "@/pages/CourseDetailPage/CourseDetailPage";
import ToolsPage from "@/pages/ToolsPage/ToolsPage";
import CodingLabPage from "@/pages/CodingLabPage/CodingLabPage";
import TrainingPage from "@/pages/TrainingPage/TrainingPage";
import AiToolsPage from "@/pages/AiToolsPage/AiToolsPage";
import HardwarePage from "@/pages/HardwarePage/HardwarePage";
import AiLabPage from "@/pages/AiLabPage/AiLabPage";
import AiLabProjectPage from "@/pages/AiLabPage/AiLabProjectPage";
import TeachModePage from "@/pages/TeachModePage/TeachModePage";
import TeacherCenterPage from "@/pages/TeacherCenterPage/TeacherCenterPage";
import CopyrightPage from "@/pages/CopyrightPage/CopyrightPage";
import KnowledgeMapPage from "@/pages/KnowledgeMapPage/KnowledgeMapPage";
import StudentCenterPage from "@/pages/StudentCenterPage/StudentCenterPage";
import AfterSchoolPage from "@/pages/AfterSchoolPage/AfterSchoolPage";
import ChallengeDetailPage from "@/pages/AfterSchoolPage/ChallengeDetailPage";
import PblProjectPage from "@/pages/PblProjectPage/PblProjectPage";
import VisionCoursePage from "@/pages/VisionCoursePage/VisionCoursePage";
import CoursePrintPage from "@/pages/CoursePrintPage/CoursePrintPage";
import HardwareConnectPage from "@/pages/HardwareConnectPage/HardwareConnectPage";
import FirmwareCenterPage from "@/pages/FirmwareCenterPage/FirmwareCenterPage";
import AiModelCenterPage from "@/pages/AiModelCenterPage/AiModelCenterPage";
import OpenPlatformPage from "@/pages/OpenPlatformPage/OpenPlatformPage";
import DataManagementPage from "@/pages/DataManagementPage/DataManagementPage";
import AiTrainingPage from "@/pages/AiTrainingPage/AiTrainingPage";
import EdgeAiPage from "@/pages/EdgeAiPage/EdgeAiPage";
import ClassManagementPage from "@/pages/ClassManagementPage/ClassManagementPage";
import AnalyticsCenterPage from "@/pages/AnalyticsCenterPage/AnalyticsCenterPage";
import TeacherTrainingPage, { TeacherTrainingDetailPage } from "@/pages/TeacherTrainingPage/TeacherTrainingPage";
import ProfilePage from "@/pages/ProfilePage/ProfilePage";
import SchoolAdminPage from "@/pages/SchoolAdminPage/SchoolAdminPage";
import SubscriptionPage from "@/pages/SubscriptionPage/SubscriptionPage";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import PreparePage from "@/pages/PreparePage/PreparePage";
import MyMaterialsPage from "@/pages/MyMaterialsPage/MyMaterialsPage";

export default function App() {
  return (
    <TeacherAuthProvider>
      <Routes>
      {/* 登录页（独立布局，无Header/Footer） */}
      <Route path="/login" element={<LoginPage />} />

      {/* 主布局（需登录） */}
      <Route element={<RequireAuth><Layout /></RequireAuth>}>
        <Route index element={<HomePage />} />
        <Route path="courses" element={<CourseLibraryPage />} />
        <Route path="courses/:courseId" element={<CourseDetailPage />} />
        <Route path="prepare" element={<PreparePage />} />
        <Route path="my-materials" element={<MyMaterialsPage />} />
        <Route path="tools" element={<ToolsPage />} />
        <Route path="coding-lab" element={<CodingLabPage />} />
        <Route path="training" element={<TrainingPage />} />
        <Route path="ai-tools" element={<AiToolsPage />} />
        <Route path="ai-lab" element={<AiLabPage />} />
        <Route path="ai-lab/:projectId" element={<AiLabProjectPage />} />
        <Route path="teach/:courseId" element={<TeachModePage />} />
        <Route path="hardware" element={<HardwarePage />} />
        <Route path="hardware/connect" element={<HardwareConnectPage />} />
        <Route path="hardware/firmware" element={<FirmwareCenterPage />} />
        <Route path="ai-model-center" element={<AiModelCenterPage />} />
        <Route path="ai-training" element={<AiTrainingPage />} />
        <Route path="edge-ai" element={<EdgeAiPage />} />
        <Route path="open-platform" element={<OpenPlatformPage />} />
        <Route path="teacher" element={<TeacherCenterPage />} />
        <Route path="copyright" element={<CopyrightPage />} />
        <Route path="vision" element={<VisionCoursePage />} />
        <Route path="knowledge-map" element={<KnowledgeMapPage />} />
        <Route path="student" element={<StudentCenterPage />} />
        <Route path="after-school" element={<AfterSchoolPage />} />
        <Route path="after-school/challenge/:id" element={<ChallengeDetailPage />} />
        <Route path="pbl/:projectId" element={<PblProjectPage />} />
        <Route path="print/:lessonId" element={<CoursePrintPage />} />

        {/* 第三批：B端教学平台完整页面 */}
        <Route element={<SubscriptionGuard />}>
          <Route path="analytics" element={<AnalyticsCenterPage />} />
          <Route path="class" element={<ClassManagementPage />} />
          <Route path="school" element={<SchoolAdminPage />} />
          <Route path="data-management" element={<DataManagementPage />} />
        </Route>
        <Route path="teacher-training" element={<TeacherTrainingPage />} />
        <Route path="teacher-training/:tutorialId" element={<TeacherTrainingDetailPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="pricing" element={<SubscriptionPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </TeacherAuthProvider>
  );
}
