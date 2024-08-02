document.addEventListener('DOMContentLoaded', function() {
    fetch('/_base.html')
        .then(response => response.text())
        .then(html => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');

            // Replace title
            doc.title = document.title;

            // Replace navigation items
            let navItems = document.body.querySelector('<!-- NAVIGATION_ITEMS -->').nextSibling;
            doc.querySelector('<!-- NAVIGATION_ITEMS -->').replaceWith(navItems);

            // Replace content
            let content = document.body.querySelector('<!-- CONTENT -->').nextSibling;
            doc.querySelector('<!-- CONTENT -->').replaceWith(content);

            // Replace the entire document
            document.documentElement.innerHTML = doc.documentElement.innerHTML;
        });
});
</script>