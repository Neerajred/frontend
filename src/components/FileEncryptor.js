import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

const FileEncryptor = () => {
  const [file, setFile] = useState(null);
  const [key, setKey] = useState('');
  const [encryptedFile, setEncryptedFile] = useState(null);
  const [decryptedContent, setDecryptedContent] = useState('');
  const [decryptedBlob, setDecryptedBlob] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState('.txt');
  const [decryptKey, setDecryptKey] = useState('');

  const fileTypes = ['.png', '.jpg', '.txt', '.mp3', '.pdf', '.docx', '.wav'];

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleKeyChange = (event) => {
    setKey(event.target.value);
  };

  const handleDecryptKeyChange = (event) => {
    setDecryptKey(event.target.value);
  };

  const handleFileTypeChange = (event) => {
    setSelectedFileType(event.target.value);
  };

  const toBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const fromBase64 = (base64) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const encryptFile = () => {
    if (!file || !key) {
      alert('Please upload a file and enter a key');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const fileContent = reader.result;
      const base64Content = toBase64(fileContent);
      const encrypted = CryptoJS.TripleDES.encrypt(base64Content, key).toString();
      const blob = new Blob([encrypted], { type: 'text/plain' });
      setEncryptedFile(URL.createObjectURL(blob));
    };
    reader.readAsArrayBuffer(file);
  };

  const decryptFile = () => {
    if (!file || !decryptKey) {
      alert('Please upload a file and enter a key for decryption');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const encryptedContent = reader.result;
      const decryptedBytes = CryptoJS.TripleDES.decrypt(encryptedContent, decryptKey);
      const decryptedBase64 = decryptedBytes.toString(CryptoJS.enc.Utf8);

      const arrayBuffer = fromBase64(decryptedBase64);
      const blob = new Blob([arrayBuffer], { type: selectedFileType });
      setDecryptedBlob(blob);

      if (selectedFileType === '.txt' || selectedFileType === '.docx') {
        const textDecoder = new TextDecoder('utf-8');
        setDecryptedContent(textDecoder.decode(arrayBuffer));
      } else if (selectedFileType === '.png' || selectedFileType === '.jpg') {
        const imageUrl = URL.createObjectURL(blob);
        setDecryptedContent(<img src={imageUrl} alt="Decrypted Image" style={{ maxWidth: '100%' }} />);
      } else if (selectedFileType === '.mp3' || selectedFileType === '.wav') {
        const audioUrl = URL.createObjectURL(blob);
        setDecryptedContent(<audio controls src={audioUrl} />);
      } else if (selectedFileType === '.pdf') {
        const pdfUrl = URL.createObjectURL(blob);
        setDecryptedContent(<iframe src={pdfUrl} width="100%" height="600" title="Decrypted PDF" />);
      }
    };
    reader.readAsText(file);
  };

  const downloadFile = () => {
    if (!decryptedBlob) {
      alert('No file available for download');
      return;
    }

    const link = document.createElement('a');
    link.href = URL.createObjectURL(decryptedBlob);
    link.download = `decrypted_file${selectedFileType}`;
    link.click();
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gradient-to-r from-purple-500 to-blue-500 min-h-screen">
      <h1 className="text-white text-4xl font-bold mb-6">File Encryptor/Decryptor</h1>
      
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Encrypt a File</h2>
        <input type="file" onChange={handleFileChange} className="border rounded-lg p-2 mb-4 w-full" />
        <input 
          type="text" 
          placeholder="Enter Secret Key" 
          value={key} 
          onChange={handleKeyChange} 
          className="border rounded-lg p-2 mb-4 w-full" 
        />
        <button onClick={encryptFile} className="bg-purple-600 text-white rounded-lg p-2 hover:bg-purple-700 w-full">Encrypt</button>

        {encryptedFile && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-800">Encrypted File Ready</h2>
            <a href={encryptedFile} download={`encrypted_${file.name}.txt`} className="text-purple-600 hover:underline">Download Encrypted File</a>
          </div>
        )}
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Decrypt File</h2>
        <input type="file" onChange={handleFileChange} className="border rounded-lg p-2 mb-4 w-full" />
        
        <select onChange={handleFileTypeChange} value={selectedFileType} className="border rounded-lg p-2 mb-4 w-full">
          {fileTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        
        <input 
          type="text" 
          placeholder="Enter Secret Key for Decryption" 
          value={decryptKey} 
          onChange={handleDecryptKeyChange} 
          className="border rounded-lg p-2 mb-4 w-full" 
        />
        <button onClick={decryptFile} className="bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700 w-full">Decrypt</button>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Decrypted Content</h2>
        {decryptedContent && (
          <div>
            {typeof decryptedContent === 'string' ? (
              <textarea value={decryptedContent} readOnly rows="10" cols="50" className="border rounded-lg p-2 w-full" />
            ) : (
              decryptedContent
            )}
          </div>
        )}
      </div>

      {decryptedBlob && (
        <button onClick={downloadFile} className="bg-green-600 text-white rounded-lg p-2 mt-4 hover:bg-green-700">Download Decrypted File</button>
      )}
    </div>
  );
};

export default FileEncryptor;
