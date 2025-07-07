import React, { useState } from 'react';

const UploadDharmshala = () => {
  const [dharmshalaName, setDharmshalaName] = useState('');
  const [location, setLocation] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerContact, setOwnerContact] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dharmshalaName || !location || !ownerName || !ownerContact) {
      alert('Please fill all fields');
      return;
    }

    // TODO: Upload logic (send data to backend)
    console.log({
      dharmshalaName,
      location,
      ownerName,
      ownerContact,
      image,
    });

    alert('Dharmshala Uploaded Successfully');

    // Clear the form
    setDharmshalaName('');
    setLocation('');
    setOwnerName('');
    setOwnerContact('');
    setImage(null);
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Upload Dharmshala</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Dharmshala Name</label><br />
          <input
            type="text"
            value={dharmshalaName}
            onChange={(e) => setDharmshalaName(e.target.value)}
            placeholder="Enter name"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Location</label><br />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Owner Name</label><br />
          <input
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder="Enter owner name"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Owner Contact</label><br />
          <input
            type="tel"
            value={ownerContact}
            onChange={(e) => setOwnerContact(e.target.value)}
            placeholder="Enter contact number"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Upload Image</label><br />
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        {image && (
          <div style={{ marginBottom: '15px' }}>
            <img src={image} alt="Dharmshala Preview" style={{ width: '100%', height: 'auto' }} />
          </div>
        )}

        <button type="submit" style={{ padding: '10px 20px', background: '#4CAF50', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default UploadDharmshala;
