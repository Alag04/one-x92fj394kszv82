async function fetchAnimeList() {
  const res = await fetch("https://onepace.net/api/episodes");
  const data = await res.json();

  return data.map((episode) => ({
    title: episode.title,
    url: `https://onepace.net/watch/${episode.slug}`,
    description: episode.synopsis,
    thumbnail: episode.thumbnail,
  }));
}

async function fetchAnimeDetails(url) {
  const res = await fetch(url);
  const html = await res.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const title = doc.querySelector("h1")?.textContent.trim();
  const description = doc.querySelector("meta[name='description']")?.getAttribute("content");
  const videoUrl = doc.querySelector("video source")?.getAttribute("src");

  return {
    title,
    description,
    episodes: [
      {
        title: title,
        url: videoUrl,
        type: "video",
      },
    ],
  };
}

export default {
  id: "onepace",
  name: "One Pace",
  version: 1,
  icon: "https://onepace.net/favicon.ico",
  fetchAnimeList,
  fetchAnimeDetails,
};
