import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Copy, Send, ArrowLeft, Eye } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Template {
  id: string;
  name: string;
  type: "sms" | "whatsapp";
  content: string;
  variables: string[];
  category: string;
  usageCount: number;
  createdAt: string;
}

const Templates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      name: "OTP Verification",
      type: "sms",
      content: "Your verification code is: {{OTP}}. Valid for 10 minutes.",
      variables: ["OTP"],
      category: "Security",
      usageCount: 2450,
      createdAt: "2024-01-10",
    },
    {
      id: "2",
      name: "Order Confirmation",
      type: "sms",
      content: "Order #{{ORDER_ID}} confirmed! Total: {{AMOUNT}}. Track: {{TRACKING_URL}}",
      variables: ["ORDER_ID", "AMOUNT", "TRACKING_URL"],
      category: "E-commerce",
      usageCount: 1820,
      createdAt: "2024-01-15",
    },
    {
      id: "3",
      name: "Welcome Message",
      type: "whatsapp",
      content: "Welcome {{NAME}}! 👋 Thanks for joining. Reply HELP for assistance.",
      variables: ["NAME"],
      category: "General",
      usageCount: 892,
      createdAt: "2024-02-01",
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "sms" as "sms" | "whatsapp",
    content: "",
    category: "",
  });

  const extractVariables = (text: string): string[] => {
    const regex = /{{(\w+)}}/g;
    const matches = text.match(regex);
    return matches ? matches.map(m => m.replace(/{{|}}/g, "")) : [];
  };

  const handleAddTemplate = () => {
    if (!formData.name || !formData.content || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const variables = extractVariables(formData.content);

    if (editingId) {
      setTemplates(templates.map(t =>
        t.id === editingId
          ? { ...t, ...formData, variables }
          : t
      ));
      toast.success("Template updated successfully");
      setEditingId(null);
    } else {
      const newTemplate: Template = {
        id: Date.now().toString(),
        ...formData,
        variables,
        usageCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setTemplates([...templates, newTemplate]);
      toast.success("Template created successfully");
    }

    setFormData({ name: "", type: "sms", content: "", category: "" });
    setIsOpen(false);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingId(template.id);
    setFormData({
      name: template.name,
      type: template.type,
      content: template.content,
      category: template.category,
    });
    setIsOpen(true);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    toast.success("Template deleted successfully");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Template copied to clipboard");
  };

  const categories = ["Security", "E-commerce", "General", "Notifications", "Alerts"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-300" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Message Templates</h1>
                <p className="text-slate-400 text-sm">Create and manage reusable message templates</p>
              </div>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name: "", type: "sms", content: "", category: "" });
                  }}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Template
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editingId ? "Edit Template" : "Create New Template"}
                  </DialogTitle>
                  <DialogDescription>
                    Use {{VARIABLE}} syntax to add dynamic content
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">Template Name</label>
                      <Input
                        placeholder="e.g., Order Confirmation"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-md text-sm"
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Message Type</label>
                    <div className="flex gap-3">
                      {["sms", "whatsapp"].map(type => (
                        <button
                          key={type}
                          onClick={() => setFormData({ ...formData, type: type as "sms" | "whatsapp" })}
                          className={`flex-1 py-2 px-3 rounded-lg border transition-colors text-sm font-medium ${
                            formData.type === type
                              ? "bg-blue-600 border-blue-500 text-white"
                              : "bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500"
                          }`}
                        >
                          {type.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Message Content</label>
                    <Textarea
                      placeholder="Type your message... Use {{VARIABLE}} for dynamic content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={6}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 resize-none"
                    />
                    <div className="text-xs text-slate-400 mt-2">
                      {formData.content.length} characters
                      {extractVariables(formData.content).length > 0 && (
                        <span> • Variables: {extractVariables(formData.content).join(", ")}</span>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleAddTemplate}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    {editingId ? "Update Template" : "Create Template"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div>
                <p className="text-slate-400 text-sm">Total Templates</p>
                <p className="text-3xl font-bold text-white mt-2">{templates.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div>
                <p className="text-slate-400 text-sm">Total Uses</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {templates.reduce((sum, t) => sum + t.usageCount, 0).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div>
                <p className="text-slate-400 text-sm">Categories</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {new Set(templates.map(t => t.category)).size}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {templates.length === 0 ? (
            <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-slate-300">No templates created yet</p>
                <p className="text-slate-400 text-sm mt-1">Create your first template to get started</p>
              </CardContent>
            </Card>
          ) : (
            templates.map((template) => (
              <Card key={template.id} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {template.type.toUpperCase()}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-300 mb-3 line-clamp-3">{template.content}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>Used {template.usageCount.toLocaleString()} times</span>
                        {template.variables.length > 0 && (
                          <span>{template.variables.length} variables</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(template.content)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTemplate(template)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="border-slate-600 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Variables Preview */}
                  {template.variables.length > 0 && (
                    <div className="mt-4 p-3 bg-slate-700/20 rounded-lg border border-slate-600/50">
                      <p className="text-xs text-slate-400 mb-2">Variables:</p>
                      <div className="flex flex-wrap gap-2">
                        {template.variables.map(v => (
                          <code key={v} className="text-xs bg-slate-600/50 px-2 py-1 rounded text-blue-300">
                            {v}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Templates;
