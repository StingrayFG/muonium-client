import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import FolderService from 'services/FolderService.jsx'
import FileService from 'services/FileService.jsx'


// THUNKS
export const getFolder = createAsyncThunk(
  'folder/get',
  async ({ userData, driveData, folderData}, thunkAPI) => {
    return FolderService.handleGetByUuid(userData, driveData, folderData)
  },
);

export const uploadElement = createAsyncThunk(
  'elements/upload',
  async ({ userData, driveData, element, file}, thunkAPI) => {
    let failedElements = [];
    
    if (element.type === 'file') {
      await FileService.handleUpload(userData, driveData, element, file)
      .catch(() => failedElements.push(element))
    }   

    return thunkAPI.fulfillWithValue(failedElements);
  },
);

export const createElement = createAsyncThunk(
  'elements/create',
  async ({ userData, driveData, element}, thunkAPI) => {
    let failedElements = [];

    if (element.type === 'folder') {
      await FolderService.handleCreate(userData, driveData, element)
      .catch(() => failedElements.push(element))
    }

    return thunkAPI.fulfillWithValue(failedElements);
  },
);

export const renameElements = createAsyncThunk(
  'elements/rename',
  async ({ userData, driveData, elements}, thunkAPI) => {
    let failedElements = [];

    for await (const element of elements) {
      if (element.type === 'file') { 
        await FileService.handleRename(userData, driveData, element)
        .catch(() => failedElements.push(element))
      } else if (element.type === 'folder') { 
        await FolderService.handleRename(userData, driveData, element)
        .catch(() => failedElements.push(element))
      }
    } 

    return thunkAPI.fulfillWithValue(failedElements);
  },
);

export const copyElements = createAsyncThunk(
  'elements/copy',
  async ({ userData, driveData, elements}, thunkAPI) => {
    let failedElements = [];

    for await (const element of elements) {
      if (element.type === 'file') {
        await FileService.handleCopy(userData, driveData, element)
        .catch(() => failedElements.push(element))
      }
    }

    return thunkAPI.fulfillWithValue(failedElements);
  },
);

export const pasteElements = createAsyncThunk(
  'elements/paste',
  async ({ userData, driveData, elements}, thunkAPI) => {
    let failedElements = [];

    for await (const element of elements) {
      if (element.type === 'file') { 
        await FileService.handleMove(userData, driveData, element)
        .catch(() => failedElements.push(element))
      } else if (element.type === 'folder') { 
        await FolderService.handleMove(userData, driveData, element)
        .catch(() => failedElements.push(element))
      }
    } 

    return thunkAPI.fulfillWithValue(failedElements);
  },
);


export const moveElements = createAsyncThunk(
  'elements/move',
  async ({ userData, driveData, elements}, thunkAPI) => {
    let failedElements = [];

    for await (const element of elements) {
      if (element.type === 'file') { 
        await FileService.handleMove(userData, driveData, element)
        .catch(() => failedElements.push(element))
      } else if (element.type === 'folder') { 
        await FolderService.handleMove(userData, driveData, element)
        .catch(() => failedElements.push(element))
      }
    } 

    return thunkAPI.fulfillWithValue(failedElements);
  },
);

export const removeElements = createAsyncThunk(
  'elements/remove',
  async ({ userData, driveData, elements}, thunkAPI) => {
    let failedElements = [];

    for await (const element of elements) {
      if (element.type === 'file') {  
        await FileService.handleRemove(userData, driveData, element)
        .catch(() => {failedElements.push(element)})
      } else if (element.type === 'folder') { 
        await FolderService.handleRemove(userData, driveData, element)
        .catch(() => {failedElements.push(element)})
      }
    }  

    return thunkAPI.fulfillWithValue(failedElements);
  },
);

export const recoverElements = createAsyncThunk(
  'elements/recover',
  async ({ userData, driveData, elements}, thunkAPI) => {
    let failedElements = [];

    for await (const element of elements) {
      if (element.type === 'file') {  
        await FileService.handleRecover(userData, driveData, element)
        .catch(() => {failedElements.push(element)})
      } else if (element.type === 'folder') { 
        await FolderService.handleRecover(userData, driveData, element)
        .catch(() => {failedElements.push(element)})
      }
    }  

    return thunkAPI.fulfillWithValue(failedElements);
  },
);


export const deleteElements = createAsyncThunk(
  'elements/delete',
  async ({ userData, driveData, elements}, thunkAPI) => {
    let failedElements = [];

    for await (const element of elements) {
      if (element.type === 'file') {  
        await FileService.handleDelete(userData, driveData, element)
        .catch(() => {failedElements.push(element)})
      } else if (element.type === 'folder') { 
        await FolderService.handleDelete(userData, driveData, element)
        .catch(() => {failedElements.push(element)})
      }
    }  

    return thunkAPI.fulfillWithValue(failedElements);
  },
);


// COMMON
const addElementsOnClient = (state, elements) => {
  state = parseToObject(state);
  if (elements.length > 0) {
    let reorderedFiles = state.files;
    let reorderedFolders = state.folders;

    for (const element of elements) {
      if (element.type === 'file') {
        reorderedFiles.push(element);
      } else if (element.type === 'folder') {
        reorderedFolders.push(element);
      }
    }

    reorderedFiles.sort((a, b) => a.name.localeCompare(b.name));
    reorderedFolders.sort((a, b) => a.name.localeCompare(b.name));

    return { 
      ...state, 
      files: reorderedFiles,
      folders: reorderedFolders
    };
  } else {
    return state;
  }
}

