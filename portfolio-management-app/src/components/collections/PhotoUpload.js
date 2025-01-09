import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { LoadingSpinner } from '../common/LoadingSpinner';
import PhotoTag from './PhotoTag';
import {
  DropZone,
  PhotoPreviewContainer,
  PhotoPreview,
  PhotoPreviewItem,
  UploadProgressBar,
  UploadProgressText,
  ErrorMessage,
} from './styles';

const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// PUBLIC_INTERFACE
/**
 * PhotoUpload component with drag-and-drop functionality
 * @param {Object} props - Component props
 * @param {Function} props.onUpload - Function to handle file upload
 * @param {boolean} props.isLoading - Loading state of the upload
 * @param {string} props.error - Error message from API
 * @param {Function} props.onError - Function to handle error messages
 */
const PhotoUpload = ({ onUpload, isLoading, error, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [tags, setTags] = useState([]);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      onError(`File type ${file.type} is not supported`);
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      onError(`File size exceeds 5MB limit`);
      return false;
    }

    return true;
  };

  const handleFiles = useCallback((newFiles) => {
    const validFiles = Array.from(newFiles).filter(validateFile);
    
    if (validFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setFiles((prevFiles) =>
            prevFiles.map((f) =>
              f === file ? { ...f, preview: reader.result } : f
            )
          );
        };
        reader.readAsDataURL(file);
      });
    }
  }, [onError]);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  }, [handleFiles]);

  const handleFileInputChange = useCallback((e) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  const handleUpload = useCallback(async () => {
    if (files.length === 0) return;

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('tags', JSON.stringify(tags));
        formData.append('title', file.name);

        await onUpload(formData, (progress) => {
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: progress,
          }));
        });
      }

      // Clear files after successful upload
      setFiles([]);
      setUploadProgress({});
    } catch (err) {
      onError(err.message);
    }
  }, [files, onUpload, onError]);

  const removeFile = useCallback((fileToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== fileToRemove));
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[fileToRemove.name];
      return newProgress;
    });
  }, []);

  return (
    <div>
      <DropZone
        isDragging={isDragging}
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Drop zone for photo upload"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_FILE_TYPES.join(',')}
          onChange={handleFileInputChange}
          multiple
          style={{ display: 'none' }}
          aria-hidden="true"
        />
        {isLoading ? (
          <LoadingSpinner size="medium" />
        ) : (
          <p>
            Drag and drop photos here or click to select
            <br />
            <small>Supported formats: JPG, PNG, WebP (max 5MB)</small>
          </p>
        )}
      </DropZone>

      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}

      {files.length > 0 && (
        <>
          <PhotoTag
            tags={tags}
            onTagsChange={setTags}
          />
          <PhotoPreviewContainer>
          {files.map((file) => (
            <PhotoPreviewItem key={file.name}>
              <PhotoPreview
                src={file.preview || URL.createObjectURL(file)}
                alt={`Preview of ${file.name}`}
              />
              <button
                type="button"
                onClick={() => removeFile(file)}
                aria-label={`Remove ${file.name}`}
              >
                ×
              </button>
              {uploadProgress[file.name] !== undefined && (
                <>
                  <UploadProgressBar
                    progress={uploadProgress[file.name]}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={uploadProgress[file.name]}
                  />
                  <UploadProgressText>
                    {Math.round(uploadProgress[file.name])}%
                  </UploadProgressText>
                </>
              )}
            </PhotoPreviewItem>
          ))}
          </PhotoPreviewContainer>
        </>
      )}

      {files.length > 0 && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={isLoading}
          aria-label="Upload selected photos"
        >
          {isLoading ? <LoadingSpinner size="small" /> : 'Upload Photos'}
        </button>
      )}
    </div>
  );
};

PhotoUpload.propTypes = {
  onUpload: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  onError: PropTypes.func.isRequired,
};

PhotoUpload.defaultProps = {
  isLoading: false,
  error: '',
};

export default PhotoUpload;
