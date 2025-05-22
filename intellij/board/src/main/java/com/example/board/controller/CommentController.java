package com.example.board.controller;

import com.example.board.domain.Comment;
import com.example.board.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts/{postId}/comments")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    // 🔸 댓글 등록
    @PostMapping
    public Comment addComment(@PathVariable Long postId, @RequestBody Comment comment) {
        System.out.println("📥 댓글 등록 시 전달된 값:");
        System.out.println("postId (PathVariable): " + postId);
        System.out.println("BEFORE SET → comment.getPostId(): " + comment.getPostId());

        comment.setPostId(postId);

        System.out.println("AFTER SET → comment.getPostId(): " + comment.getPostId());
        System.out.println("userId: " + comment.getUserId());
        System.out.println("alias: " + comment.getAuthorAlias());
        System.out.println("content: " + comment.getContent());

        return commentRepository.save(comment);
    }

    @GetMapping
    public List<Comment> getCommentsByPostId(@PathVariable Long postId) {
        return commentRepository.findByPostId(postId);
    }
}