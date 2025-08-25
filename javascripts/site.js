// This is where it all goes :)

document.addEventListener("DOMContentLoaded", function (event) {
  const btn = document.getElementById("mobile-menu-button");
  const menu = document.getElementById("mobile-menu");

  btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });

  const search = instantsearch({
    indexName: "www_superdukenet_com_chbwurh18t_pages",
    searchClient: algoliasearch(
      "CHBWURH18T",
      "7ca41a7286d6a58a7d6cf0d29038cb73"
    ),
  });

  search.addWidget(
    instantsearch.widgets.searchBox({
      container: "#searchbox",
      placeholder: "Search...",
      showReset: false,
      showSubmit: false,
      cssClasses: {
        input:
          "w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500",
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.hits({
      container: "#hits-list",
      cssClasses: {
        list: "list-none m-0 p-0 flex flex-col",
        item: "w-full",
      },
      templates: {
        item(hit) {
          const postCount = hit.posts.length;
          const lastPost = hit.posts[postCount - 1];
          const lastPostTimestamp = lastPost.timestamp
            ? new Date(lastPost.timestamp).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Unknown";

          return `
          <a href="${hit.url || "#"}"
             class="block px-4 py-3 text-sm hover:bg-gray-50 text-gray-800 border-b border-gray-100">
            <div class="font-semibold mb-1">
              ${instantsearch.highlight({ attribute: "title", hit })}
            </div>
            <div class="text-xs text-gray-500 flex justify-between">
              <span>${postCount} post${postCount !== 1 ? "s" : ""}</span>
              <span>Last post: ${lastPostTimestamp}</span>
            </div>
          </a>
        `;
        },
        empty: `
        <div class="px-4 py-3 text-sm text-gray-500 italic">No results found</div>
      `,
      },
      transformItems(items, { results }) {
        if (!results.query) return [];
        return items;
      },
    })
  );

  // Pagination widget — inside the same parent
  search.addWidget(
    instantsearch.widgets.pagination({
      container: "#hits-pagination",
      padding: 1,
      cssClasses: {
        root: "flex justify-center mt-2 pb-2",
        list: "flex space-x-2",
        item: "",
        selectedItem: "font-bold bg-gray-200",
        link: "px-3 py-2 border border-gray-300 rounded bg-gray-100 text-sm",
      },
    })
  );

  // Hide #hits until a query is entered
  search.on("render", () => {
    const hits = document.querySelector("#hits");
    const query = search.helper?.state?.query?.trim();

    hits.style.display = query ? "block" : "none";
  });

  search.start();

  document.addEventListener("click", function (event) {
    const searchbox = document.querySelector("#searchbox");
    const hits = document.querySelector("#hits");

    // If click is outside both search input and results container
    if (!searchbox.contains(event.target) && !hits.contains(event.target)) {
      hits.style.display = "none";
    }
  });
});
