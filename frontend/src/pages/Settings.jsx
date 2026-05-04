import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Sun, Moon, Bell, Shield, Globe, Trash2, Save } from 'lucide-react';

const Settings = () => {
  const { dispatch } = useContext(AppContext);

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('English');

  const handleSave = () => {
    alert('Settings saved!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Delete account? All data lost.')) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Settings</h1>

      <div style={styles.grid}>
        {/* Appearance */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}><Sun size={18}/> Appearance</h2>
          <div style={styles.item}>
            <span>Dark Mode</span>
            <button 
              style={styles.toggle}
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? '🌙' : '☀️'}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}><Bell size={18}/> Notifications</h2>

          <div style={styles.item}>
            <span>Email Alerts</span>
            <input 
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
          </div>

          <div style={styles.item}>
            <span>Quiz Results</span>
            <input type="checkbox" defaultChecked />
          </div>
        </div>

        {/* Privacy */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}><Shield size={18}/> Privacy</h2>

          <div style={styles.item}>
            <span>Data Sharing</span>
            <select style={styles.select}>
              <option>Opt-out</option>
              <option>Anonymous</option>
              <option>Full</option>
            </select>
          </div>

          <p style={styles.desc}>
            We respect your privacy. Data used only for improvements.
          </p>
        </div>

        {/* Language */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}><Globe size={18}/> Language</h2>

          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={styles.select}
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Tamil</option>
          </select>
        </div>

        {/* Danger Zone */}
        <div style={{...styles.card, ...styles.danger}}>
          <h2 style={styles.cardTitle}><Trash2 size={18}/> Danger Zone</h2>

          <button onClick={handleDeleteAccount} style={styles.dangerBtn}>
            Delete Account & Data
          </button>

          <p style={styles.desc}>
            Permanent action - all data will be lost.
          </p>
        </div>
      </div>

      <div style={styles.actions}>
        <button onClick={handleSave} style={styles.saveBtn}>
          <Save size={16}/> Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;


/* ================= STYLES ================= */

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: 'sans-serif',
  },

  title: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '20px',
    color: '#111827',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },

  card: {
    background: '#ffffff',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
  },

  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '15px',
  },

  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },

  toggle: {
    padding: '6px 12px',
    borderRadius: '10px',
    border: 'none',
    background: '#e5e7eb',
    cursor: 'pointer',
  },

  select: {
    padding: '6px 10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },

  desc: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '10px',
  },

  danger: {
    border: '1px solid #fecaca',
    background: '#fff1f2',
  },

  dangerBtn: {
    background: '#ef4444',
    color: '#fff',
    padding: '10px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
  },

  actions: {
    marginTop: '20px',
    textAlign: 'right',
  },

  saveBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: '#4f46e5',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
  },
};