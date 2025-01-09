import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TagContainer = styled.div`
  margin: 10px 0;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const Tag = styled.span`
  background-color: #e0e0e0;
  border-radius: 16px;
  padding: 4px 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;

  button {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    padding: 0;
    font-size: 16px;
    line-height: 1;

    &:hover {
      color: #333;
    }
  }
`;

const TagInput = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 8px;
`;

const AddButton = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

// PUBLIC_INTERFACE
/**
 * PhotoTag component for managing photo tags
 * @param {Object} props - Component props
 * @param {Array} props.tags - Array of current tags
 * @param {Function} props.onTagsChange - Callback when tags are updated
 */
const PhotoTag = ({ tags, onTagsChange }) => {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = useCallback(() => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onTagsChange([...tags, newTag.trim()]);
      setNewTag('');
    }
  }, [newTag, tags, onTagsChange]);

  const handleRemoveTag = useCallback((tagToRemove) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  }, [tags, onTagsChange]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  }, [handleAddTag]);

  return (
    <TagContainer>
      <div>
        <TagInput
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a tag..."
          aria-label="Add a tag"
        />
        <AddButton
          type="button"
          onClick={handleAddTag}
          disabled={!newTag.trim()}
          aria-label="Add tag"
        >
          Add Tag
        </AddButton>
      </div>

      <TagList role="list" aria-label="Photo tags">
        {tags.map(tag => (
          <Tag key={tag} role="listitem">
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              aria-label={`Remove tag ${tag}`}
            >
              ×
            </button>
          </Tag>
        ))}
      </TagList>
    </TagContainer>
  );
};

PhotoTag.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  onTagsChange: PropTypes.func.isRequired,
};

export default PhotoTag;