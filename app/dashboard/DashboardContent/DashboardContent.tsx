'use client'

import React, { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import NewButton from '../components/NewButton';
import SortButton from '../components/SortButton';
import MoreButton from '../components/MoreButton';
import { FileItem } from '../components/Elements/FileItem';
import FileLayout from '../components/Elements/FileLayout';
import LayoutSwitcher, { LayoutType } from '../components/Elements/LayoutSwitcher';
import ViewOptions from '../components/Elements/ViewOptions';
import FileCounter from '../components/Elements/FileCounter';
import { SelectionProvider, useSelection } from '../components/Elements/SelectionContext';
import SelectionToolbar from '../components/Elements/SelectionToolbar';
import AddNewButton from '../components/Elements/AddNewButton';
import CreateItemDialog, { ItemType } from '../components/Elements/CreateItemDialog';
import FileUploadDialog from '../components/Elements/FileUploadDialog';
import { SearchProvider, useSearch } from '../components/Elements/SearchContext';
import AdvancedSearchBar from '../components/Elements/AdvancedSearchBar';
import SearchResults from '../components/Elements/SearchResults';
import { useDashboardContext } from '../context/Context';

// {
//   name: "data.xlsx",
//   title: "Sales Data",
//   artists: "Analytics Team",
//   album: "Reports",
//   icon: "file",
//   type: "file",
//   content: "Excel spreadsheet containing detailed sales data, customer information, product performance metrics, and quarterly analysis."
// },

function DashboardContent({files}: {files: FileItem[]}) {
  const {
    currentLayout,
    sortBy,
    sortOrder,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isUploadDialogOpen,
    setIsUploadDialogOpen,
    selectedItemType,
    setSelectedItemType
  } = useDashboardContext();

  const [fileList, setFileList] = useState<FileItem[]>(files);
  const { selectAll, deselectAll, getSelectedFiles } = useSelection();
  const { searchFiles } = useSearch();

  const sortedFiles = useMemo(() => {
    return [...fileList].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'date':
          comparison = 0;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [fileList, sortBy, sortOrder]);

  const filteredFiles = useMemo(() => {
    return searchFiles(sortedFiles);
  }, [sortedFiles, searchFiles]);

  const handleDelete = () => {
    const selectedFiles = getSelectedFiles(fileList);
    const selectedNames = new Set(selectedFiles.map((f: FileItem) => f.name));
    setFileList(prev => prev.filter(file => !selectedNames.has(file.name)));
  };

  const handleDownload = () => {
    const selectedFiles = getSelectedFiles(fileList);
    console.log('Downloading files:', selectedFiles.map((f: FileItem) => f.name));
  };

  const handleCopy = () => {
    const selectedFiles = getSelectedFiles(fileList);
    console.log('Copying files:', selectedFiles.map((f: FileItem) => f.name));
  };

  const handleCut = () => {
    const selectedFiles = getSelectedFiles(fileList);
    console.log('Cutting files:', selectedFiles.map((f: FileItem) => f.name));
  };

  const handleEdit = () => {
    const selectedFiles = getSelectedFiles(fileList);
    if (selectedFiles.length === 1) {
      console.log('Editing file:', selectedFiles[0].name);
    }
  };

  const handleShare = () => {
    const selectedFiles = getSelectedFiles(fileList);
    console.log('Sharing files:', selectedFiles.map((f: FileItem) => f.name));
  };

  const handleSelectAll = () => {
    selectAll();
  };

  const handleDeselectAll = () => {
    deselectAll();
  };

  const getFileExtension = (type: ItemType): string => {
    switch (type) {
      case 'document': return '.txt';
      case 'image': return '.png';
      case 'music': return '.mp3';
      case 'video': return '.mp4';
      case 'archive': return '.zip';
      default: return '';
    }
  };

  const handleCreateItem = (name: string, type: ItemType) => {
    const extension = getFileExtension(type);
    const fullName = type === 'folder' ? name : name + extension;
    
    const newItem: FileItem = {
      name: fullName,
      title: type === 'folder' ? '' : `New ${type}`,
      artists: '',
      album: '',
      icon: type === 'folder' ? 'folder' : 'file',
      type: type === 'folder' ? 'folder' : 'file',
      content: type === 'folder' ? `New folder: ${name}` : `New ${type} file: ${name}`
    };

    setFileList(prev => [newItem, ...prev]);
  };

  const handleUploadFiles = (files: File[]) => {
    const newItems: FileItem[] = files.map(file => ({
      name: file.name,
      title: `Uploaded ${file.type || 'file'}`,
      artists: '',
      album: '',
      icon: 'file',
      type: 'file',
      content: `Uploaded file: ${file.name} (${file.type || 'unknown type'})`
    }));

    setFileList(prev => [...newItems, ...prev]);
  };

  return (
    <>
      <SelectionToolbar
        onDelete={handleDelete}
        onDownload={handleDownload}
        onCopy={handleCopy}
        onCut={handleCut}
        onEdit={handleEdit}
        onShare={handleShare}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        totalFiles={fileList.length}
      />

      <SearchResults 
        totalFiles={fileList.length}
        filteredFiles={filteredFiles.length}
      />

      <FileCounter files={filteredFiles} />

      <FileLayout files={filteredFiles} layout={currentLayout} />

      <CreateItemDialog
        isOpen={isCreateDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setSelectedItemType(null);
        }}
        onCreate={handleCreateItem}
        itemType={selectedItemType}
      />

      <FileUploadDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUpload={handleUploadFiles}
      />
    </>
  );
}

export default function DashboardPage({allJsonContents}: {allJsonContents?: FileItem[]}) {
  return (
        <DashboardContent files={allJsonContents || []} />
  );
} 