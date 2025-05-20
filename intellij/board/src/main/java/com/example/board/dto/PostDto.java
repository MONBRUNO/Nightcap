package com.example.board.dto;

public class PostDto {
    private Long id;
    private String category;
    private String content;
    private String authorAlias;
    private Long userId;
    private String title;
    private String profileIcon;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    // getter, setter 도 추가
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getProfileIcon() { return profileIcon; }
    public void setProfileIcon(String profileIcon) { this.profileIcon = profileIcon; }


    // 기본 생성자
    public PostDto() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    // Getter & Setter
    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAuthorAlias() {
        return authorAlias;
    }

    public void setAuthorAlias(String authorAlias) {
        this.authorAlias = authorAlias;
    }

    public static PostDto from(com.example.board.domain.Post post) {
        PostDto dto = new PostDto();
        dto.setCategory(post.getCategory());
        dto.setContent(post.getContent());
        dto.setAuthorAlias(post.getAuthorAlias());
        dto.setUserId(post.getUserId());
        dto.setTitle(post.getTitle());
        dto.setProfileIcon(post.getProfileIcon());
        return dto;
    }

}
