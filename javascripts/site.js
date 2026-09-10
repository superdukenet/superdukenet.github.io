document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('searchbox');
  const panel = document.getElementById('hits');
  const status = document.getElementById('search-status');
  if (!container || !panel || !status) return;

  function unavailable() {
    status.hidden = false;
    panel.hidden = true;
  }

  if (typeof instantsearch !== 'function' || typeof algoliasearch !== 'function') {
    unavailable();
    return;
  }

  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }

  function archiveLink(value) {
    try {
      const url = new URL(value, window.location.origin);
      if (!['https:', 'http:'].includes(url.protocol)) return null;
      // Existing crawler records contain the live archive's absolute URLs.
      // Keep those paths on this copy of the archive, including local previews.
      if (url.origin !== window.location.origin && !['superdukenet.com', 'www.superdukenet.com', 'superdukenet.github.io'].includes(url.hostname)) return null;
      return url.pathname + url.search + url.hash;
    } catch (_error) {
      return null;
    }
  }

  try {
    let dismissed = false;
    const search = instantsearch({
      indexName: 'www_superdukenet_com_chbwurh18t_pages',
      searchClient: algoliasearch('CHBWURH18T', '7ca41a7286d6a58a7d6cf0d29038cb73'),
    });

    search.addWidgets([
      instantsearch.widgets.searchBox({
        container: '#searchbox',
        placeholder: 'Search the forum archive…',
        showReset: true,
        showSubmit: false,
      }),
      instantsearch.widgets.configure({ hitsPerPage: 6 }),
      instantsearch.widgets.hits({
        container: '#hits-list',
        templates: {
          item: function (hit) {
            const path = archiveLink(hit.url);
            const count = Array.isArray(hit.posts) ? hit.posts.length : null;
            const body = '<strong>' + escapeHTML(hit.title || 'Untitled discussion') + '</strong>' +
              (count === null ? '' : '<span>' + count.toLocaleString() + ' post' + (count === 1 ? '' : 's') + '</span>');
            return path ? '<a class="search-hit" href="' + escapeHTML(path) + '">' + body + '</a>' : '<div class="search-hit">' + body + '</div>';
          },
          empty: '<p class="search-empty">No discussions found. Try a different word or browse the forums.</p>',
        },
        transformItems: function (items, context) {
          return context.results.query ? items : [];
        },
      }),
      instantsearch.widgets.pagination({
        container: '#hits-pagination',
        padding: 1,
        showFirst: false,
        showLast: false,
      }),
    ]);

    search.on('render', function () {
      const input = container.querySelector('input');
      if (input) {
        input.setAttribute('aria-label', 'Search the forum archive');
        input.setAttribute('aria-controls', 'hits');
      }
      const hasQuery = Boolean(search.helper && search.helper.state.query.trim());
      panel.hidden = !hasQuery || dismissed;
      status.hidden = true;
    });
    search.on('error', unavailable);
    search.start();

    container.addEventListener('input', function () { dismissed = false; });
    container.addEventListener('focusin', function () {
      dismissed = false;
      if (search.helper && search.helper.state.query.trim() && status.hidden) panel.hidden = false;
    });
    document.getElementById('close-search').addEventListener('click', function () {
      const input = container.querySelector('input');
      if (input) input.focus();
      dismissed = true;
      panel.hidden = true;
    });
    document.addEventListener('click', function (event) {
      if (!container.parentElement.contains(event.target)) {
        dismissed = true;
        panel.hidden = true;
      }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !panel.hidden) {
        const input = container.querySelector('input');
        if (input) input.focus();
        dismissed = true;
        panel.hidden = true;
      }
    });
    container.parentElement.addEventListener('focusout', function (event) {
      if (event.relatedTarget && !container.parentElement.contains(event.relatedTarget)) {
        dismissed = true;
        panel.hidden = true;
      }
    });
  } catch (_error) {
    unavailable();
  }
});
