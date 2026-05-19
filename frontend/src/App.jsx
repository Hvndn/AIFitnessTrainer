import { useState, useEffect, useRef } from 'react'
import heroImg from './assets/ai_fitness_hero.png'
import './App.css'

function App() {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState('squat')
  const [repCount, setRepCount] = useState(0)
  const [accuracy, setAccuracy] = useState(97)
  const [feedback, setFeedback] = useState('Sẵn sàng! Hãy bấm nút kích hoạt Camera AI.')
  const [activeTab, setActiveTab] = useState('home')

  // Skeleton Simulation state
  const [skeleton, setSkeleton] = useState({
    head: { x: 200, y: 100 },
    neck: { x: 200, y: 130 },
    lShoulder: { x: 170, y: 140 },
    rShoulder: { x: 230, y: 140 },
    lElbow: { x: 150, y: 180 },
    rElbow: { x: 250, y: 180 },
    lWrist: { x: 140, y: 220 },
    rWrist: { x: 260, y: 220 },
    lHip: { x: 180, y: 240 },
    rHip: { x: 220, y: 240 },
    lKnee: { x: 180, y: 320 },
    rKnee: { x: 220, y: 320 },
    lAnkle: { x: 180, y: 400 },
    rAnkle: { x: 220, y: 400 }
  })

  // Simulate AI Pose Tracking movement when camera is active
  useEffect(() => {
    if (!isCameraActive) {
      setFeedback('Camera đang tắt. Bấm nút dưới để trải nghiệm thử công nghệ AI Coach.')
      return
    }

    let frame = 0
    let lastPhase = 'up'
    let localRepCount = 0

    const interval = setInterval(() => {
      frame += 1
      const cycle = (frame % 100) / 100 // 0 to 1 cycle
      const angle = cycle * Math.PI * 2
      
      // Calculate smooth cosine wave for exercise movement (going down and up)
      const movement = (Math.cos(angle) + 1) / 2 // goes from 1 (up) to 0 (down) and back to 1 (up)

      if (selectedExercise === 'squat') {
        // --- SQUAT SIMULATION ---
        const hipY = 230 + (1 - movement) * 60
        const kneeY = 320 + (1 - movement) * 30
        const kneeXOffset = (1 - movement) * 15

        setSkeleton(prev => ({
          ...prev,
          head: { x: 200, y: 90 + (1 - movement) * 40 },
          neck: { x: 200, y: 120 + (1 - movement) * 45 },
          lShoulder: { x: 175, y: 130 + (1 - movement) * 45 },
          rShoulder: { x: 225, y: 130 + (1 - movement) * 45 },
          lElbow: { x: 155, y: 170 + (1 - movement) * 40 },
          rElbow: { x: 245, y: 170 + (1 - movement) * 40 },
          lWrist: { x: 150, y: 210 + (1 - movement) * 35 },
          rWrist: { x: 250, y: 210 + (1 - movement) * 35 },
          // Hips go down significantly
          lHip: { x: 180, y: hipY },
          rHip: { x: 220, y: hipY },
          // Knees bend outwards slightly and go lower
          lKnee: { x: 180 - kneeXOffset, y: kneeY },
          rKnee: { x: 220 + kneeXOffset, y: kneeY },
          // Ankles remain planted
          lAnkle: { x: 180, y: 390 },
          rAnkle: { x: 220, y: 390 }
        }))

        // Feedback Logic
        if (movement > 0.85) {
          if (lastPhase === 'down') {
            localRepCount += 1
            setRepCount(localRepCount)
            setAccuracy(Math.floor(95 + Math.random() * 5))
            lastPhase = 'up'
          }
          setFeedback('Đứng thẳng tốt! Sẵn sàng cho rep tiếp theo.')
        } else if (movement < 0.2) {
          lastPhase = 'down'
          setFeedback('Góc đùi hoàn hảo (90°)! Giữ vững tư thế và đẩy người lên.')
        } else if (lastPhase === 'up') {
          setFeedback('Đang hạ mông... Hãy giữ lưng thẳng và mở đầu gối.')
        } else {
          setFeedback('Tốt! Đẩy người lên từ gót chân của bạn.')
        }

      } else {
        // --- PUSHUP SIMULATION ---
        const torsoY = 180 + (1 - movement) * 70
        const shoulderY = 190 + (1 - movement) * 70
        const elbowXOffset = (1 - movement) * 20

        setSkeleton(prev => ({
          ...prev,
          head: { x: 120, y: torsoY - 40 },
          neck: { x: 140, y: torsoY - 20 },
          lShoulder: { x: 160, y: shoulderY },
          rShoulder: { x: 160, y: shoulderY - 30 }, // Profile/angled view
          lElbow: { x: 190 + elbowXOffset, y: shoulderY + 30 },
          rElbow: { x: 180 + elbowXOffset, y: shoulderY },
          lWrist: { x: 220, y: 320 },
          rWrist: { x: 210, y: 300 },
          lHip: { x: 260, y: torsoY + 40 },
          rHip: { x: 260, y: torsoY + 20 },
          lKnee: { x: 320, y: 330 },
          rKnee: { x: 320, y: 320 },
          lAnkle: { x: 380, y: 360 },
          rAnkle: { x: 380, y: 350 }
        }))

        // Feedback Logic
        if (movement > 0.85) {
          if (lastPhase === 'down') {
            localRepCount += 1
            setRepCount(localRepCount)
            setAccuracy(Math.floor(94 + Math.random() * 6))
            lastPhase = 'up'
          }
          setFeedback('Khóa khớp tay tốt! Chuẩn bị hạ người xuống.')
        } else if (movement < 0.25) {
          lastPhase = 'down'
          setFeedback('Độ sâu ngực tối ưu! Ép cơ ngực và nâng người lên.')
        } else if (lastPhase === 'up') {
          setFeedback('Đang hạ người... Siết chặt cơ bụng, không để võng lưng.')
        } else {
          setFeedback('Đang đẩy lên... Thở ra mạnh mẽ.')
        }
      }
    }, 40)

    return () => clearInterval(interval)
  }, [isCameraActive, selectedExercise])

  const toggleCamera = () => {
    setIsCameraActive(!isCameraActive)
    if (isCameraActive) {
      setRepCount(0)
    }
  }

  const handleExerciseChange = (e) => {
    setSelectedExercise(e.target.value)
    setRepCount(0)
  }

  return (
    <div className="app-container">
      {/* HEADER / NAVIGATION */}
      <header className="navbar">
        <div className="logo-container">
          <div className="logo-glow">F</div>
          <div className="logo-text">AI<span>Fitness</span></div>
        </div>
        <nav>
          <ul className="nav-links">
            <li>
              <a 
                href="#home" 
                className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                Trang chủ
              </a>
            </li>
            <li>
              <a 
                href="#features" 
                className={`nav-link ${activeTab === 'features' ? 'active' : ''}`}
                onClick={() => setActiveTab('features')}
              >
                Tính năng
              </a>
            </li>
            <li>
              <a 
                href="#pose-coach" 
                className={`nav-link ${activeTab === 'coach' ? 'active' : ''}`}
                onClick={() => setActiveTab('coach')}
              >
                AI Pose Coach
              </a>
            </li>
            <li>
              <a 
                href="#testimonials" 
                className={`nav-link ${activeTab === 'testimonials' ? 'active' : ''}`}
                onClick={() => setActiveTab('testimonials')}
              >
                Khách hàng
              </a>
            </li>
          </ul>
        </nav>
        <div className="nav-actions">
          <button className="btn-outline">Đăng nhập</button>
          <a href="#pose-coach" className="btn-premium">Trải nghiệm AI</a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="home" className="hero-section">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        
        <div className="hero-content">
          <div className="tagline">
            <span className="tagline-dot"></span>
            Công nghệ AI Pose Coach thế hệ mới
          </div>
          <h1 className="hero-title">
            Đột phá tư thế,<br />
            <span>Đạt đỉnh hình thể</span>
          </h1>
          <p className="hero-description">
            Cách mạng hóa hành trình luyện tập thể hình của bạn. Quét và phân tích tư thế squats, pushups qua camera thời gian thực bằng AI siêu cấp, nhận phản hồi chính xác đến từng mili-giây để ngăn chặn chấn thương tối đa.
          </p>
          <div className="hero-buttons">
            <a href="#pose-coach" className="btn-premium">Bật AI Camera Demo</a>
            <a href="#features" className="btn-outline">Khám phá tính năng</a>
          </div>
        </div>

        <div className="hero-media">
          <div className="hero-image-wrapper">
            <img src={heroImg} className="hero-image" alt="AI Fitness Hologram Coach" />
            <div className="hero-stats-overlay">
              <div className="stats-circle">✓</div>
              <div className="stats-info">
                <div className="stats-label">Hỗ trợ tư thế</div>
                <div className="stats-value">Chuẩn 99.8%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="features-section">
        <div className="section-header">
          <span className="section-tag">Công nghệ dẫn đầu</span>
          <h2 className="section-title">Tính năng vượt trội của <span>AIFitness</span></h2>
          <p>Tích hợp sâu các công nghệ thị giác máy tính và AI giọng nói để đồng hành cùng bạn trên mọi hành trình.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">👁</div>
            <h3 className="feature-title">AI Pose Correction</h3>
            <p className="feature-desc">Nhận diện khớp xương 3D toàn thân qua camera, phân tích góc gối, hông và cột sống thời gian thực để chỉnh sửa ngay lập tức.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">📅</div>
            <h3 className="feature-title">Giáo án cá nhân hóa</h3>
            <p className="feature-desc">Thuật toán AI tự động thiết lập lịch trình tập luyện riêng biệt dựa trên chỉ số sức mạnh và mục tiêu tăng cơ/giảm mỡ của bạn.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">📊</div>
            <h3 className="feature-title">Thống kê nâng cao</h3>
            <p className="feature-desc">Báo cáo chi tiết biểu đồ tiến độ tập luyện, đếm số reps tự động 100% chuẩn xác và đánh giá lực cơ bắp từng buổi tập.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">🎙</div>
            <h3 className="feature-title">HLV Giọng nói ảo</h3>
            <p className="feature-desc">Hệ thống âm thanh AI phản hồi, khích lệ và nhắc nhở nhịp độ thở, tốc độ di chuyển ngay trong tai nghe của bạn.</p>
          </div>
        </div>
      </section>

      {/* INTERACTIVE AI POSE COACH WIDGET */}
      <section id="pose-coach" className="ai-widget-section">
        <div className="section-header">
          <span className="section-tag">Trải nghiệm tương tác</span>
          <h2 className="section-title">Huấn luyện viên <span>AI Quét Tư Thế</span></h2>
          <p>Hãy chọn bài tập mong muốn, bấm nút "Kích hoạt Camera AI" để kiểm chứng cách hệ thống quét và đếm rep tự động!</p>
        </div>

        <div className="ai-widget-container">
          {/* Simulated Webcam Feed */}
          <div className="ai-feed-pane">
            <div className="ai-scan-bar"></div>
            
            {isCameraActive ? (
              <>
                <div className="feed-hud-overlay">
                  <div className="hud-top">
                    <div className="hud-rec-tag">
                      <span className="rec-dot"></span>
                      <span className="rec-text">LIVE FEED (AI ACTIVE)</span>
                    </div>
                    <div className="hud-resolution">1080P @ 60FPS</div>
                  </div>
                  
                  <div className="hud-feedback-bubble">
                    {feedback}
                  </div>
                </div>

                {/* Cyberpunk Joint Skeleton Visualizer */}
                <svg className="pose-lines-svg">
                  {/* Torso Connections */}
                  <line x1={skeleton.lShoulder.x} y1={skeleton.lShoulder.y} x2={skeleton.rShoulder.x} y2={skeleton.rShoulder.y} stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" />
                  <line x1={skeleton.lShoulder.x} y1={skeleton.lShoulder.y} x2={skeleton.lHip.x} y2={skeleton.lHip.y} stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" />
                  <line x1={skeleton.rShoulder.x} y1={skeleton.rShoulder.y} x2={skeleton.rHip.x} y2={skeleton.rHip.y} stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" />
                  <line x1={skeleton.lHip.x} y1={skeleton.lHip.y} x2={skeleton.rHip.x} y2={skeleton.rHip.y} stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" />

                  {/* Arms */}
                  <line x1={skeleton.lShoulder.x} y1={skeleton.lShoulder.y} x2={skeleton.lElbow.x} y2={skeleton.lElbow.y} stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" />
                  <line x1={skeleton.lElbow.x} y1={skeleton.lElbow.y} x2={skeleton.lWrist.x} y2={skeleton.lWrist.y} stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" />
                  <line x1={skeleton.rShoulder.x} y1={skeleton.rShoulder.y} x2={skeleton.rElbow.x} y2={skeleton.rElbow.y} stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" />
                  <line x1={skeleton.rElbow.x} y1={skeleton.rElbow.y} x2={skeleton.rWrist.x} y2={skeleton.rWrist.y} stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" />

                  {/* Legs */}
                  <line x1={skeleton.lHip.x} y1={skeleton.lHip.y} x2={skeleton.lKnee.x} y2={skeleton.lKnee.y} stroke="#ec4899" strokeWidth="4" strokeLinecap="round" />
                  <line x1={skeleton.lKnee.x} y1={skeleton.lKnee.y} x2={skeleton.lAnkle.x} y2={skeleton.lAnkle.y} stroke="#ec4899" strokeWidth="4" strokeLinecap="round" />
                  <line x1={skeleton.rHip.x} y1={skeleton.rHip.y} x2={skeleton.rKnee.x} y2={skeleton.rKnee.y} stroke="#ec4899" strokeWidth="4" strokeLinecap="round" />
                  <line x1={skeleton.rKnee.x} y1={skeleton.rKnee.y} x2={skeleton.rAnkle.x} y2={skeleton.rAnkle.y} stroke="#ec4899" strokeWidth="4" strokeLinecap="round" />

                  {/* Joint Circles */}
                  {Object.entries(skeleton).map(([name, pos]) => (
                    <circle 
                      key={name} 
                      cx={pos.x} 
                      cy={pos.y} 
                      r={name === 'head' ? '12' : '6'} 
                      fill={name === 'head' ? 'rgba(6,182,212,0.8)' : '#ffffff'} 
                      stroke={name === 'head' ? '#06b6d4' : '#8b5cf6'} 
                      strokeWidth="2.5" 
                    />
                  ))}
                </svg>
              </>
            ) : (
              <div className="feed-disabled-msg">
                <div className="icon-camera-off">📹</div>
                <div className="feed-disabled-title">Camera Trực Tiếp Đang Tắt</div>
                <p className="feed-disabled-desc">Để xem công nghệ phân tích khớp xương AI giả lập động hoạt động như thế nào, vui lòng bấm nút "Kích hoạt Camera AI" ở góc bên phải.</p>
              </div>
            )}
          </div>

          {/* AI Metrics Sidebar Control Pane */}
          <div className="ai-control-pane">
            <div>
              <h3 className="widget-title">Bảng điều khiển AI</h3>
              <p className="widget-desc">Thiết lập cấu hình phân tích tư thế thời gian thực.</p>
              
              <div className="widget-metrics">
                <div className="metric-row">
                  <span className="metric-label">Bài tập phân tích:</span>
                  <span className="metric-val" style={{ textTransform: 'uppercase', fontSize: '16px', color: '#c084fc' }}>
                    {selectedExercise === 'squat' ? '🏋️ Squats' : '🤸 Pushups'}
                  </span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Số Reps đếm được:</span>
                  <span className={`metric-val ${isCameraActive ? 'pulse' : ''}`}>{repCount}</span>
                </div>
                <div>
                  <div className="metric-row">
                    <span className="metric-label">Độ chuẩn tư thế:</span>
                    <span className="metric-val" style={{ color: '#10b981' }}>{accuracy}%</span>
                  </div>
                  <div className="bar-bg">
                    <div className="bar-fill" style={{ width: `${accuracy}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="widget-controls">
              <select className="exercise-selector" value={selectedExercise} onChange={handleExerciseChange} disabled={isCameraActive}>
                <option value="squat">Bài tập Squat (Đùi & Mông)</option>
                <option value="pushup">Bài tập Pushup (Ngực & Tay sau)</option>
              </select>
              
              <button className="btn-widget" onClick={toggleCamera} style={{ background: isCameraActive ? 'var(--accent-gradient)' : 'var(--primary-glow)' }}>
                {isCameraActive ? '🔴 Tắt Camera AI' : '🟢 Kích hoạt Camera AI'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="testimonials-section">
        <div className="section-header">
          <span className="section-tag">Khách hàng thành công</span>
          <h2 className="section-title">Câu chuyện từ <span>Hội Viên</span></h2>
          <p>Hàng ngàn hội viên đã lột xác nhờ việc kiểm soát hoàn hảo kỹ thuật tập luyện với AI.</p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="user-profile">
              <div className="user-avatar" style={{ fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👨</div>
              <div>
                <h4 className="user-name">Trần Hoàng Long</h4>
                <div className="user-title">Gymmer bán chuyên - 24 tuổi</div>
              </div>
            </div>
            <p className="testimonial-quote">"Ngày xưa squat tôi hay bị đau lưng dưới do đổ người về trước. Từ ngày dùng AI Pose Coach chỉnh góc đùi và hông thẳng hàng, tôi đã nâng tạ lên 120kg cực kỳ êm ái mà không còn bị nhói lưng nữa."</p>
            <div className="transformation-tag">Giảm 4% mỡ thừa • Squat +30kg</div>
          </div>

          <div className="testimonial-card">
            <div className="user-profile">
              <div className="user-avatar" style={{ fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👩</div>
              <div>
                <h4 className="user-name">Nguyễn Mai Chi</h4>
                <div className="user-title">Nhân viên văn phòng - 28 tuổi</div>
              </div>
            </div>
            <p className="testimonial-quote">"Tập ở nhà một mình sợ nhất là sai form chấn thương. Nhờ AI phân tích góc mở khuỷu tay khi hít đất và đếm rep bằng giọng nói trực tiếp, tôi cảm giác luôn có PT 1-1 đứng cạnh khích lệ hàng ngày."</p>
            <div className="transformation-tag">Tăng 2kg cơ • Pushup 30 reps</div>
          </div>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="logo-container">
              <div className="logo-glow">F</div>
              <div className="logo-text">AI<span>Fitness</span></div>
            </div>
            <p className="footer-desc">
              Mang công nghệ huấn luyện viên ảo tối tân nhất thế giới đến phòng khách của bạn. Tập luyện khoa học, an toàn và tối ưu tuyệt đối.
            </p>
          </div>
          
          <div className="footer-links-grid">
            <div className="footer-links-col">
              <h4 className="footer-col-title">Giải pháp</h4>
              <ul className="footer-links-list">
                <li><a href="#pose-coach" className="footer-link">AI Pose Coach</a></li>
                <li><a href="#features" className="footer-link">Custom Routine</a></li>
                <li><a href="#home" className="footer-link">Personal Plan</a></li>
              </ul>
            </div>
            
            <div className="footer-links-col">
              <h4 className="footer-col-title">Cộng đồng</h4>
              <ul className="footer-links-list">
                <li><a href="https://github.com" target="_blank" rel="noreferrer" className="footer-link">GitHub</a></li>
                <li><a href="https://discord.com" target="_blank" rel="noreferrer" className="footer-link">Discord Group</a></li>
                <li><a href="https://x.com" target="_blank" rel="noreferrer" className="footer-link">X.com (Twitter)</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© 2026 AIFitness. Bản quyền thuộc về Đồ án Tốt nghiệp.</div>
          <div className="social-icons">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="social-btn">G</a>
            <a href="https://discord.com" target="_blank" rel="noreferrer" className="social-btn">D</a>
            <a href="https://x.com" target="_blank" rel="noreferrer" className="social-btn">X</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
