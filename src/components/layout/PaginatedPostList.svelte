<script lang="ts">
  import { themeConfig } from "@/config";

  interface Post {
    id: string;
    data: {
      title: string;
      publishDate: string | Date;
      [key: string]: any;
    };
    body?: string;
  }

  // 1. Svelte 5 Props
  let { posts = [] }: { posts: Post[] } = $props();

  // Configurable page size
  const POSTS_PER_PAGE = 6;

  // 2. Reactive state for current page
  let currentPage = $state(1);

  // 3. Derived state for sorting, total pages, and pagination
  let sortedPosts = $derived(
    [...posts].sort(
      (a, b) =>
        new Date(b.data.publishDate).getTime() -
        new Date(a.data.publishDate).getTime()
    )
  );

  let totalPages = $derived(Math.ceil(sortedPosts.length / POSTS_PER_PAGE));

  let paginatedPosts = $derived(
    sortedPosts.slice(
      (currentPage - 1) * POSTS_PER_PAGE,
      currentPage * POSTS_PER_PAGE
    )
  );

  // Date formatting helper replacement for FormattedDate component
  function formatDate(dateInput: string | Date): string {
    const d = new Date(dateInput);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }
</script>

<ul>
  {#each paginatedPosts as post (post.id)}
    <li>
      <a href={`/${post.id}/`}>
        <div class={`post-item ${!themeConfig.date.dateOnRight ? "date-left" : ""}`}>
          {#if !themeConfig.date.dateOnRight}
            <p class="date font-features">
              {formatDate(post.data.publishDate)}
            </p>
          {/if}

          <p class="title">{post.data.title}</p>

          {#if themeConfig.date.dateOnRight}
            <div
              class={themeConfig.general.postListDottedDivider
                ? "dotted-divider"
                : "divider"}
            ></div>
          {/if}

          {#if themeConfig.date.dateOnRight}
            <p class="date font-features">
              {formatDate(post.data.publishDate)}
            </p>
          {/if}
        </div>

        {#if post.body}
          <p class="post-description">{post.body.slice(0, 200)}...</p>
        {/if}
      </a>
    </li>
  {/each}
</ul>

<!-- Pagination Controls -->
{#if totalPages > 0}
  <nav class="pagination" aria-label="Pagination">
    {#if currentPage > 1}
      <button
        type="button"
        class="prose btn nav-btn"
        onclick={() => goToPage(currentPage - 1)}
      >
        ← Previous
      </button>
    {:else}
      <span class="prose btn-disabled nav-btn disabled">← Previous</span>
    {/if}

    <span class="page-indicator">
      Page {currentPage} of {totalPages}
    </span>

    {#if currentPage < totalPages}
      <button
        type="button"
        class="prose btn nav-btn"
        onclick={() => goToPage(currentPage + 1)}
      >
        Next →
      </button>
    {:else}
      <span class="prose btn-disabled nav-btn disabled">Next →</span>
    {/if}
  </nav>
{/if}

<div class="placeholder"></div>

<style>
  ul {
    padding: 0;
    margin: 0;
    list-style-type: none;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  a {
    color: var(--text-primary);
    display: block;
    text-decoration: none;
    transition: opacity 0.15s ease-out;
  }

  @media (hover: hover) and (pointer: fine) {
    ul:hover a {
      opacity: 0.4;
    }

    ul:hover a:hover {
      opacity: 1;
    }

    ul:hover a:hover .divider {
      background-color: var(--text-tertiary);
      opacity: 0.75;
    }
    ul:hover a:hover .dotted-divider {
      color: var(--text-secondary);
    }
    ul:hover a:hover .date {
      color: var(--text-secondary);
      opacity: 1;
    }
  }

  .post-item {
    height: 2.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
  }

  .post-item.date-left {
    justify-content: flex-start;
  }

  .post-item.date-left .title {
    flex: 1 1 auto;
    min-width: 0;
  }

  .post-item.date-left .date {
    margin-right: 0.75rem;
  }

  .post-description {
    font-size: 0.8rem;
    color: var(--text-secondary);
    margin: 0.25rem 0 0.75rem 0;
  }

  .title {
    margin: 0;
    flex-shrink: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .date {
    margin: 0;
    color: var(--text-secondary);
    opacity: 0.75;
    letter-spacing: var(--spacing-s);
    flex-shrink: 0;
    white-space: nowrap;
  }

  .divider {
    flex: 1 1 auto;
    min-width: 3rem;
    margin: 0 0.25rem;
    height: 0.5px;
    background-color: var(--border);
  }

  .dotted-divider {
    flex: 1 1 3rem;
    min-width: 3rem;
    max-width: 100%;
    text-align: end;
    letter-spacing: 5px;
    height: 1.675rem;
    overflow: hidden;
    color: var(--text-tertiary);
    opacity: 0.75;
  }

  .dotted-divider::after {
    content: "·····························································································································································";
    pointer-events: none;
  }

  /* Pagination styles */
  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
    font-size: 0.875rem;
  }

  .nav-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--text-primary);
    text-decoration: none;
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    transition: background-color 0.15s ease;
  }

  .nav-btn:hover:not(.disabled) {
    background-color: var(--hover-bg, rgba(255, 255, 255, 0.05));
    opacity: 1;
  }

  .nav-btn.disabled {
    color: var(--text-tertiary);
    opacity: 0.4;
    cursor: not-allowed;
  }

  .page-indicator {
    color: var(--text-secondary);
  }

  .placeholder {
    height: 3rem;
  }
</style>