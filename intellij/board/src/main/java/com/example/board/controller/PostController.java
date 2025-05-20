package com.example.board.controller;

import com.example.board.domain.Post;
import com.example.board.repository.PostRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.board.dto.PostDto;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PostController {

    private final PostRepository postRepository;

    public PostController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @GetMapping("")
    public List<PostDto> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        return posts.stream()
                .map(post -> {
                    PostDto dto = new PostDto();
                    dto.setId(post.getId());
                    dto.setCategory(post.getCategory());
                    dto.setContent(post.getContent());
                    dto.setAuthorAlias(post.getAuthorAlias());
                    dto.setUserId(post.getUserId());
                    dto.setTitle(post.getTitle());
                    dto.setProfileIcon(post.getProfileIcon());
                    return dto;
                })
                .collect(Collectors.toList());
    }


    // 게시글 등록
    @PostMapping("")
    public ResponseEntity<Post> createPost(@RequestBody PostDto postDto) {
        Post post = new Post();
        post.setCategory(postDto.getCategory());
        post.setContent(postDto.getContent());
        post.setAuthorAlias(postDto.getAuthorAlias());
        post.setCreatedAt(LocalDateTime.now());
        post.setUserId(postDto.getUserId());
        post.setTitle(postDto.getTitle());
        post.setProfileIcon(postDto.getProfileIcon());
        post.setLikes(0); // 공감 수 초기값

        Post savedPost = postRepository.save(post);
        return ResponseEntity.ok(savedPost); // 등록된 글 데이터를 프론트로 전송
    }

    @PutMapping("/posts/{postId}/like")
    public ResponseEntity<Void> likePost(@PathVariable Long postId) {
        Optional<Post> postOpt = postRepository.findById(postId);
        if (postOpt.isPresent()) {
            Post post = postOpt.get();
            post.setLikes(post.getLikes() + 1);
            postRepository.save(post);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
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
