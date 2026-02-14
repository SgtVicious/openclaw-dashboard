import { useState } from 'react';
import { useFileStore } from '@/stores/fileStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { 
  FileText, 
  Folder, 
  Search, 
  Save, 
  FileCode,
  FileType,
  RotateCcw,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ConfigFile } from '@/types';

// File Tree Item
interface FileTreeItemProps {
  file: ConfigFile;
  isSelected: boolean;
  onSelect: (file: ConfigFile) => void;
}

function FileTreeItem({ file, isSelected, onSelect }: FileTreeItemProps) {
  const isJson = file.type === 'json';
  const Icon = isJson ? FileCode : FileType;
  
  return (
    <button
      onClick={() => onSelect(file)}
      className={cn(
        'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors',
        isSelected 
          ? 'bg-orange-100 text-orange-900' 
          : 'hover:bg-slate-100 text-slate-700'
      )}
    >
      <Icon className={cn('h-4 w-4', isJson ? 'text-blue-500' : 'text-orange-500')} />
      <span className="flex-1 truncate">{file.name}</span>
      {file.isDirty && (
        <span className="h-2 w-2 rounded-full bg-orange-500" />
      )}
    </button>
  );
}

// Simple Markdown Preview
function MarkdownPreview({ content }: { content: string }) {
  // Simple markdown parsing (for demo purposes)
  const lines = content.split('\n');
  
  return (
    <div className="prose prose-sm max-w-none prose-headings:text-slate-900 prose-p:text-slate-700">
      {lines.map((line, i) => {
        if (line.startsWith('# ')) {
          return <h1 key={i} className="text-2xl font-bold mt-4 mb-2">{line.slice(2)}</h1>;
        } else if (line.startsWith('## ')) {
          return <h2 key={i} className="text-xl font-semibold mt-3 mb-2">{line.slice(3)}</h2>;
        } else if (line.startsWith('### ')) {
          return <h3 key={i} className="text-lg font-medium mt-2 mb-1">{line.slice(4)}</h3>;
        } else if (line.startsWith('- ')) {
          return <li key={i} className="ml-4">{line.slice(2)}</li>;
        } else if (line.startsWith('```')) {
          return <pre key={i} className="bg-slate-100 p-2 rounded my-2"><code>{line.slice(3)}</code></pre>;
        } else if (line.trim() === '') {
          return <div key={i} className="h-2" />;
        } else {
          return <p key={i} className="my-1">{line}</p>;
        }
      })}
    </div>
  );
}

// JSON Editor with validation display
function JSONEditor({ content, onChange }: { content: string; onChange: (value: string) => void }) {
  const [isValid, setIsValid] = useState(true);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    onChange(value);
    try {
      JSON.parse(value);
      setIsValid(true);
    } catch {
      setIsValid(false);
    }
  };
  
  return (
    <div className="relative h-full">
      <textarea
        value={content}
        onChange={handleChange}
        className={cn(
          'h-full w-full resize-none rounded-lg border bg-slate-900 p-4 font-mono text-sm text-slate-100 focus:outline-none focus:ring-2',
          isValid ? 'border-slate-700 focus:ring-orange-500' : 'border-red-500 focus:ring-red-500'
        )}
        spellCheck={false}
      />
      {!isValid && (
        <div className="absolute bottom-4 right-4 rounded bg-red-500 px-2 py-1 text-xs text-white">
          Invalid JSON
        </div>
      )}
    </div>
  );
}

// Markdown Editor
function MarkdownEditor({ content, onChange }: { content: string; onChange: (value: string) => void }) {
  return (
    <textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      className="h-full w-full resize-none rounded-lg border border-slate-700 bg-slate-900 p-4 font-mono text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
      spellCheck={false}
    />
  );
}

export function WorkspacePage() {
  const { files, selectedFile, selectFile, updateFileContent, saveFile } = useFileStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isSaving, setIsSaving] = useState(false);
  
  const filteredFiles = files.filter((file: ConfigFile) => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const markdownFiles = filteredFiles.filter((f: ConfigFile) => f.type === 'markdown');
  const jsonFiles = filteredFiles.filter((f: ConfigFile) => f.type === 'json');

  const handleSave = async () => {
    if (!selectedFile) return;
    setIsSaving(true);
    await saveFile(selectedFile.path);
    setIsSaving(false);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Sidebar */}
      <Card className="w-64 flex-shrink-0 border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Workspace
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
          
          {/* File Tree */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase">Markdown Files</p>
            {markdownFiles.map((file: ConfigFile) => (
              <FileTreeItem
                key={file.path}
                file={file}
                isSelected={selectedFile?.path === file.path}
                onSelect={selectFile}
              />
            ))}
          </div>
          
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase">Config Files</p>
            {jsonFiles.map((file: ConfigFile) => (
              <FileTreeItem
                key={file.path}
                file={file}
                isSelected={selectedFile?.path === file.path}
                onSelect={selectFile}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Editor */}
      <Card className="flex-1 border-slate-200">
        {selectedFile ? (
          <>
            <CardHeader className="border-b border-slate-200 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{selectedFile.name}</CardTitle>
                  <Badge variant={selectedFile.type === 'json' ? 'default' : 'secondary'}>
                    {selectedFile.type}
                  </Badge>
                  {selectedFile.isDirty && (
                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                      Modified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">
                    Last modified: {new Date(selectedFile.lastModified).toLocaleString()}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving || !selectedFile.isDirty}
                    className="gap-1"
                  >
                    {isSaving ? (
                      <RotateCcw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 h-[calc(100%-4rem)]">
              {selectedFile.type === 'markdown' ? (
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'edit' | 'preview')} className="h-full">
                  <div className="border-b border-slate-200 px-4">
                    <TabsList className="h-10">
                      <TabsTrigger value="edit" className="gap-1">
                        <FileText className="h-4 w-4" />
                        Edit
                      </TabsTrigger>
                      <TabsTrigger value="preview" className="gap-1">
                        <Check className="h-4 w-4" />
                        Preview
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="edit" className="h-[calc(100%-3rem)] m-0 p-4">
                    <MarkdownEditor
                      content={selectedFile.content}
                      onChange={(content) => updateFileContent(selectedFile.path, content)}
                    />
                  </TabsContent>
                  <TabsContent value="preview" className="h-[calc(100%-3rem)] m-0 overflow-auto p-4">
                    <MarkdownPreview content={selectedFile.content} />
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="h-full p-4">
                  <JSONEditor
                    content={selectedFile.content}
                    onChange={(content) => updateFileContent(selectedFile.path, content)}
                  />
                </div>
              )}
            </CardContent>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-slate-400">
            <FileText className="h-16 w-16 mb-4" />
            <p className="text-lg font-medium">Select a file to edit</p>
            <p className="text-sm">Choose a file from the sidebar</p>
          </div>
        )}
      </Card>
    </div>
  );
}
