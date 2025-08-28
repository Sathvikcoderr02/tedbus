import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { Bus } from '../model/bus.model';
import { BusService } from '../service/bus.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  // Using OpenRouter API
  private aiApiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private openRouterApiKey = environment.openRouterApiKey;
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private busService: BusService
  ) {
    this.apiUrl = 'http://localhost:5000';
  }

  private async getAIResponse(message: string): Promise<string> {
    try {
      console.log('[Chatbot] Preparing to send message to OpenAI API');
      
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.openRouterApiKey}`,
        'HTTP-Referer': 'http://localhost:4200',
        'X-Title': 'Bus Booking Assistant'
      });

      const requestData = {
        model: 'gryphe/mythomax-l2-13b',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful bus booking assistant. Keep responses concise and focused on bus bookings, routes, and travel assistance.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      };

      console.log('[Chatbot] Sending request to OpenAI API:', {
        url: this.aiApiUrl,
        data: requestData
      });

      try {
        const response = await this.http.post<any>(
          this.aiApiUrl,
          requestData,
          { 
            headers,
            observe: 'response'
          }
        ).toPromise();

        console.log('[Chatbot] Received response from OpenAI API:', response);

        if (!response) {
          throw new Error('No response received from the API');
        }

        // Handle successful response
        if (response.status === 200 && response.body) {
          const responseData = response.body;
          
          if (responseData.error) {
            console.error('[Chatbot] Error in API response:', responseData.error);
            return responseData.error.message || 'I received an error from the AI service. Please try again.';
          }

          const responseText = responseData.choices?.[0]?.message?.content?.trim();
          
          if (!responseText) {
            console.error('[Chatbot] Empty or invalid response from API:', responseData);
            return 'I received an empty response from the AI service. Please try again.';
          }
          
          return responseText;
        } else {
          throw new Error(`Unexpected status code: ${response.status}`);
        }
      } catch (error: any) {
        console.error('[Chatbot] Error with OpenAI API:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          url: error.url,
          message: error.message
        });
        
        // Check for specific error cases
        if (error.status === 404) {
          return 'The AI service endpoint was not found (404). Please check the API URL and try again.';
        } else if (error.status === 401) {
          return 'Authentication failed. Please check your API key.';
        } else if (error.error?.error?.message) {
          return `AI service error: ${error.error.error.message}`;
        } else if (error.message) {
          return `Error: ${error.message}`;
        }
        
        return 'I\'m having trouble connecting to the AI service. Please try again later.';
      }
      
    } catch (error) {
      console.error('Error in getAIResponse:', error);
      return 'I encountered an error while processing your request. Please try again.';
    }
  }

  private extractRouteDetails(message: string): [string, string, string] {
    const routeRegex = /route\s+from\s+(\w+)\s+to\s+(\w+)\s+on\s+(\d{2}-\d{2}-\d{4})/i;
    const match = message.match(routeRegex);
    if (!match) return ['', '', ''];
    return [match[1], match[2], match[3]];
  }

  private formatRouteResponse(buses: Bus[]): string {
    if (!buses || buses.length === 0) return '';
    
    let response = `Here are the available buses from ${buses[0].routes} on ${buses[0].departureTime}:\n\n`;
    buses.forEach((bus, index) => {
      response += `${index + 1}. ${bus.operatorName}\n`;
      response += `   - Bus Type: ${bus.busType}\n`;
      response += `   - Departure Time: ${bus.departureTime}\n`;
      response += `   - Rating: ${bus.rating.length ? (bus.rating.reduce((a, b) => a + b) / bus.rating.length).toFixed(1) : 'N/A'}\n`;
      response += `   - Total Seats: ${bus.totalSeats || 'N/A'}\n\n`;
    });
    return response;
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const lowerMessage = message.toLowerCase().trim();
      
      // Check if it's a route query that needs backend data
      if (lowerMessage.includes('route') || 
          (lowerMessage.includes('bus') && (lowerMessage.includes('from') || lowerMessage.includes('to')))) {
        try {
          return await this.handleRouteQuery(message);
        } catch (error) {
          console.error('Route query failed, falling back to AI:', error);
          // If route query fails, still try to get a response from the AI
          return this.getAIResponse(`I couldn't process your bus route request. ${message}`);
        }
      }

      // For all other messages, use the AI API
      return this.getAIResponse(message);
    } catch (error) {
      console.error('Error in sendMessage:', error);
      return 'I encountered an error while processing your request. Please try again or contact support if the problem persists.';
    }
  }

  private async handleRouteQuery(message: string): Promise<string> {
    try {
      // Extract source, destination, and date from message
      const [source, destination, date] = this.extractRouteDetails(message);
      
      // Get bus data if we have all required parameters
      let busData: Bus[] = [];
      if (source && destination && date) {
        try {
          const response = await this.busService.GETBUSDETAILS(source, destination, date).toPromise();
          busData = response || [];
        } catch (error) {
          console.error('Error fetching bus data:', error);
          // Continue with empty bus data
        }
      }

      // Create a detailed context for the AI
      let context = `User is asking about bus routes. `;
      
      if (busData?.length) {
        context += `I found ${busData.length} buses from ${source} to ${destination} on ${date}. `;
        context += `The first bus is operated by ${busData[0].operatorName} (${busData[0].busType}). `;
        context += `Please provide a helpful response about these bus options.`;
      } else if (source && destination && date) {
        context += `No bus data was found for ${source} to ${destination} on ${date}. `;
        context += `Please suggest alternative dates or routes in a helpful way.`;
      } else {
        context += `The user didn't provide complete route information. `;
        context += `Politely ask for the source, destination, and date in the format: 'from [source] to [destination] on [date]'`;
      }

      // Get AI response with the context
      return this.getAIResponse(context);
    } catch (error) {
      console.error('Error in handleRouteQuery:', error);
      // Fall back to a simple AI response if something goes wrong
      return this.getAIResponse('I encountered an error while processing your bus route request. Could you please rephrase your question?');
    }
  }

  private async handleBookingQuery(message: string): Promise<string> {
    const query = 'To book a ticket, please:\n1. Select your source and destination\n2. Choose your travel date\n3. Select your preferred bus\n4. Choose your seats\n5. Enter passenger details\n6. Complete payment\n\nNeed help with any specific step?';
    return this.getAIResponse(query);
  }

  private async handleCancellationQuery(): Promise<string> {
    const query = 'To cancel a ticket:\n1. Log in to your account\n2. Go to My Trips\n3. Select the ticket you want to cancel\n4. Click on Cancel Ticket\n5. Follow the cancellation process\n\nNote: Cancellation charges may apply based on the time before departure.';
    return this.getAIResponse(query);
  }

  private async handlePaymentQuery(): Promise<string> {
    const query = 'You can pay using:\n1. Credit/Debit Card\n2. Net Banking\n3. UPI\n4. Wallets\n5. Cash on Board\n\nNeed help with a specific payment method?';
    return this.getAIResponse(query);
  }

  private async getHelpResponse(): Promise<string> {
    const query = 'Hi! I can help you with bus bookings. Here are some things you can ask about:\n\n• Booking a ticket\n• Checking routes and schedules\n• Cancellation policy\n• Payment methods\n• Seat selection\n• Bus types and facilities\n\nWhat would you like to know?';
    return this.getAIResponse(query);
  }
}
