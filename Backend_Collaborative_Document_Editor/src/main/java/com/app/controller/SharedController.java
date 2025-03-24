package com.app.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.model.DocumentInfo;
import com.app.model.SharedInfo;
import com.app.service.DocumentService;
import com.app.service.SharedService;

@RestController
@RequestMapping("/api/shared")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
public class SharedController {
	 @Autowired
	    private SharedService sharedService;

	    @Autowired
	    private DocumentService documentService;

	    @GetMapping("/enabled/{username}")
	    public ResponseEntity<List<DocumentInfo>> getEnabledSharedByUsername(@PathVariable String username) {
	        List<SharedInfo> shared = sharedService.getSharedByUsername(username);

	        List<DocumentInfo> documents = new ArrayList<>();

	        for (SharedInfo sharedInfo : shared) {
	            if (sharedInfo.isCanEdit()) {
	            	String documentId = sharedInfo.getDocumentId();

	                Optional<DocumentInfo> documentInfo = documentService.getDocumentById(documentId);

	                documentInfo.ifPresent(documents::add);
	            }
	        }

	        return new ResponseEntity<>(documents, HttpStatus.OK);
	    }

	    @GetMapping("/disabled/{username}")
	    public ResponseEntity<List<DocumentInfo>> getDisabledSharedByUsername(@PathVariable String username) {
	        List<SharedInfo> shared = sharedService.getSharedByUsername(username);

	        List<DocumentInfo> documents = new ArrayList<>();

	        for (SharedInfo sharedInfo : shared) {
	            if (!sharedInfo.isCanEdit()) {
	            	String documentId = sharedInfo.getDocumentId();

	                Optional<DocumentInfo> documentInfo = documentService.getDocumentById(documentId);

	                documentInfo.ifPresent(documents::add);
	            }
	        }

	        return new ResponseEntity<>(documents, HttpStatus.OK);
	    }

	    @PostMapping
	    public ResponseEntity<SharedInfo> shareDocument(@RequestBody SharedInfo sharedInfo) {
	        try {
	            SharedInfo savedSharedInfo = sharedService.save(sharedInfo);
	            return ResponseEntity.ok(savedSharedInfo);
	        } catch (Exception e) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	        }
	    }

	    @GetMapping("/sent-to/{documentId}")
	    public ResponseEntity<List<SharedInfo>> getSharedByDocumentId(@PathVariable String documentId) {
	        List<SharedInfo> sharedInfoList = sharedService.getSharedByDocumentId(documentId);
	        return new ResponseEntity<>(sharedInfoList, HttpStatus.OK);
	    }

	    @PutMapping("/permissions/{id}")
	    public ResponseEntity<SharedInfo> updateSharedDocument(@PathVariable String id, @RequestBody SharedInfo updatedSharedInfo) {
	        Optional<SharedInfo> existingSharedInfoOptional = sharedService.getSharedDocumentById(id);

	        if (existingSharedInfoOptional.isEmpty()) {
	            return ResponseEntity.notFound().build();
	        }

	        SharedInfo existingSharedInfo = existingSharedInfoOptional.get();

	        existingSharedInfo.setCanEdit(updatedSharedInfo.isCanEdit());

	        SharedInfo savedSharedInfo = sharedService.saveSharedDocument(existingSharedInfo);

	        return ResponseEntity.ok(savedSharedInfo);
	    }
}
