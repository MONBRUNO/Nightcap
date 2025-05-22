package com.example.board.controller;

import com.example.board.domain.Post;
import com.example.board.domain.Comment;
import com.example.board.domain.Like;
import com.example.board.repository.PostRepository;
import com.example.board.repository.CommentRepository;
import com.example.board.repository.LikeRepository;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;

    @Autowired
    public UserController(PostRepository postRepository,
                          CommentRepository commentRepository,
                          LikeRepository likeRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.likeRepository = likeRepository;
    }

    // ✅ 1. 내가 쓴 글
    @GetMapping("/{userId}/posts")
    public List<Post> getMyPosts(@PathVariable Long userId) {
        return postRepository.findByUserId(userId);
    }

    // ✅ 2. 내가 댓글 단 글
    @GetMapping("/{userId}/commented-posts")
    public List<Post> getCommentedPosts(@PathVariable Long userId) {
        List<Comment> comments = commentRepository.findByUserId(userId);
        Set<Long> postIds = comments.stream()
                .map(Comment::getPostId) // postId 필드 그대로 사용
                .collect(Collectors.toSet());
        return postRepository.findAllById(postIds);
    }

    // ✅ 3. 내가 공감한 글
    @GetMapping("/{userId}/liked-posts")
    public List<Post> getLikedPosts(@PathVariable Long userId) {
        List<Like> likes = likeRepository.findByUserId(userId);
        Set<Long> postIds = likes.stream()
                .map(Like::getPostId) // postId 필드 그대로 사용
                .collect(Collectors.toSet());
        return postRepository.findAllById(postIds);
    }
}
