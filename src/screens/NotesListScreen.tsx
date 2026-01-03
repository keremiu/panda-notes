import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import './NotesListScreen.css';

export default function NotesListScreen() {
  const navigate = useNavigate();
  const { notes, deleteNote, toggleNoteCompletion } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter(
    note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="notes-list-container">
      {/* Decorative Elements */}
      <div className="bamboo-decoration-left"></div>
      <div className="bamboo-decoration-right"></div>
      <div className="bamboo-stick stick-1"></div>
      <div className="bamboo-stick stick-2"></div>
      <div className="bamboo-stick stick-3"></div>
      <div className="floating-leaf leaf-1">🌿</div>
      <div className="floating-leaf leaf-2">🎋</div>
      <div className="floating-leaf leaf-3">🍃</div>
      <div className="floating-leaf leaf-4">🌿</div>
      <div className="floating-leaf leaf-5">🎋</div>
      <div className="floating-leaf leaf-6">🍃</div>
      <div className="floating-bamboo bamboo-1">🎍</div>
      <div className="floating-bamboo bamboo-2">🎍</div>
      
      <div className="header-banner">
        <div className="header-panda">
          <img src="/panda.jpg" alt="Panda" className="header-panda-img" />
        </div>
        <div className="header-text">
          <h1 className="header-title">Notlarım 🎋</h1>
          <p className="header-subtitle">{notes.length} not</p>
        </div>
      </div>

      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Notlarda ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery.length > 0 && (
          <button 
            className="clear-search"
            onClick={() => setSearchQuery('')}
          >
            ✕
          </button>
        )}
      </div>

      {filteredNotes.length === 0 ? (
        <div className="empty-container">
          <div className="empty-panda">
            <img src="/panda.jpg" alt="Panda" className="empty-panda-image" />
          </div>
          <p className="empty-text">Henüz not yok 🎋</p>
          <p className="empty-subtext">Yeni not eklemek için + butonuna basın</p>
        </div>
      ) : (
        <div className="notes-list">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`note-card ${note.completed ? 'completed' : ''}`}
              onClick={() => navigate(`/note/${note.id}`)}
            >
              <div className="note-card-content">
                <button
                  className={`check-button ${note.completed ? 'checked' : ''}`}
                  onClick={(e) => handleToggle(e, note.id)}
                  aria-label={note.completed ? 'Tamamlanmadı olarak işaretle' : 'Tamamlandı olarak işaretle'}
                >
                  {note.completed ? '✓' : ''}
                </button>
                <div className="note-info">
                  <div className="note-header">
                    <h3 className={`note-title ${note.completed ? 'completed' : ''}`}>
                      {note.title || 'Başlıksız Not'}
                    </h3>
                    <button
                      className="delete-button"
                      onClick={(e) => handleDelete(e, note.id)}
                      aria-label="Notu sil"
                    >
                      🗑️
                    </button>
                  </div>
                  <p className="note-content">
                    {note.content.length > 100 
                      ? note.content.substring(0, 100) + '...' 
                      : note.content}
                  </p>
                  {note.tags.length > 0 && (
                    <div className="tags-container">
                      {note.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="more-tags-text">
                          +{note.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  <p className="note-date">
                    {new Date(note.updatedAt).toLocaleString('tr-TR', {
                      day: '2-digit',
                      month: '2-digit', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
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
