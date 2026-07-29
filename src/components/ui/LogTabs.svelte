<script lang="ts">
  type Filter = "all" | "reading" | "work";
  import PaginatedPostList from "../layout/PaginatedPostList.svelte";
  interface Post {
    data: {
      title: string;
      logType?: string;
      [key: string]: any;
    };
  }

  // 1. Props in Svelte 5 use $props()
  let { posts = [] }: { posts: Post[] } = $props();

  // 2. Reactive state uses $state()
  let active = $state<Filter>("all");

  // 3. Derived state replaces $: statements
  let filteredPosts = $derived(
    active === "all"
      ? posts
      : posts.filter((post) => post.data.logType === active)
  );

  const tabs: { label: string; value: Filter }[] = [
    { label: "All", value: "all" },
    { label: "Reading", value: "reading" },
    { label: "Work", value: "work" },
  ];
</script>

<nav class="log-tabs">
  {#each tabs as tab}
    <button
      type="button"
      class="tab"
      class:active={active === tab.value}
      onclick={() => (active = tab.value)}
    >
      {tab.label}
    </button>
  {/each}
</nav>


<PaginatedPostList  posts={filteredPosts} />


<style>
  .log-tabs {
    display: inline-flex;
    gap: 0.25rem;
    padding: 0.25rem;
    border-radius: 9999px;
    background: var(--code-bg);
    border: 1px solid var(--border);
    margin-bottom: 2rem;
  }

  .tab {
    background: transparent;
    border: 0;
    cursor: pointer;
    padding: 0.375rem 0.875rem;
    border-radius: 9999px;
    font-family: var(--sans);
    font-size: var(--font-size-s);
    color: var(--text-secondary);
    transition: color 0.15s ease-out, background-color 0.15s ease-out;
  }

  .tab:hover {
    color: var(--text-primary);
    background-color: var(--astro-code-background);
  }

  .tab.active {
    background-color: var(--text-primary);
    color: var(--astro-code-background);
    font-weight: var(--font-weight-bold);
  }

  .posts {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
</style>