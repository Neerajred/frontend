import React, { useState } from 'react';

const UserDashboard = () => {
  const [file, setFile] = useState(null);
  const [secretKey, setSecretKey] = useState('');
  const [fileType, setFileType] = useState('');
  const [view, setView] = useState(''); // 'encryption' or 'decryption'

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Encryption: Handle file encryption
  const handleEncrypt = async (e) => {
    e.preventDefault();
    if (!file || !secretKey) {
      alert('Please choose a file and provide a secret key.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('secretKey', secretKey);

    try {
      const response = await fetch('http://localhost:5000/api/file/encrypt', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `encrypted_${file.name}.txt`; // Download as a text file
        link.click();
      } else {
        alert('Encryption failed.');
      }
    } catch (error) {
      console.error('Encryption error:', error);
    }
  };

  // Decryption: Handle file decryption
  const handleDecrypt = async (e) => {
    e.preventDefault();
    if (!file || !secretKey || !fileType) {
      alert('Please provide the encrypted file, secret key, and file type.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('secretKey', secretKey);
    formData.append('fileType', fileType);

    try {
      const response = await fetch('http://localhost:5000/api/file/decrypt', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `decrypted_${file.name}`; // Download with the original format
        link.click();
      } else {
        alert('Decryption failed.');
      }
    } catch (error) {
      console.error('Decryption error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">User Dashboard</h2>

      {/* Buttons to toggle between Encryption and Decryption */}
      <div className="space-x-4 mb-8">
        <button
          onClick={() => setView('encryption')}
          className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Encryption
        </button>
        <button
          onClick={() => setView('decryption')}
          className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
        >
          Decryption
        </button>
      </div>

      {/* Encryption Section */}
      {view === 'encryption' && (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mb-8">
          <h3 className="text-xl font-bold text-gray-700 mb-4">Encrypt a File</h3>
          <form onSubmit={handleEncrypt}>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
              required
            />
            <input
              type="text"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter secret key"
              className="mt-4 p-3 border border-gray-300 rounded-lg w-full"
              required
            />
            <button
              type="submit"
              className="w-full py-3 mt-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Encrypt and Download as Text
            </button>
          </form>
        </div>
      )}

      {/* Decryption Section */}
      {view === 'decryption' && (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h3 className="text-xl font-bold text-gray-700 mb-4">Decrypt a File</h3>
          <form onSubmit={handleDecrypt}>
            {/* <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
              required
            >
              <option value="">Select file type</option>
              <option value="text/plain">Text</option>
              <option value="image/jpeg">JPEG Image</option>
              <option value="image/png">PNG Image</option>
              <option value="application/pdf">PDF</option>
            </select> */}
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-4 p-3 border border-gray-300 rounded-lg w-full"
              required
            />
            <input
              type="text"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter secret key"
              className="mt-4 p-3 border border-gray-300 rounded-lg w-full"
              required
            />
            <button
              type="submit"
              className="w-full py-3 mt-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300"
            >
              Decrypt and Download Original File
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
