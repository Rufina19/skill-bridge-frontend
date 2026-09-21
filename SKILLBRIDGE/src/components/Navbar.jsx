function Navbar({ user, onHome, onSkills, onHelp, onLogin, onLogout }) {
  return (
    <nav className="navbar">
      <div className="logo-section">
        <h2 className="logo">SkillBridge</h2>
        <span>Peer learning network</span>
      </div>

      <ul className="nav-links">
        <li onClick={onHome}>Home</li>
        <li onClick={onSkills}>Skills</li>
        <li onClick={onHelp}>Help Requests</li>

        {user ? (
          <>
            <li className="nav-user">{user}</li>
            <li onClick={onLogout}>Logout</li>
          </>
        ) : (
          <li onClick={onLogin}>Login</li>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
