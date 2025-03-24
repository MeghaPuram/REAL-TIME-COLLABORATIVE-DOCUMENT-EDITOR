package com.app.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.model.DocumentInfo;
import com.app.repository.DocumentRepository;

@Service
public class DocumentService {
	 @Autowired
	    private DocumentRepository documentRepository;

	    public DocumentInfo save(DocumentInfo documentInfo) {
	        return documentRepository.save(documentInfo);
	    }

	    public List<DocumentInfo> getDocumentsByAuthor(String author) {
	        return documentRepository.findByAuthor(author);
	    }

	    public Optional<DocumentInfo> getDocumentById(String id) { return documentRepository.findById(id); }

	    public void deleteDocument(String id) {
	        documentRepository.deleteById(id);
	    }

	    public Optional<DocumentInfo> findById(String id) {
	        return documentRepository.findById(id);
	    }
}
