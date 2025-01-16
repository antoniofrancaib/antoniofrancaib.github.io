---
layout: default
title: Blog
---

<div class="post">
  <header class="post-header">
    <h1 class="post-title">blog</h1>
    <p class="post-description">A collection of my thoughts and writings.</p>
  </header>

  <div class="blog-content">
    <div class="blog-entries">
      <!-- Jekyll loop over all posts -->
      {% for post in site.posts %}
        <article class="blog-entry">
          <h2 class="blog-entry-title">
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
          </h2>
          <p class="blog-entry-meta">{{ post.date | date: "%b %d, %Y" }}</p>
          <p class="blog-entry-summary">
            {{ post.excerpt | strip_html | truncate: 180 }}
          </p>
        </article>
      {% endfor %}
    </div>
  </div>
</div>