const updateElementsOnClient = (state, elements) => {
  state = parseToObject(state);
  if (elements.length > 0) {
    let reorderedFiles = state.files;
    let reorderedFolders = state.folders;

    for (const element of elements) {
      if (element.type === 'file') {
        reorderedFiles.find((o, i) => {
          if (o.uuid === element.uuid) {
            delete reorderedFiles[i].originalElement;
            reorderedFiles[i] = { ...element, originalElement: reorderedFiles[i] };
          }
        })
      } else if (element.type === 'folder') {
        reorderedFolders.find((o, i) => {
          if (o.uuid === element.uuid) {
            delete reorderedFolders[i].originalElement;
            reorderedFolders[i] = { ...element, originalElement: reorderedFolders[i] };
          }
        })
      }
    }

    reorderedFiles.sort((a, b) => a.name.localeCompare(b.name));
    reorderedFolders.sort((a, b) => a.name.localeCompare(b.name));

    return { 
      ...state, 
      files: reorderedFiles,
      folders: reorderedFolders
    };
  } else {
    return state;
  }
}

const revertUpdateElementsOnClient = (state, elements) => {
  state = parseToObject(state);
  if (elements.length > 0) {
    let reorderedFiles = state.files;
    let reorderedFolders = state.folders;

    for (const element of elements) {
      if (element.type === 'file') {
        reorderedFiles.find((o, i) => {
          if (o.uuid === element.uuid) {
            reorderedFiles[i] = reorderedFiles[i].originalElement;
          }
        })
      } else if (element.type === 'folder') {
        reorderedFolders.find((o, i) => {
          if (o.uuid === element.uuid) {
            reorderedFolders[i] = reorderedFolders[i].originalElement;
          }
        })
      }
    }

    reorderedFiles.sort((a, b) => a.name.localeCompare(b.name));
    reorderedFolders.sort((a, b) => a.name.localeCompare(b.name));

    return { 
      ...state, 
      files: reorderedFiles,
      folders: reorderedFolders
    };
  } else {
    return state;
  }
}

const removeElementsOnClient = (state, elements) => {
  state = parseToObject(state);
  if (elements.length > 0) {
    let reorderedFiles = state.files;
    let reorderedFolders = state.folders;

    const elementsUuids = elements.map(element => element.uuid);

    reorderedFiles = reorderedFiles.filter(file => (!elementsUuids.includes(file.uuid)))
    reorderedFolders = reorderedFolders.filter(folder => (!elementsUuids.includes(folder.uuid)))

    return { 
      ...state, 
      files: reorderedFiles,
      folders: reorderedFolders
    };
  } else {
    return state;
  }
}

const parseToObject = (state) => {
  return JSON.parse(JSON.stringify(state))
}


// SLICE
export const currentFolderSlice = createSlice({
  name: 'currentFolder',
  initialState: {
    uuid: '',
    files: [],
    folders: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFolder.fulfilled, (state, action) => {
      return action.payload;
    });

    builder.addCase(uploadElement.pending, (state, action) => {
      return addElementsOnClient(state, [action.meta.arg.element]);
    });
    builder.addCase(uploadElement.rejected, (state, action) => {
      return removeElementsOnClient(state, action.payload);
    });


    builder.addCase(createElement.pending, (state, action) => {
      return addElementsOnClient(state, [action.meta.arg.element]);
    });
    builder.addCase(createElement.rejected, (state, action) => {
      return removeElementsOnClient(state, action.payload);
    });


    builder.addCase(renameElements.pending, (state, action) => {
      return updateElementsOnClient(state, action.meta.arg.elements);
    });
    builder.addCase(renameElements.fulfilled, (state, action) => {
      return revertUpdateElementsOnClient(state, action.payload);
    });


    builder.addCase(copyElements.pending, (state, action) => {
      return addElementsOnClient(state, action.meta.arg.elements);
    });
    builder.addCase(copyElements.rejected, (state, action) => {
      return removeElementsOnClient(state, action.payload);
    });


    builder.addCase(pasteElements.pending, (state, action) => {
      return addElementsOnClient(state, action.meta.arg.elements);
    });
    builder.addCase(pasteElements.rejected, (state, action) => {
      return removeElementsOnClient(state, action.payload);
    });


    builder.addCase(moveElements.pending, (state, action) => {
      return removeElementsOnClient(state, action.meta.arg.elements);
    });
    builder.addCase(moveElements.rejected, (state, action) => {
      return addElementsOnClient(state, action.payload);
    });


    builder.addCase(removeElements.pending, (state, action) => {
      return removeElementsOnClient(state, action.meta.arg.elements);
    });
    builder.addCase(removeElements.rejected, (state, action) => {
      return addElementsOnClient(state, action.payload);
    });


    builder.addCase(recoverElements.pending, (state, action) => {
      return removeElementsOnClient(state, action.meta.arg.elements);
    });
    builder.addCase(recoverElements.rejected, (state, action) => {
      return addElementsOnClient(state, action.payload);
    });


    builder.addCase(deleteElements.pending, (state, action) => {
      return removeElementsOnClient(state, action.meta.arg.elements);
    });
    builder.addCase(deleteElements.rejected, (state, action) => {
      return addElementsOnClient(state, action.payload);
    });
  },
});

