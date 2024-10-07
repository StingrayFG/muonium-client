import axios from 'axios';

const FileService = {
  handleUpload: async (userData, driveData, fileData, file) => {
    return new Promise( async function(resolve, reject) {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const formData = new FormData();
      formData.append('file', file);
      
      await axios.post(process.env.REACT_APP_BACKEND_URL + '/file/upload/' + userData.uuid + '/' + 
      driveData.uuid + '/' + fileData.parentUuid, formData, { headers })
      .then(res => {
        resolve(res.data.fileData);
      })
      .catch(err => {
        reject(err);
      }); 
    }) 
  },    

  handleGetImageLink: async (userData, driveData, fileData) => {
    return new Promise( async function(resolve, reject) {  
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userData, driveData, fileData };

      await axios.post(process.env.REACT_APP_BACKEND_URL + '/file/download', body, { headers })
      .then(res => {
        resolve(process.env.REACT_APP_BACKEND_URL + '/file/download/' + fileData.uuid + '/' + res.data.downloadToken);
      })
      .catch(err => {
        reject(err);
      }); 
    }) 
  },

  handleDownload: async (userData, driveData, fileData) => {
    return new Promise( async function(resolve, reject) {  
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userData, driveData, fileData };

      await axios.post(process.env.REACT_APP_BACKEND_URL + '/file/download', body, { headers })
      .then(res => {
        window.location.href = (process.env.REACT_APP_BACKEND_URL + '/file/download/' + fileData.uuid + '/' + res.data.downloadToken);
        resolve(res.data.fileData);
      })
      .catch(err => {
        reject(err);
      }); 
    }) 
  },

  handleRename: async (userData, driveData, fileData) => { 
    return new Promise(async (resolve, reject) => {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userData, driveData, fileData };
  
      await axios.put(process.env.REACT_APP_BACKEND_URL + '/file/rename', body, { headers })
      .then(res => {
        resolve(res.data.fileData);
      })
      .catch(err => {
        reject(err);
      });  
    })
  },

  handleCopy: async (userData, driveData, fileData) => { 
    return new Promise(async (resolve, reject) => {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userData, driveData, fileData };

      await axios.post(process.env.REACT_APP_BACKEND_URL + '/file/copy', body, { headers })
      .then(res => {
        resolve(res.data.fileData);
      })
      .catch(err => {
        reject(err);
      }); 
    }) 
  },

  handleMove: async (userData, driveData, fileData) => { 
    return new Promise(async (resolve, reject) => {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userData, driveData, fileData };

      await axios.put(process.env.REACT_APP_BACKEND_URL + '/file/move', body, { headers })
      .then(res => {
        resolve(res.data.fileData);
      })
      .catch(err => {
        reject(err);
      }); 
    })  
  },

  handleRemove: async (userData, driveData, fileData) => {
    return new Promise(async (resolve, reject) => {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userData, driveData, fileData };

      await axios.put(process.env.REACT_APP_BACKEND_URL + '/file/remove', body, { headers })
      .then(res => {
        resolve(res.data.fileData);
      })
      .catch(err => {
        reject(err);
      }); 
    }) 
  },

  handleRecover: async (userData, driveData, fileData) => {
    return new Promise(async (resolve, reject) => {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userData, driveData, fileData };

      await axios.put(process.env.REACT_APP_BACKEND_URL + '/file/recover', body, { headers })
      .then(res => {
        resolve(res.data.fileData);
      })
      .catch(err => {
        reject(err);
      }); 
    })  
  },

  handleDelete: async (userData, driveData, fileData) => {
    return new Promise(async (resolve, reject) => {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userData, driveData, fileData };

      await axios.post(process.env.REACT_APP_BACKEND_URL + '/file/delete', body, { headers })
      .then(res => {
        resolve(res.data.fileData);
      })
      .catch(err => {
        reject(err);
      }); 
    }) 
  },
}

export default FileService; 