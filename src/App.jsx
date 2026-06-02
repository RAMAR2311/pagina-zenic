import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Servicios from './pages/Servicios'
import Nosotros from './pages/Nosotros'
import Precios from './pages/Precios'
import CasosDeExito from './pages/CasosDeExito'
import Blog from './pages/Blog'
import BlogArticulo from './pages/BlogArticulo'
import Contacto from './pages/Contacto'
import Admin from './pages/Admin'
import { ContentProvider } from './store/ContentContext'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const location = useLocation()
  const isAdmin = location.pathname === '/admin'

  const toggleDarkMode = () => setDarkMode((prev) => !prev)

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode)
  }, [darkMode])

  return (
    <ContentProvider>
      <div style={{
        minHeight: '100vh',
        background: darkMode ? '#0D0B14' : '#E8E8F2',
        transition: 'background 0.5s ease',
      }}>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        <Routes>
          <Route path="/"            element={<Home          darkMode={darkMode} />} />
          <Route path="/servicios"   element={<Servicios     darkMode={darkMode} />} />
          <Route path="/precios"     element={<Precios       darkMode={darkMode} />} />
          <Route path="/casos"       element={<CasosDeExito  darkMode={darkMode} />} />
          <Route path="/blog"        element={<Blog          darkMode={darkMode} />} />
          <Route path="/blog/:id"    element={<BlogArticulo  darkMode={darkMode} />} />
          <Route path="/nosotros"    element={<Nosotros      darkMode={darkMode} />} />
          <Route path="/contacto"    element={<Contacto      darkMode={darkMode} />} />
          <Route path="/admin"       element={<Admin         darkMode={darkMode} />} />
        </Routes>

        {!isAdmin && <Footer darkMode={darkMode} />}
      </div>
    </ContentProvider>
  )
}

export default App
