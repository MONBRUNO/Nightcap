package com.example.board.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "user_likes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "post_id"}) // ✅ 실제 DB 컬럼명
})
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id") // ✅ 여기를 추가해야 JPA가 user_id 컬럼에 매핑함
    private Long userId;

    @Column(name = "post_id") // ✅ 여기도 마찬가지
    private Long postId;

    public Like() {}

    public Like(Long userId, Long postId) {
        this.userId = userId;
        this.postId = postId;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }
}
