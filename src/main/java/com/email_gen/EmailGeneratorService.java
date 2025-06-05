package com.email_gen;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class EmailGeneratorService {
    @Value("${gemini.api.url}")
    private String geminiApiUrl;
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public String generateEmailReply(EmailRequest emailRequest) {
        // build the prompt - go to gemini api
        String prompt = buildPrompt(emailRequest);
        // craft a request
        Map<String, Object> requestBody = Map.of("contents", new Object[] {
                Map.of("parts", new Object[]{
                        Map.of("text", prompt)
                })
        });
        // Do request and get response


        // Return response
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a email reply for the following email content. No subject line");
        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            prompt.append("in this tone: ").append(emailRequest.getTone());
        }
        prompt.append("\nOriginal email: \n").append(emailRequest.getEmailContent());
        return prompt.toString();
    }
}
