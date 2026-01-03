import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import './NoteDetailScreen.css';

export default function NoteDetailScreen() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { notes, addNote, updateNote } = useNotes();
  
  const note = id ? notes.find(n => n.id === id) : null;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
    } else {
      setTitle('');
      setContent('');
      setTags([]);
    }
  }, [note, id]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      alert('Lütfen en az bir başlık veya içerik girin.');
      return;
    }

    if (note) {
      updateNote(note.id, { title, content, tags });
    } else {
      addNote({ title, content, tags });
    }
    
    // Animasyonu göster
    setShowAnimation(true);
    
    // 2 saniye sonra geri dön
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const addTag = () => {
    const tag = currentTag.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setCurrentTag('');
    }
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  if (showAnimation) {
    return (
      <div className="animation-container">
        <div className="bamboo-decoration left"></div>
        <div className="bamboo-decoration right"></div>
        <div className="success-animation">
          <div className="panda-container">
            <img src="/panda.jpg" alt="Panda" className="panda-image" />
          </div>
          <h2 className="success-text">Not Kaydedildi! 🎋</h2>
          <p className="success-subtext">Notunuz güvenle saklandı</p>
        </div>
      </div>
    );
  }

  return (
    <div className="note-detail-container">
      {/* Floating Panda Decorations */}
      <div className="floating-panda-wrapper">
        <div className="floating-panda bottom-right">
          <img src="/panda.jpg" alt="" className="floating-panda-img" />
        </div>
      </div>
      
      {/* Bamboo Sticks */}
      <div className="detail-bamboo-stick stick-1"></div>
      <div className="detail-bamboo-stick stick-2"></div>
      <div className="detail-bamboo-stick stick-3"></div>
      <div className="detail-bamboo-stick stick-4"></div>
      
      {/* Floating Leaves */}
      <div className="bamboo-leaf leaf-1">🎋</div>
      <div className="bamboo-leaf leaf-2">🌿</div>
      <div className="bamboo-leaf leaf-3">🎋</div>
      <div className="bamboo-leaf leaf-4">🍃</div>
      <div className="bamboo-leaf leaf-5">🌿</div>
      <div className="bamboo-leaf leaf-6">🎋</div>
      <div className="bamboo-leaf leaf-7">🍃</div>
      
      {/* Floating Bamboo */}
      <div className="detail-floating-bamboo fb-1">🎍</div>
      <div className="detail-floating-bamboo fb-2">🎍</div>
      
      <div className="note-detail-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Geri
        </button>
        <button className="save-button" onClick={handleSave}>
          Kaydet
        </button>
      </div>

      <div className="note-detail-content">
        <input
          type="text"
          className="title-input"
          placeholder="Başlık..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="content-input"
          placeholder="Notunuzu buraya yazın..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
        />

        <div className="tags-section">
          <h3 className="section-title">Etiketler</h3>
          <div className="tag-input-container">
            <input
              type="text"
              className="tag-input"
              placeholder="Etiket ekle (örn: kafe fikri)"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={handleTagKeyPress}
            />
            <button className="add-tag-button" onClick={addTag}>
              +
            </button>
          </div>

          {tags.length > 0 && (
            <div className="tags-container">
              {tags.map((tag, index) => (
                <div key={index} className="tag">
                  <span className="tag-text">{tag}</span>
                  <button 
                    className="remove-tag-button"
                    onClick={() => removeTag(tag)}
                    aria-label="Etiketi kaldır"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
