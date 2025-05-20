package com.example.board.dto;

public class PostDto {
    private String category;
    private String content;
    private String authorAlias;
    private Long userId;
    private String title;
    private String profileIcon;

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
}
