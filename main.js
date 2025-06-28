const source = {
  name: "One Pace",
  version: 1,
  lang: "en",
  async fetchManga() {
    return [{
      title: "One Pace",
      id: "onepace",
      cover: "",
      description: "Fan-edited version of One Piece anime from onepace.net",
      status: "ONGOING"
    }];
  },
  async fetchChapters(mangaId) {
    const doc = await Source.request("https://onepace.net/en/watch").then(res => res.html());
    const episodes = [];

    doc.selectAll(".video-card").forEach((el, i) => {
      const title = el.selectFirst(".text-white")?.text() || "Episode " + (i + 1);
      const id = el.selectFirst("a")?.attr("href") || "#";
      episodes.push({
        title,
        id: id,
        number: i + 1
      });
    });

    return episodes;
  },
  async fetchChapter(chapter) {
    const doc = await Source.request("https://onepace.net" + chapter.id).then(res => res.html());
    const videoSrc = doc.selectFirst("video source")?.attr("src") || "";
    return {
      pages: [videoSrc]
    };
  }
};
export default source;