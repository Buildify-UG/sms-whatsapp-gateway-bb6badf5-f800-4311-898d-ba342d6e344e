import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, MessageSquare, Send, BarChart3, Settings, Plus, Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  type: "sms" | "whatsapp";
  recipient: string;
  content: string;
  status: "sent" | "pending" | "failed";
  timestamp: string;
  deliveryTime?: string;
}

interface Gateway {
  id: string;
  name: string;
  type: "sms" | "whatsapp";
  apiKey: string;
  status: "active" | "inactive";
  messagesCount: number;
}

const Index = () => {
  const [gateways, setGateways] = useState<Gateway[]>([
    { id: "1", name: "Twilio SMS", type: "sms", apiKey: "sk_test_****", status: "active", messagesCount: 1250 },
    { id: "2", name: "WhatsApp Business", type: "whatsapp", apiKey: "wa_test_****", status: "active", messagesCount: 892 },
  ]);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", type: "sms", recipient: "+966501234567", content: "Hello! This is a test message.", status: "sent", timestamp: "2 mins ago", deliveryTime: "1.2s" },
    { id: "2", type: "whatsapp", recipient: "+966509876543", content: "Your verification code is: 123456", status: "sent", timestamp: "5 mins ago", deliveryTime: "0.8s" },
    { id: "3", type: "sms", recipient: "+966505555555", content: "Order confirmation #12345", status: "pending", timestamp: "Just now" },
  ]);

  const [recipientPhone, setRecipientPhone] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [messageType, setMessageType] = useState<"sms" | "whatsapp">("sms");
  const [showApiKeys, setShowApiKeys] = useState<{ [key: string]: boolean }>({});

  const handleSendMessage = () => {
    if (!recipientPhone || !messageContent) {
      toast.error("Please fill in all fields");
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      type: messageType,
      recipient: recipientPhone,
      content: messageContent,
      status: "pending",
      timestamp: "Just now",
    };

    setMessages([newMessage, ...messages]);
    setRecipientPhone("");
    setMessageContent("");
    toast.success(`${messageType.toUpperCase()} message queued for delivery`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const toggleApiKeyVisibility = (id: string) => {
    setShowApiKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Gateway Hub</h1>
                <p className="text-slate-400 text-sm">SMS & WhatsApp Messaging Platform</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
              <Plus className="w-4 h-4 mr-2" />
              New Gateway
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Messages</p>
                  <p className="text-2xl font-bold text-white mt-1">2,142</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Delivery Rate</p>
                  <p className="text-2xl font-bold text-white mt-1">98.5%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Gateways</p>
                  <p className="text-2xl font-bold text-white mt-1">{gateways.filter(g => g.status === "active").length}</p>
                </div>
                <Settings className="w-8 h-8 text-purple-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Avg. Response</p>
                  <p className="text-2xl font-bold text-white mt-1">1.2s</p>
                </div>
                <Send className="w-8 h-8 text-orange-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Send Message */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Send Message</CardTitle>
                <CardDescription>Send SMS or WhatsApp messages instantly</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={messageType} onValueChange={(v) => setMessageType(v as "sms" | "whatsapp")}>
                  <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
                    <TabsTrigger value="sms" className="data-[state=active]:bg-blue-600">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      SMS
                    </TabsTrigger>
                    <TabsTrigger value="whatsapp" className="data-[state=active]:bg-green-600">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      WhatsApp
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value={messageType} className="space-y-4 mt-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">Recipient Phone</label>
                      <Input
                        placeholder="+966501234567"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">Message</label>
                      <Textarea
                        placeholder="Type your message here..."
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        rows={5}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 resize-none"
                      />
                      <div className="text-xs text-slate-400 mt-2">{messageContent.length} characters</div>
                    </div>

                    <Button
                      onClick={handleSendMessage}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send {messageType.toUpperCase()}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Gateways */}
          <div>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Active Gateways</CardTitle>
                <CardDescription>Connected messaging services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {gateways.map((gateway) => (
                  <div key={gateway.id} className="p-3 bg-slate-700/30 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {gateway.type === "sms" ? (
                          <MessageCircle className="w-4 h-4 text-blue-400" />
                        ) : (
                          <MessageSquare className="w-4 h-4 text-green-400" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-white">{gateway.name}</p>
                          <p className="text-xs text-slate-400">{gateway.messagesCount} messages</p>
                        </div>
                      </div>
                      <Badge variant={gateway.status === "active" ? "default" : "secondary"} className="text-xs">
                        {gateway.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-slate-600/50 px-2 py-1 rounded text-slate-300 flex-1 truncate">
                        {showApiKeys[gateway.id] ? gateway.apiKey : "sk_test_****"}
                      </code>
                      <button
                        onClick={() => toggleApiKeyVisibility(gateway.id)}
                        className="p-1 hover:bg-slate-600/50 rounded transition-colors"
                      >
                        {showApiKeys[gateway.id] ? (
                          <EyeOff className="w-3 h-3 text-slate-400" />
                        ) : (
                          <Eye className="w-3 h-3 text-slate-400" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(gateway.apiKey)}
                        className="p-1 hover:bg-slate-600/50 rounded transition-colors"
                      >
                        <Copy className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Messages */}
        <Card className="bg-slate-800/50 border-slate-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white">Recent Messages</CardTitle>
            <CardDescription>Latest sent and pending messages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="flex items-start justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {msg.type === "sms" ? (
                        <MessageCircle className="w-4 h-4 text-blue-400" />
                      ) : (
                        <MessageSquare className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{msg.recipient}</p>
                      <p className="text-sm text-slate-300 mt-1 line-clamp-2">{msg.content}</p>
                      <p className="text-xs text-slate-400 mt-1">{msg.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge
                      variant={
                        msg.status === "sent" ? "default" : msg.status === "pending" ? "secondary" : "destructive"
                      }
                      className="text-xs whitespace-nowrap"
                    >
                      {msg.status}
                    </Badge>
                    {msg.deliveryTime && <span className="text-xs text-slate-400">{msg.deliveryTime}</span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-blue-700/50 mt-6">
          <CardHeader>
            <CardTitle className="text-white">What's next?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>✓ Connect multiple SMS providers (Twilio, AWS SNS, etc.)</li>
              <li>✓ Add WhatsApp template management & media support</li>
              <li>✓ Build message scheduling & bulk send features</li>
              <li>✓ Create detailed analytics & delivery reports</li>
              <li>✓ Implement webhook callbacks for delivery status</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
