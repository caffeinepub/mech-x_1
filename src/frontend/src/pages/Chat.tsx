import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useChat } from '../hooks/useChat';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import MechanicRecommendations from '../components/MechanicRecommendations';
import HeroSection from '../components/HeroSection';
import SkeletonLoader from '../components/SkeletonLoader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, MessageSquare } from 'lucide-react';

export default function ChatPage() {
  const { identity } = useInternetIdentity();
  const { messages, sendMessage, isProcessing } = useChat();
  const [showMechanics, setShowMechanics] = useState(false);
  const [isLoadingMessages] = useState(false); // Would be true when fetching chat history

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <HeroSection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Section */}
          <div className="lg:col-span-2">
            <Card className="flex flex-col h-[calc(100vh-12rem)] border-2 shadow-card-lg">
              <div className="flex items-center justify-between p-5 border-b bg-card">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shadow-sm">
                    <MessageSquare className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold leading-tight">MECH X Assistant</h2>
                    <p className="text-sm text-muted-foreground">AI-Powered Automotive Support</p>
                  </div>
                </div>
                <Button
                  variant={showMechanics ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowMechanics(!showMechanics)}
                  className="lg:hidden smooth-transition"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {showMechanics ? 'Hide' : 'Find'} Mechanics
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {isLoadingMessages ? (
                  <SkeletonLoader variant="list" count={3} />
                ) : (
                  <>
                    {messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    {isProcessing && (
                      <div className="flex items-center gap-3 text-muted-foreground animate-fade-in">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-sm">MECH X is analyzing...</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="p-5 border-t bg-card">
                <ChatInput onSend={sendMessage} disabled={isProcessing} />
              </div>
            </Card>
          </div>

          {/* Mechanic Recommendations Section */}
          <div className={`lg:block ${showMechanics ? 'block' : 'hidden'}`}>
            <MechanicRecommendations />
          </div>
        </div>
      </div>
    </div>
  );
}
