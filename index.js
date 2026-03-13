async function loadBlogs() {
	const blogGrid = document.getElementById("blog-grid");
	if (!blogGrid) {
		return;
	}

	const endpoint =
		"https://public-api.wordpress.com/rest/v1.1/sites/mishrasword.wordpress.com/posts/?number=3&fields=ID,date,URL,title,excerpt";

	try {
		const response = await fetch(endpoint);
		if (!response.ok) {
			throw new Error("Failed to fetch blog posts");
		}

		const payload = await response.json();
		const posts = payload.posts || [];

		if (!posts.length) {
			blogGrid.innerHTML = '<p class="section-copy">No blog posts found.</p>';
			return;
		}

		blogGrid.innerHTML = posts
			.map((post) => {
				const title = post.title || "Untitled";
				const excerptHtml = post.excerpt || "";
				const excerptText = excerptHtml.replace(/<[^>]*>/g, "").trim();
				const shortExcerpt =
					excerptText.length > 180
						? excerptText.slice(0, 180) + "..."
						: excerptText;

				const date = new Date(post.date).toLocaleDateString("en-US", {
					year: "numeric",
					month: "short",
					day: "numeric",
				});

				return `
         			<article class="panel card blog-card">
         			  <div>
         			    <div class="blog-meta">From the blog</div>
         			    <h3>${title}</h3>
         			    <p class="blog-desc">${shortExcerpt}</p>
         			  </div>
         			  <div class="blog-actions">
         			    <span class="blog-date">${date}</span>
         			    <a class="blog-link" href="${post.URL}" target="_blank" rel="noreferrer">Read More</a>
         			  </div>
         			</article>
        		`;
			}).join("");
	} catch (error) {
		blogGrid.innerHTML = '<p class="section-copy">Unable to load blog posts right now. Please visit the full blog.</p>';
		console.error(error);
	}
}

loadBlogs();
