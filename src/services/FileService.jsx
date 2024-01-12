import axios from 'axios';

const FileService = {
  handleUpload: async (userData, parentUuid, file) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}`};
    const formData = new FormData();
    formData.append('file', file);
    
    await axios.post(process.env.REACT_APP_BACKEND_URL + '/file/upload/' + userData.userUuid + '/' + userData.driveUuid + '/' + parentUuid, formData, {headers})
    .then(res => {
      return(res.data);
    })
    .catch(err => {
      return(err);
    });  
  },

  handleDownload: async (userData, file) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
    const body = { userUuid: userData.userUuid, driveUuid: userData.driveUuid, fileUuid: file.uuid };

    await axios.post(process.env.REACT_APP_BACKEND_URL + '/file/download', body, {headers})
    .then(res => {
      console.log(process.env.REACT_APP_BACKEND_URL + '/file/download/' + file.uuid + '/' + res.data.downloadToken);
      window.location.href = (process.env.REACT_APP_BACKEND_URL + '/file/download/' + file.uuid + '/' + res.data.downloadToken);
    })
    .catch(err => {
      return(err);
    });  
  },

  handleRename: async (userData, file) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
    const body = { userUuid: userData.userUuid, driveUuid: userData.driveUuid, fileUuid: file.uuid, fileName: file.name };

    await axios.put(process.env.REACT_APP_BACKEND_URL + '/file/rename', body, {headers})
    .then(res => {
      return(res.data);
    })
    .catch(err => {
      return(err);
    });  
  },

  handleCopy: async (userData, file) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
    const body = { userUuid: userData.userUuid, driveUuid: userData.driveUuid, fileUuid: file.uuid };

    await axios.put(process.env.REACT_APP_BACKEND_URL + '/file/copy', body, {headers})
    .then(res => {
      return(res.data);
    })
    .catch(err => {
      return(err);
    });  
  },

  handleMove: async (userData, parentUuid, file) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
    const body = { userUuid: userData.userUuid, driveUuid: userData.driveUuid, parentUuid, fileUuid: file.uuid };

    await axios.put(process.env.REACT_APP_BACKEND_URL + '/file/move', body, {headers})
    .then(res => {
      return(res.data);
    })
    .catch(err => {
      return(err);
    });  
  },

  handleRemove: async (userData, file) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
    const body = { userUuid: userData.userUuid, driveUuid: userData.driveUuid, fileUuid: file.uuid };

    await axios.put(process.env.REACT_APP_BACKEND_URL + '/file/remove', body, {headers})
    .then(res => {
      return(res.data);
    })
    .catch(err => {
      return(err);
    });  
  },

  handleRecover: async (userData, file) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
    const body = { userUuid: userData.userUuid, driveUuid: userData.driveUuid, fileUuid: file.uuid };

    await axios.put(process.env.REACT_APP_BACKEND_URL + '/file/recover', body, {headers})
    .then(res => {
      return(res.data);
    })
    .catch(err => {
      return(err);
    });  
  },

  handleDelete: async (userData, file) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
    const body = { userUuid: userData.userUuid, driveUuid: userData.driveUuid, fileUuid: file.uuid };

    await axios.post(process.env.REACT_APP_BACKEND_URL + '/file/delete', body, {headers})
    .then(res => {
      return(res.data);
    })
    .catch(err => {
      return(err);
    });  
  },
}

export default FileService; 