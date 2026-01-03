import { useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import './TagsScreen.css';

export default function TagsScreen() {
  const navigate = useNavigate();
  const { tags } = useNotes();

  const handleTagPress = (_tagName: string) => {
    // Navigate to notes list - in a real app you might filter by tag
    navigate('/');
  };

  return (
    <div className="tags-screen-container">
      {/* Decorative Elements */}
      <div className="tags-bamboo-stick stick-1"></div>
      <div className="tags-bamboo-stick stick-2"></div>
      <div className="tags-floating-leaf leaf-1">🎋</div>
      <div className="tags-floating-leaf leaf-2">🌿</div>
      <div className="tags-floating-leaf leaf-3">🍃</div>
      <div className="tags-floating-leaf leaf-4">🎋</div>
      <div className="tags-floating-leaf leaf-5">🌿</div>
      <div className="tags-floating-bamboo tfb-1">🎍</div>
      <div className="tags-floating-bamboo tfb-2">🎍</div>
      
      <div className="tags-header">
        <div className="tags-header-panda">
          <img src="/panda.jpg" alt="Panda" className="tags-header-panda-img" />
        </div>
        <div className="tags-header-text">
          <h1 className="tags-header-title">Etiketlerim 🎋</h1>
          <p className="tags-header-subtitle">{tags.length} etiket</p>
        </div>
      </div>

      {tags.length === 0 ? (
        <div className="empty-container">
          <div className="empty-panda">
            <img src="/panda.jpg" alt="Panda" className="empty-panda-image" />
          </div>
          <p className="empty-text">Henüz etiket yok 🎋</p>
          <p className="empty-subtext">
            Notlarınıza etiket ekleyerek organize edin
          </p>
        </div>
      ) : (
        <div className="tags-list">
          {tags.map((tag) => (
            <div
              key={tag.name}
              className="tag-card"
              onClick={() => handleTagPress(tag.name)}
            >
              <div className="tag-info">
                <span className="tag-icon">🎋</span>
                <div className="tag-details">
                  <h3 className="tag-name">{tag.name}</h3>
                  <p className="tag-count">{tag.count} not</p>
                </div>
              </div>
              <span className="chevron">›</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
