import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import AppShell from './components/AppShell'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import CourseMapPage from './pages/CourseMapPage'
import LessonPage from './pages/LessonPage'
import GlossaryPage from './pages/GlossaryPage'
import ProgressPage from './pages/ProgressPage'
import LagPlaygroundPage from './pages/LagPlaygroundPage'
import RegressionPlaygroundPage from './pages/RegressionPlaygroundPage'
import ExpandingSimPage from './pages/ExpandingSimPage'
import ForecastExplorerPage from './pages/ForecastExplorerPage'
import NotebookWalkthroughPage from './pages/NotebookWalkthroughPage'
import MockMeetingPage from './pages/MockMeetingPage'
import FinalChallengePage from './pages/FinalChallengePage'
import NotFoundPage from './pages/NotFoundPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/map" element={<CourseMapPage />} />
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/playground/lag" element={<LagPlaygroundPage />} />
          <Route path="/playground/regression" element={<RegressionPlaygroundPage />} />
          <Route path="/playground/expanding" element={<ExpandingSimPage />} />
          <Route path="/playground/forecast" element={<ForecastExplorerPage />} />
          <Route path="/notebook" element={<NotebookWalkthroughPage />} />
          <Route path="/meeting" element={<MockMeetingPage />} />
          <Route path="/final" element={<FinalChallengePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}
