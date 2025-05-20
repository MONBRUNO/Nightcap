package com.example.board.controller;

import com.example.board.domain.Post;
import com.example.board.repository.PostRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.board.dto.PostDto;
import java.time.LocalDateTime;

import java.util.List;

@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
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
    @PostMapping("")
    public ResponseEntity<String> createPost(@RequestBody PostDto postDto) {
        Post post = new Post();
        post.setCategory(postDto.getCategory());
        post.setContent(postDto.getContent());
        post.setAuthorAlias(postDto.getAuthorAlias());
        post.setCreatedAt(LocalDateTime.now());
        post.setUserId(postDto.getUserId());
        post.setTitle(postDto.getTitle());
        post.setProfileIcon(postDto.getProfileIcon());


        postRepository.save(post);
        return ResponseEntity.ok("게시글이 등록되었습니다.");
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
