package com.example.board.repository;

import com.example.board.domain.Like;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<Like, Long> {

    // userId와 postId 조합으로 공감 여부 확인
    boolean existsByUserIdAndPostId(Long userId, Long postId);

    // userId와 postId 조합으로 공감 삭제
    void deleteByUserIdAndPostId(Long userId, Long postId);
}
