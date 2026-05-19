import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [users, setUsers] = useState([])
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [apiUrl, setApiUrl] = useState(() => {
    // Auto-detect environments
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:8081/api/test-users'
    } else {
      // Default to Railway Java backend production domain (user can edit this)
      return `https://friendly-creation-production.up.railway.app/api/test-users`
    }
  })
  
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  // Fetch users from DB
  const fetchUsers = async (urlToFetch = apiUrl) => {
    setLoading(true)
    setStatus({ type: 'info', message: 'Fetching users from database...' })
    try {
      const response = await fetch(urlToFetch)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setUsers(data)
      setStatus({ type: 'success', message: `Successfully connected to DB! Fetched ${data.length} users.` })
    } catch (error) {
      console.error('Fetch error:', error)
      setStatus({ 
        type: 'error', 
        message: `Failed to connect to Database! Please check if your API URL is correct. (Error: ${error.message})` 
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !email) {
      setStatus({ type: 'error', message: 'Please fill out both username and email!' })
      return
    }

    setLoading(true)
    setStatus({ type: 'info', message: 'Inserting user into database...' })

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `HTTP error! status: ${response.status}`)
      }

      setStatus({ type: 'success', message: `User "${username}" successfully saved to Database!` })
      setUsername('')
      setEmail('')
      // Refresh the user list
      fetchUsers()
    } catch (error) {
      console.error('Submit error:', error)
      setStatus({ type: 'error', message: `Failed to insert user! (Error: ${error.message})` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        
        <div>
          <h1 style={{ fontSize: '38px', marginBottom: '8px' }}>Database Testing Portal</h1>
          <p style={{ color: 'var(--text)', fontSize: '15px' }}>
            Verify local and cloud MySQL database operations in real-time
          </p>
        </div>

        {/* API URL Config Card */}
        <div className="test-card" style={{ width: '100%', maxWidth: '600px' }}>
          <label style={{ display: 'block', textAlign: 'left', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px', color: 'var(--text-h)' }}>
            🔌 BACKEND API URL (Configure as needed):
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              style={{
                flexGrow: 1,
                padding: '10px 14px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: 'var(--code-bg)',
                color: 'var(--text-h)',
                fontFamily: 'var(--mono)',
                fontSize: '13px'
              }}
            />
            <button 
              type="button" 
              onClick={() => fetchUsers(apiUrl)}
              className="counter"
              style={{ margin: 0, padding: '10px 18px', display: 'flex', alignItems: 'center' }}
            >
              Test Connection
            </button>
          </div>
        </div>

        {/* Status Notification */}
        {status.message && (
          <div style={{
            width: '100%',
            maxWidth: '600px',
            padding: '12px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            textAlign: 'left',
            boxSizing: 'border-box',
            border: '1px solid',
            background: status.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : status.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            borderColor: status.type === 'error' ? 'rgba(239, 68, 68, 0.4)' : status.type === 'success' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(59, 130, 246, 0.4)',
            color: status.type === 'error' ? '#ef4444' : status.type === 'success' ? '#22c55e' : '#3b82f6',
            transition: 'all 0.3s ease'
          }}>
            {status.type === 'error' ? '❌ ' : status.type === 'success' ? '✅ ' : 'ℹ️ '} {status.message}
          </div>
        )}

        {/* Form and List Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          width: '100%',
          maxWidth: '850px',
          marginTop: '8px',
          textAlign: 'left'
        }}>
          
          {/* Insert Form */}
          <div style={{
            padding: '24px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--social-bg)',
            boxShadow: 'var(--shadow)'
          }}>
            <h2 style={{ fontSize: '18px', marginTop: 0 }}>Add New Test User</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Username:</label>
                <input 
                  type="text" 
                  placeholder="e.g. jdoe" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    boxSizing: 'border-box',
                    background: 'var(--bg)',
                    color: 'var(--text-h)'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Email Address:</label>
                <input 
                  type="email" 
                  placeholder="e.g. john@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    boxSizing: 'border-box',
                    background: 'var(--bg)',
                    color: 'var(--text-h)'
                  }}
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="counter" 
                style={{ width: '100%', marginTop: '8px', padding: '12px', cursor: 'pointer', margin: 0 }}
              >
                {loading ? 'Saving to Database...' : 'Save User to DB'}
              </button>
            </form>
          </div>

          {/* User List */}
          <div style={{
            padding: '24px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--social-bg)',
            boxShadow: 'var(--shadow)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h2 style={{ fontSize: '18px', marginTop: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Registered Users ({users.length})</span>
              <button 
                onClick={() => fetchUsers()} 
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold'
                }}
              >
                🔄 Refresh
              </button>
            </h2>

            <div style={{
              flexGrow: 1,
              maxHeight: '220px',
              overflowY: 'auto',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              background: 'var(--bg)'
            }}>
              {users.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text)', fontSize: '14px' }}>
                  No users found in database. Add a user to get started!
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--code-bg)' }}>
                      <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Username</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{user.id}</td>
                        <td style={{ padding: '10px' }}>{user.username}</td>
                        <td style={{ padding: '10px', color: 'var(--text)' }}>{user.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App

