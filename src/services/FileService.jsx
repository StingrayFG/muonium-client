import axios from 'axios';

const FileService = {
  handleFileUpload: async (userData, file) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}`};

    const formData = new FormData();
    formData.append('file', file);
    
    await axios.post(process.env.REACT_APP_BACKEND_URL + '/file/upload/' + userData.userUuid + '/' + userData.driveUuid + '/' + 'root', formData, {headers})
      .then(res => {
        return(res.data);
      })
      .catch(err => {
        return(err);
      });
  },

  handleFileDownload: async (userData, file) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}` };

    const body = { userUuid: userData.userUuid, driveUuid: userData.driveUuid, fileUuid: file.uuid};

    await axios.post(process.env.REACT_APP_BACKEND_URL + '/file/download', body, {headers})
      .then(res => {
        console.log(process.env.REACT_APP_BACKEND_URL + '/file/download/' + file.uuid + '/' + res.data.downloadToken);
        window.location.href = (process.env.REACT_APP_BACKEND_URL + '/file/download/' + file.uuid + '/' + res.data.downloadToken);
      })
      .catch(err => {
        return(err);
      });
  },


}

export default FileService; 