//React Component
import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const FileUploader = () => {
  const { id } = useParams<{ id: string }>();
  const albumId = parseInt(id || '0');
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      // שלב 1: קבלת Presigned URL מהשרת
      const response = await axios.get('https://localhost:7251/api/upload/presigned-url', {
        params: { imageName: file.name, 
          albumId: albumId
        }
      });
      const presignedUrl = response.data.url;

      // שלב 2: העלאת הקובץ ישירות ל-S3
      await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percent);
        },
      });

      alert('הקובץ הועלה בהצלחה!');
     
    
        setProgress(0);
        setFile(null);
    } catch (error) {
      console.error('שגיאה בהעלאה:', error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
    <h2 style={{ textAlign: 'center', color: '#333' }}>העלאת קובץ</h2>
    <input
      type="file"
      onChange={handleFileChange}
      style={{ display: 'block', margin: '10px auto', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', width: '100%' }}
    />
    <button
      onClick={handleUpload}
      style={{ display: 'block', width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
    >
      העלה קובץ
    </button>
    {progress > 0 && (
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <div style={{ height: '20px', backgroundColor: '#ddd', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#4CAF50' }}></div>
        </div>
        <span>{progress}%</span>
      </div>
    )}
  </div>
  );
};

export default FileUploader;




