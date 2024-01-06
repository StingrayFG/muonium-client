import axios from 'axios';

const handleFileUpload = async (userData, file) => {
  const headers = { 'Authorization': `Bearer ${userData.accessToken}` };

  const formData = new FormData();
  formData.append('file', file);

  formData.append('body', JSON.stringify({ ownerUuid: userData.userUuid, parentUuid: '/root', driveUuid: userData.driveUuid }));
  
  await axios.post(process.env.REACT_APP_BACKEND_URL + '/file/upload', formData, {headers})
    .then(res => {
      return(res.data.fileUuid);
    })
    .catch(err => {
      return(err);
    });
};

export default handleFileUpload; 