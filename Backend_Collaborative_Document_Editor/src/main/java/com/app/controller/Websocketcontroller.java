package com.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.app.model.MessageInfo;

@Controller
public class Websocketcontroller {
	 @Autowired
	    private SimpMessagingTemplate messagingTemplate;


	    private final Object mutex = new Object();
	    private int lock = 0;

	    @MessageMapping("/operation/{documentId}")
	    public void passMessage(final MessageInfo message, @DestinationVariable String documentId) {
	        synchronized(mutex) {
	            if (lock == 0) {
	                lock = 1;
	            } else {
	                return;
	            }
	        }
	        messagingTemplate.convertAndSend("/all/broadcast/" + documentId, message);
	        synchronized(mutex) {
	            lock = 0;
	        }

	    }
}
