
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";

const CollaborativeEditor = ({ initialContent, onSave }) => {
  const [textContent, setTextContent] = useState(initialContent?.text || "");
  const [codeContent, setCodeContent] = useState(initialContent?.code || "");
  const [activeTab, setActiveTab] = useState("text");

  const handleSave = () => {
    onSave({
      text: textContent,
      code: codeContent,
    });
  };

  const getCurrentTimestamp = () => {
    return new Date().toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Collaborative Editor</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            Last edited: {getCurrentTimestamp()}
          </span>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      <Tabs defaultValue="text" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="text">Notes</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="mt-2">
          <Textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Write your notes here... (Supports Markdown)"
            className="min-h-[300px] font-mono"
          />
        </TabsContent>
        
        <TabsContent value="code" className="mt-2">
          <Textarea
            value={codeContent}
            onChange={(e) => setCodeContent(e.target.value)}
            placeholder="// Write your code here..."
            className="min-h-[300px] font-mono bg-gray-50"
          />
        </TabsContent>
      </Tabs>

      <div className="mt-4 text-xs text-gray-500">
        <p>Changes are saved automatically and visible to all team members.</p>
      </div>
    </div>
  );
};

export default CollaborativeEditor;
