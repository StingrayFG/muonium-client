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
    let newElement;   
    if (element.type === 'file') {
      await FileService.handleUpload(userData, driveData, element, file)
      .then(res => {
        newElement = res;   
      })
      .catch(() => {
        return thunkAPI.rejectWithValue(element);
      })
    }
    if (newElement) {
      return thunkAPI.fulfillWithValue(newElement);
    } else {
      return thunkAPI.rejectWithValueWithValue();
    } 
  },
);

export const createElement = createAsyncThunk(
  'elements/create',
  async ({ userData, driveData, element}, thunkAPI) => {
    let newElement;   
    if (element.type === 'folder') {
      await FolderService.handleCreate(userData, driveData, element)
      .then(res => {
        newElement = res;   
      })
    }
    if (newElement) {
      return thunkAPI.fulfillWithValue(newElement);
    } else {
      return thunkAPI.rejectWithValueWithValue();
    }
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

    if (failedElements.length > 0) {
      return thunkAPI.rejectWithValue(failedElements);
    } else {
      return thunkAPI.fulfillWithValue();
    }
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

    if (failedElements.length > 0) {
      return thunkAPI.rejectWithValue(failedElements);
    } else {
      return thunkAPI.fulfillWithValue();
    }
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

    if (failedElements.length > 0) {
      return thunkAPI.rejectWithValue(failedElements);
    } else {
      return thunkAPI.fulfillWithValue();
    }
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

    if (failedElements.length > 0) {
      return thunkAPI.rejectWithValue(failedElements);
    } else {
      return thunkAPI.fulfillWithValue();
    }
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

    if (failedElements.length > 0) {
      return thunkAPI.rejectWithValue(failedElements);
    } else {
      return thunkAPI.fulfillWithValue();
    }
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

    if (failedElements.length > 0) {
      return thunkAPI.rejectWithValue(failedElements);
    } else {
      return thunkAPI.fulfillWithValue();
    }
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

    if (failedElements.length > 0) {
      return thunkAPI.rejectWithValue(failedElements);
    } else {
      return thunkAPI.fulfillWithValue();
    }
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
        reorderedFiles.find((file, index) => {
          if (file.uuid === element.uuid) {
            delete reorderedFiles[index].originalElement;
            reorderedFiles[index] = { ...element, originalElement: reorderedFiles[index] };
          }
        })
      } else if (element.type === 'folder') {
        reorderedFolders.find((folder, index) => {
          if (folder.uuid === element.uuid) {
            delete reorderedFolders[index].originalElement;
            reorderedFolders[index] = { ...element, originalElement: reorderedFolders[index] };
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
        reorderedFiles.find((file, index) => {
          if (file.uuid === element.uuid) {
            reorderedFiles[index] = reorderedFiles[index].originalElement;
          }
        })
      } else if (element.type === 'folder') {
        reorderedFolders.find((folder, index) => {
          if (folder.uuid === element.uuid) {
            reorderedFolders[index] = reorderedFolders[index].originalElement;
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

const updateUuidToPermanent = (state, clientElement, serverElement) => {
  state = parseToObject(state);
  if (clientElement && serverElement) {
    let reorderedFiles = state.files;
    let reorderedFolders = state.folders;

    if (clientElement.type === 'file') {
      reorderedFiles.find((file, index) => {
        if (file.uuid === clientElement.uuid) {
          reorderedFiles[index] = serverElement;
        }
      })
    } else if (clientElement.type === 'folder') {
      reorderedFolders.find((folder, index) => {
        if (folder.uuid === clientElement.uuid) { 
          reorderedFolders[index] = serverElement;
        }
      })
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
      return removeElementsOnClient(state, [action.meta.arg.element]);
    });


    builder.addCase(createElement.pending, (state, action) => {
      return addElementsOnClient(state, [action.meta.arg.element]);
    });
    builder.addCase(createElement.fulfilled, (state, action) => {
      return updateUuidToPermanent(state, action.meta.arg.element, action.payload);
    });
    builder.addCase(createElement.rejected, (state, action) => {
      return removeElementsOnClient(state, [action.meta.arg.element]);
    });


    builder.addCase(renameElements.pending, (state, action) => {
      return updateElementsOnClient(state, action.meta.arg.elements);
    });
    builder.addCase(renameElements.rejected, (state, action) => {
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

