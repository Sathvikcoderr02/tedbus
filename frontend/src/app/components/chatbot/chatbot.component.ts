import { Component, OnInit } from '@angular/core';
import { ChatbotService } from '../../services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {
  messages: { role: string; content: string }[] = [];
  newMessage: string = '';
  isChatbotOpen: boolean = false;

  constructor(private chatbotService: ChatbotService) {
    // Add initial welcome message
    this.messages.push({
      role: 'assistant',
      content: 'Hi there! I\'m your bus booking assistant. How can I help you today?'
    });
  }

  ngOnInit(): void {
    // Add initial welcome message
    this.messages.push({
      role: 'assistant',
      content: 'Hi there! I\'m your bus booking assistant. How can I help you today?'
    });
  }

  async sendMessage(): Promise<void> {
    const userMessage = this.newMessage.trim();
    if (!userMessage) return;

    // Add user message to chat history
    this.messages.push({
      role: 'user',
      content: userMessage
    });

    // Clear input
    this.newMessage = '';

    try {
      // Get response from chatbot
      const response = await this.chatbotService.sendMessage(userMessage);
      this.messages.push({
        role: 'assistant',
        content: response
      });
    } catch (error) {
      console.error('Error in chatbot:', error);
      this.messages.push({
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.'
      });
    }
  }

  toggleChatbot(): void {
    this.isChatbotOpen = !this.isChatbotOpen;
    // Scroll to bottom when new message is added
    setTimeout(() => {
      const chatMessages = document.querySelector('.chat-messages');
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }, 100);
  }

  isUserMessage(message: { role: string; content: string }): boolean {
    return message.role === 'user';
  }
}
