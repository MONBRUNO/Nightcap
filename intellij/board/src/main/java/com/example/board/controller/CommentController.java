package com.example.board.controller;

import com.example.board.domain.Comment;
import com.example.board.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    // ✅ 댓글 등록
    @PostMapping("/posts/{postId}/comments")
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

    // ✅ 댓글 조회 (게시글 ID 기준)
    @GetMapping("/posts/{postId}/comments")
    public List<Comment> getCommentsByPostId(@PathVariable Long postId) {
        return commentRepository.findByPostId(postId);
    }

    // ✅ 댓글 수정
    @PatchMapping("/comments/{id}")
    public ResponseEntity<?> updateComment(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<Comment> optionalComment = commentRepository.findById(id);
        if (optionalComment.isEmpty()) return ResponseEntity.notFound().build();

        Comment comment = optionalComment.get();
        comment.setContent(body.get("content"));
        commentRepository.save(comment);

        return ResponseEntity.ok().build();
    }

    // ✅ 댓글 삭제
    @DeleteMapping("/comments/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {
        if (!commentRepository.existsById(id)) return ResponseEntity.notFound().build();
        commentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
