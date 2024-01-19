import axios from 'axios';

const FileService = {
  handleUpload: async (userData, parentUuid, file) => {
    return new Promise( async function(resolve, reject) {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}`};
      const formData = new FormData();
      formData.append('file', file);
      
      await axios.post(process.env.REACT_APP_BACKEND_URL + '/file/upload/' + userData.userUuid + '/' + userData.driveUuid + '/' + parentUuid, formData, {headers})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      }); 
    }) 
  },

  handleDownload: async (userData, file) => {
    return new Promise( async function(resolve, reject) {  
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userUuid: userData.userUuid, driveUuid: userData.driveUuid, fileUuid: file.uuid };

      await axios.post(process.env.REACT_APP_BACKEND_URL + '/file/download', body, {headers})
      .then(res => {
        window.location.href = (process.env.REACT_APP_BACKEND_URL + '/file/download/' + file.uuid + '/' + res.data.downloadToken);
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      }); 
    }) 
  },

  handleRename: async (userData, file) => {
    return new Promise( async function(resolve, reject) {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userUuid: userData.userUuid, driveUuid: userData.driveUuid, fileUuid: file.uuid, fileName: file.name };
  
      await axios.put(process.env.REACT_APP_BACKEND_URL + '/file/rename', body, {headers})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });  
    })
  },

  handleCopy: async (userData, parentUuid, file) => {
    return new Promise( async function(resolve, reject) {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userUuid: userData.userUuid, driveUuid: userData.driveUuid, parentUuid, fileUuid: file.uuid };

      await axios.put(process.env.REACT_APP_BACKEND_URL + '/file/copy', body, {headers})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      }); 
    }) 
  },

  handleMove: async (userData, parentUuid, file) => {
    return new Promise( async function(resolve, reject) {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userUuid: userData.userUuid, driveUuid: userData.driveUuid, parentUuid, fileUuid: file.uuid };

      await axios.put(process.env.REACT_APP_BACKEND_URL + '/file/move', body, {headers})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      }); 
    })  
  },

  handleRemove: async (userData, file) => {
    return new Promise( async function(resolve, reject) {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userUuid: userData.userUuid, driveUuid: userData.driveUuid, fileUuid: file.uuid };

      await axios.put(process.env.REACT_APP_BACKEND_URL + '/file/remove', body, {headers})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      }); 
    }) 
  },

  handleRecover: async (userData, file) => {
    return new Promise( async function(resolve, reject) {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userUuid: userData.userUuid, driveUuid: userData.driveUuid, fileUuid: file.uuid };

      await axios.put(process.env.REACT_APP_BACKEND_URL + '/file/recover', body, {headers})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      }); 
    })  
  },

  handleDelete: async (userData, file) => {
    return new Promise( async function(resolve, reject) {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userUuid: userData.userUuid, driveUuid: userData.driveUuid, fileUuid: file.uuid };

      await axios.post(process.env.REACT_APP_BACKEND_URL + '/file/delete', body, {headers})
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      }); 
    }) 
  },
}

export default FileService; 