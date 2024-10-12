import { instance } from 'services/AxiosInstance';


const BookmarkService = {
  handleCreate: async (userData, bookmarkData) => { 
    return new Promise(async (resolve, reject) => {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userData, bookmarkData };
  
      await instance.post('/bookmark/create', body, { headers })
      .then(res => {
        resolve(res.data.bookmarkData);
      })
      .catch(err => {
        reject(err);
      });  
    })
  },

  handleGet: async (userData) => { 
    return new Promise(async (resolve, reject) => {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userData };
  
      await instance.post('/bookmark/get', body, { headers })
      .then(res => {
        resolve(res.data.bookmarksData);
      })
      .catch(err => {
        reject(err);
      });  
    })
  },

  handleDelete: async (userData, bookmarkData) => { 
    return new Promise(async (resolve, reject) => {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userData, bookmarkData };
  
      await instance.post('/bookmark/delete', body, { headers })
      .then(res => {
        resolve(res.data.bookmarkData);
      })
      .catch(err => {
        reject(err);
      });  
    })
  },
}

export default BookmarkService; 