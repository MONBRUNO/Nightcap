package com.example.board.controller;

import com.example.board.domain.Post;
import com.example.board.repository.PostRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = "*")
public class PostController {

    private final PostRepository postRepository;

    public PostController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    // 게시글 전체 조회
    @GetMapping
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // 게시글 등록
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        System.out.println("✅ createPost 요청 도착");
        System.out.println("내용: " + post.getContent());
        System.out.println("작성자: " + post.getAuthor());
        System.out.println("작성자 ID: " + post.getAuthorId());
        System.out.println("아이콘: " + post.getProfileIcon());

        try {
            Post saved = postRepository.save(post);
            System.out.println("✅ 저장 성공: ID = " + saved.getId());
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();  // 콘솔에 전체 오류 출력
            return ResponseEntity.internalServerError().build();
        }
    }




    // 특정 게시글 조회
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        return postRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 게시글 수정
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody Post updated) {
        return postRepository.findById(id).map(post -> {
            post.setCategory(updated.getCategory());
            post.setContent(updated.getContent());
            post.setTitle(updated.getTitle());
            return ResponseEntity.ok(postRepository.save(post));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 게시글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        if (!postRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        postRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
