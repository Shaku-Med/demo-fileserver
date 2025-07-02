'use client'

import { createContext, useContext, useState } from "react";

interface ContextProps {
    openCreateDialog: (type: 'folder' | 'file' | 'document' | 'image' | 'music' | 'video' | 'archive') => void;
    openUploadDialog: () => void;
    currentLayout: 'table' | 'grid' | 'list' | 'columns' | 'rows';
    setCurrentLayout: (layout: 'table' | 'grid' | 'list' | 'columns' | 'rows') => void;
    sortBy: 'name' | 'type' | 'date';
    setSortBy: (sortBy: 'name' | 'type' | 'date') => void;
    sortOrder: 'asc' | 'desc';
    setSortOrder: (sortOrder: 'asc' | 'desc') => void;
    iconSize: 'small' | 'medium' | 'large';
    setIconSize: (iconSize: 'small' | 'medium' | 'large') => void;
    isCreateDialogOpen: boolean;
    setIsCreateDialogOpen: (open: boolean) => void;
    isUploadDialogOpen: boolean;
    setIsUploadDialogOpen: (open: boolean) => void;
    selectedItemType: 'folder' | 'file' | 'document' | 'image' | 'music' | 'video' | 'archive' | null;
    setSelectedItemType: (type: 'folder' | 'file' | 'document' | 'image' | 'music' | 'video' | 'archive' | null) => void;
}

const Context = createContext<ContextProps | null>(null)

interface ContextProviderProps {
    children: React.ReactNode
}

export const ContextProvider = ({children}: ContextProviderProps) => {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
    const [selectedItemType, setSelectedItemType] = useState<'folder' | 'file' | 'document' | 'image' | 'music' | 'video' | 'archive' | null>(null)
    const [currentLayout, setCurrentLayout] = useState<'table' | 'grid' | 'list' | 'columns' | 'rows'>('table')
    const [sortBy, setSortBy] = useState<'name' | 'type' | 'date'>('name')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
    const [iconSize, setIconSize] = useState<'small' | 'medium' | 'large'>('medium')

    const openCreateDialog = (type: 'folder' | 'file' | 'document' | 'image' | 'music' | 'video' | 'archive') => {
        setSelectedItemType(type);
        setIsCreateDialogOpen(true);
    };
    
    const openUploadDialog = () => {
        setIsUploadDialogOpen(true);
    };

    return (
        <Context.Provider value={{
            openCreateDialog,
            openUploadDialog,
            currentLayout,
            setCurrentLayout,
            sortBy,
            setSortBy,
            sortOrder,
            setSortOrder,
            iconSize,
            setIconSize,
            isCreateDialogOpen,
            setIsCreateDialogOpen,
            isUploadDialogOpen,
            setIsUploadDialogOpen,
            selectedItemType,
            setSelectedItemType,
        }}>
            {children}
        </Context.Provider>
    )
}

export const useDashboardContext = () => {
    const context = useContext(Context)
    if (!context) {
        throw new Error('useDashboardContext must be used within a ContextProvider')
    }
    return context
}