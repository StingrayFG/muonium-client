import axios from 'axios';

const FileService = {
  handleFileUpload: async (userData, file) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}` };

    const formData = new FormData();
    formData.append('file', file);

    formData.append('body', JSON.stringify({ userUuid: userData.userUuid, parentUuid: '/root', driveUuid: userData.driveUuid }));
    
    await axios.post(process.env.REACT_APP_BACKEND_URL + '/file/upload', formData, {headers})
      .then(res => {
        return(res.data.fileUuid);
      })
      .catch(err => {
        return(err);
      });
  },

  handleFileDownload: async (userData, file) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}` };

    const body = { userUuid: userData.userUuid, driveUuid: userData.driveUuid, fileUuid: file.uuid};
    
    let anchor = document.createElement("a");
    document.body.appendChild(anchor);
    axios.post(process.env.REACT_APP_BACKEND_URL + '/file/download/', body, {headers})
      .then(res => {
        console.log(process.env.REACT_APP_BACKEND_URL + '/file/download/' + file.uuid + '/' + res.data.downloadToken);
        window.location.href = (process.env.REACT_APP_BACKEND_URL + '/file/download/' + file.uuid + '/' + res.data.downloadToken);
      })
      .catch(err => {
        return(err);
      });
  }
}

export default FileService; 