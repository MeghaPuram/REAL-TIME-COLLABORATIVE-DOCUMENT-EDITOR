package com.app.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MessageInfo {
	private int insertedIndex;
    private String insertedChar;
    private String sessionId;
}
