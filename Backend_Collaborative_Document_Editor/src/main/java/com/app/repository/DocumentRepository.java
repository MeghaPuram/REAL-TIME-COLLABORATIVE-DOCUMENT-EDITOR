package com.app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.app.model.DocumentInfo;

public interface DocumentRepository extends MongoRepository<DocumentInfo,String>{
	List<DocumentInfo> findByAuthor(String author);
    Optional<DocumentInfo> findById(String id);
}
