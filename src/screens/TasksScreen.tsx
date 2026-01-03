import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import './TasksScreen.css';

export default function TasksScreen() {
  const navigate = useNavigate();
  const { completedNotes, pendingNotes, toggleNoteCompletion, deleteNote } = useNotes();
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Bu notu silmek istediğinize emin misiniz?')) {
      deleteNote(id);
    }
  };

  const handleToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toggleNoteCompletion(id);
  };

  const displayNotes = activeTab === 'pending' ? pendingNotes : completedNotes;

  return (
    <div className="tasks-screen-container">
      {/* Decorative Elements */}
      <div className="task-bamboo-stick stick-1"></div>
      <div className="task-bamboo-stick stick-2"></div>
      <div className="task-bamboo-stick stick-3"></div>
      <div className="floating-leaf task-leaf-1">🎋</div>
      <div className="floating-leaf task-leaf-2">🌿</div>
      <div className="floating-leaf task-leaf-3">🍃</div>
      <div className="floating-leaf task-leaf-4">🎋</div>
      <div className="floating-leaf task-leaf-5">🌿</div>
      <div className="task-floating-bamboo tb-1">🎍</div>
      <div className="task-floating-bamboo tb-2">🎍</div>
      
      <div className="tasks-header">
        <div className="tasks-header-panda">
          <img src="/panda.jpg" alt="Panda" className="tasks-header-panda-img" />
        </div>
        <div className="tasks-header-text">
          <h1 className="tasks-header-title">Görevlerim 📋</h1>
          <p className="tasks-header-subtitle">
            {pendingNotes.length} bekleyen • {completedNotes.length} tamamlanan
          </p>
        </div>
      </div>

      <div className="tasks-tabs">
        <button
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          <span className="tab-icon">📋</span>
          <span className="tab-text">Yapılacaklar</span>
          <span className="tab-count">{pendingNotes.length}</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          <span className="tab-icon">✅</span>
          <span className="tab-text">Yapılanlar</span>
          <span className="tab-count">{completedNotes.length}</span>
        </button>
      </div>

      {displayNotes.length === 0 ? (
        <div className="empty-container">
          <div className="empty-panda">
            <img src="/panda.jpg" alt="Panda" className="empty-panda-image" />
          </div>
          <p className="empty-text">
            {activeTab === 'pending' ? 'Tüm görevler tamamlandı! 🎉' : 'Henüz tamamlanan görev yok 🎋'}
          </p>
          <p className="empty-subtext">
            {activeTab === 'pending' 
              ? 'Yeni not ekleyerek görev oluşturabilirsiniz' 
              : 'Notlarınızı tamamladıkça burada görünecek'}
          </p>
        </div>
      ) : (
        <div className="tasks-list">
          {displayNotes.map((note) => (
            <div
              key={note.id}
              className={`task-card ${note.completed ? 'completed' : ''}`}
              onClick={() => navigate(`/note/${note.id}`)}
            >
              <button
                className={`check-button ${note.completed ? 'checked' : ''}`}
                onClick={(e) => handleToggle(e, note.id)}
                aria-label={note.completed ? 'Tamamlanmadı olarak işaretle' : 'Tamamlandı olarak işaretle'}
              >
                {note.completed ? '✓' : ''}
              </button>
              <div className="task-content">
                <h3 className={`task-title ${note.completed ? 'completed' : ''}`}>
                  {note.title || 'Başlıksız Not'}
                </h3>
                <p className="task-preview">
                  {note.content.length > 60 
                    ? note.content.substring(0, 60) + '...' 
                    : note.content}
                </p>
                <p className="task-date">
                  {new Date(note.updatedAt).toLocaleString('tr-TR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <button
                className="delete-button"
                onClick={(e) => handleDelete(e, note.id)}
                aria-label="Notu sil"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        className="fab"
        onClick={() => navigate('/note')}
        aria-label="Yeni not ekle"
      >
        +
      </button>
    </div>
  );
}

