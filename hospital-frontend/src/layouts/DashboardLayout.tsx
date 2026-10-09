import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import { useToast } from '../context/ToastContext'

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    const token = localStorage.getItem('token')
    // We connect to the gateway to listen for SSE streams from the notification service
    const eventSource = new EventSource(`http://localhost:4004/api/notifications/stream?token=${token}`)
    
    eventSource.addEventListener('notification', (e) => {
      try {
        const data = JSON.parse(e.data)
        
        let title = 'New Event'
        let variant: 'success' | 'warning' | 'error' = 'info' as any
        
        if (data.eventType === 'REGISTERED') {
          title = 'New Patient Admitted'
          variant = 'success'
        } else if (data.eventType === 'UPDATED') {
          title = 'Patient Record Updated'
          variant = 'warning'
        } else if (data.eventType === 'DELETED') {
          title = 'Patient Discharged'
          variant = 'error'
        }
        
        showToast(variant, title, `${data.name} (${data.email})`)
      } catch (err) {
        console.error('Failed to parse SSE notification', err)
      }
    })

    return () => eventSource.close()
  }, [showToast])

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <Navbar onOpenMobileSidebar={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}