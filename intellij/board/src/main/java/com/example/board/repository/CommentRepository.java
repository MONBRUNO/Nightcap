package com.example.board.repository;

import com.example.board.domain.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    // 특정 게시글(postId)에 달린 댓글 전체 조회
    List<Comment> findByPostId(Long postId);
    List<Comment> findByUserId(Long userId);

}
