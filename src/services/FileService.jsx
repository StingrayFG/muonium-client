import { instance } from 'services/AxiosInstance';


const FileService = {
  handleUpload: async (userData, driveData, fileData, file) => {
    return new Promise( async function(resolve, reject) {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const formData = new FormData();
      formData.append('file', file);
      
      await instance.post('/file/upload/' + userData.uuid + '/' + 
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

      await instance.post('/file/download', body, { headers })
      .then(res => {
        resolve('/file/download/' + fileData.uuid + '/' + res.data.downloadToken);
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

      await instance.post('/file/download', body, { headers })
      .then(res => {
        window.location.href = ('/file/download/' + fileData.uuid + '/' + res.data.downloadToken);
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
  
      await instance.put('/file/rename', body, { headers })
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

      await instance.post('/file/copy', body, { headers })
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

      await instance.put('/file/move', body, { headers })
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

      await instance.put('/file/remove', body, { headers })
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

      await instance.put('/file/recover', body, { headers })
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

      await instance.post('/file/delete', body, { headers })
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