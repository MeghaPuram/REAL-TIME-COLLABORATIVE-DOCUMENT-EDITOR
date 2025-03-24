package com.app.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.app.model.UserInfo;

public interface UserRepository extends MongoRepository<UserInfo, String> {
	boolean existsByUsername(String username);
    UserInfo findByUsername(String username);
}
