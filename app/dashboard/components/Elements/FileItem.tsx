export interface FileItem {
    name: string;
    title: string;
    artists: string;
    album: string;
    icon: string;
    type: 'file' | 'folder';
    content?: string;
    metadata?: Record<string, any>;
    vector?: number[];
    similarity?: number;
    repo?: string;
}