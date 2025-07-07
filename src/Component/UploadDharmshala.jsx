import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

const UploadDharmshala = () => {
  const [dharmshalaName, setDharmshalaName] = useState('');
  const [location, setLocation] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerContact, setOwnerContact] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const pickImage = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: 'photo', quality: 1 },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.assets && response.assets.length > 0) {
          setImageUri(response.assets[0].uri);
        }
      }
    );
  };

  const handleSubmit = () => {
    if (!dharmshalaName || !location || !ownerName || !ownerContact) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    // TODO: Upload logic (send data to backend)
    console.log({
      dharmshalaName,
      location,
      ownerName,
      ownerContact,
      imageUri
    });

    Alert.alert('Success', 'Dharmshala Uploaded Successfully');
    // Clear the form
    setDharmshalaName('');
    setLocation('');
    setOwnerName('');
    setOwnerContact('');
    setImageUri(null);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Upload Dharmshala</Text>

      <Text>Dharmshala Name</Text>
      <TextInput
        value={dharmshalaName}
        onChangeText={setDharmshalaName}
        placeholder="Enter name"
        style={{ borderBottomWidth: 1, marginBottom: 15 }}
      />

      <Text>Location</Text>
      <TextInput
        value={location}
        onChangeText={setLocation}
        placeholder="Enter location"
        style={{ borderBottomWidth: 1, marginBottom: 15 }}
      />

      <Text>Owner Name</Text>
      <TextInput
        value={ownerName}
        onChangeText={setOwnerName}
        placeholder="Enter owner name"
        style={{ borderBottomWidth: 1, marginBottom: 15 }}
      />

      <Text>Owner Contact</Text>
      <TextInput
        value={ownerContact}
        onChangeText={setOwnerContact}
        placeholder="Enter contact number"
        keyboardType="phone-pad"
        style={{ borderBottomWidth: 1, marginBottom: 15 }}
      />

      <Button title="Pick Image" onPress={pickImage} />
      {imageUri && (
        <Image source={{ uri: imageUri }} style={{ width: '100%', height: 200, marginVertical: 15 }} />
      )}

      <Button title="Submit" onPress={handleSubmit} color="#4CAF50" />
    </ScrollView>
  );
};

export default UploadDharmshala;
