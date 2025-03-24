package com.app.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.app.model.SharedInfo;

public interface SharedRepository extends MongoRepository<SharedInfo, String> {
	 List<SharedInfo> findByUsername(String username);
	    List<SharedInfo> findByDocumentId(String documentId);
}
