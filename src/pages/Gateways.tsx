import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, MessageSquare, Plus, Edit2, Trash2, Eye, EyeOff, Copy, TestTube, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Gateway {
  id: string;
  name: string;
  type: "sms" | "whatsapp";
  provider: string;
  apiKey: string;
  apiSecret?: string;
  status: "active" | "inactive" | "error";
  messagesCount: number;
  successRate: number;
  createdAt: string;
  lastUsed?: string;
}

const Gateways = () => {
  const navigate = useNavigate();
  const [gateways, setGateways] = useState<Gateway[]>([
    {
      id: "1",
      name: "Twilio SMS",
      type: "sms",
      provider: "twilio",
      apiKey: "sk_test_****",
      status: "active",
      messagesCount: 1250,
      successRate: 99.2,
      createdAt: "2024-01-15",
      lastUsed: "2 mins ago",
    },
    {
      id: "2",
      name: "WhatsApp Business",
      type: "whatsapp",
      provider: "whatsapp-cloud",
      apiKey: "wa_test_****",
      status: "active",
      messagesCount: 892,
      successRate: 98.5,
      createdAt: "2024-02-10",
      lastUsed: "5 mins ago",
    },
    {
      id: "3",
      name: "AWS SNS",
      type: "sms",
      provider: "aws-sns",
      apiKey: "aws_test_****",
      status: "inactive",
      messagesCount: 450,
      successRate: 97.8,
      createdAt: "2024-03-01",
    },
  ]);

  const [showApiKeys, setShowApiKeys] = useState<{ [key: string]: boolean }>({});
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "sms" as "sms" | "whatsapp",
    provider: "twilio",
    apiKey: "",
    apiSecret: "",
  });

  const handleAddGateway = () => {
    if (!formData.name || !formData.apiKey) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingId) {
      setGateways(gateways.map(g =>
        g.id === editingId
          ? { ...g, ...formData }
          : g
      ));
      toast.success("Gateway updated successfully");
      setEditingId(null);
    } else {
      const newGateway: Gateway = {
        id: Date.now().toString(),
        ...formData,
        status: "active",
        messagesCount: 0,
        successRate: 100,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setGateways([...gateways, newGateway]);
      toast.success("Gateway added successfully");
    }

    setFormData({ name: "", type: "sms", provider: "twilio", apiKey: "", apiSecret: "" });
    setIsOpen(false);
  };

  const handleEditGateway = (gateway: Gateway) => {
    setEditingId(gateway.id);
    setFormData({
      name: gateway.name,
      type: gateway.type,
      provider: gateway.provider,
      apiKey: gateway.apiKey,
      apiSecret: gateway.apiSecret || "",
    });
    setIsOpen(true);
  };

  const handleDeleteGateway = (id: string) => {
    setGateways(gateways.filter(g => g.id !== id));
    toast.success("Gateway deleted successfully");
  };

  const toggleApiKeyVisibility = (id: string) => {
    setShowApiKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const testGateway = (name: string) => {
    toast.loading("Testing gateway...");
    setTimeout(() => {
      toast.success(`${name} is working perfectly! ✓`);
    }, 1500);
  };

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
                <h1 className="text-2xl font-bold text-white">Gateway Management</h1>
                <p className="text-slate-400 text-sm">Configure and manage your messaging providers</p>
              </div>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name: "", type: "sms", provider: "twilio", apiKey: "", apiSecret: "" });
                  }}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Gateway
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editingId ? "Edit Gateway" : "Add New Gateway"}
                  </DialogTitle>
                  <DialogDescription>
                    Configure your messaging provider credentials
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Gateway Name</label>
                    <Input
                      placeholder="e.g., Twilio SMS Production"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">Type</label>
                      <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as "sms" | "whatsapp" })}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">Provider</label>
                      <Select value={formData.provider} onValueChange={(v) => setFormData({ ...formData, provider: v })}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          {formData.type === "sms" ? (
                            <>
                              <SelectItem value="twilio">Twilio</SelectItem>
                              <SelectItem value="aws-sns">AWS SNS</SelectItem>
                              <SelectItem value="vonage">Vonage</SelectItem>
                              <SelectItem value="nexmo">Nexmo</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="whatsapp-cloud">WhatsApp Cloud API</SelectItem>
                              <SelectItem value="twilio-whatsapp">Twilio WhatsApp</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">API Key</label>
                    <Input
                      placeholder="Enter your API key"
                      type="password"
                      value={formData.apiKey}
                      onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">API Secret (Optional)</label>
                    <Input
                      placeholder="Enter your API secret if required"
                      type="password"
                      value={formData.apiSecret}
                      onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <Button
                    onClick={handleAddGateway}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    {editingId ? "Update Gateway" : "Add Gateway"}
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
                <p className="text-slate-400 text-sm">Total Gateways</p>
                <p className="text-3xl font-bold text-white mt-2">{gateways.length}</p>
                <p className="text-xs text-green-400 mt-2">
                  {gateways.filter(g => g.status === "active").length} active
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div>
                <p className="text-slate-400 text-sm">Total Messages Sent</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {gateways.reduce((sum, g) => sum + g.messagesCount, 0).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div>
                <p className="text-slate-400 text-sm">Avg Success Rate</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {(gateways.reduce((sum, g) => sum + g.successRate, 0) / gateways.length).toFixed(1)}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gateways Grid */}
        <div className="space-y-4">
          {gateways.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-12 pb-12 text-center">
                <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-300">No gateways configured yet</p>
                <p className="text-slate-400 text-sm mt-1">Add your first messaging provider to get started</p>
              </CardContent>
            </Card>
          ) : (
            gateways.map((gateway) => (
              <Card key={gateway.id} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-slate-700/50 rounded-lg">
                        {gateway.type === "sms" ? (
                          <MessageCircle className="w-6 h-6 text-blue-400" />
                        ) : (
                          <MessageSquare className="w-6 h-6 text-green-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-white">{gateway.name}</h3>
                          <Badge variant={gateway.status === "active" ? "default" : gateway.status === "inactive" ? "secondary" : "destructive"}>
                            {gateway.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400 mb-2">
                          {gateway.type.toUpperCase()} • {gateway.provider}
                        </p>
                        <div className="flex items-center gap-6 text-sm">
                          <span className="text-slate-400">
                            <span className="text-white font-semibold">{gateway.messagesCount.toLocaleString()}</span> messages
                          </span>
                          <span className="text-slate-400">
                            Success rate: <span className="text-white font-semibold">{gateway.successRate}%</span>
                          </span>
                          {gateway.lastUsed && (
                            <span className="text-slate-400">
                              Last used: <span className="text-white font-semibold">{gateway.lastUsed}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testGateway(gateway.name)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                      >
                        <TestTube className="w-4 h-4 mr-1" />
                        Test
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditGateway(gateway)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteGateway(gateway.id)}
                        className="border-slate-600 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* API Key Section */}
                  <div className="mt-4 p-3 bg-slate-700/20 rounded-lg border border-slate-600/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xs text-slate-400">API Key:</span>
                        <code className="text-xs bg-slate-600/50 px-2 py-1 rounded text-slate-300 flex-1 truncate">
                          {showApiKeys[gateway.id] ? gateway.apiKey : "••••••••••••••••"}
                        </code>
                      </div>
                      <button
                        onClick={() => toggleApiKeyVisibility(gateway.id)}
                        className="p-1 hover:bg-slate-600/50 rounded transition-colors ml-2"
                      >
                        {showApiKeys[gateway.id] ? (
                          <EyeOff className="w-4 h-4 text-slate-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(gateway.apiKey)}
                        className="p-1 hover:bg-slate-600/50 rounded transition-colors"
                      >
                        <Copy className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Gateways;
